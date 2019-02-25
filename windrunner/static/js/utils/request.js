import {
    Modal
} from 'antd';
import Cookies from 'js-cookie';
import reqwest from 'reqwest';
import {
    toUrl
} from 'utils/tool.js';
const API_URL = '/openapi';
// Promise.prototype.done = function (callback) {
//     const Promise = this.constructor;
//     return this.then(
//         function (value) {
//             Promise.resolve(callback());
//         },
//         function (reason) {
//             Promise.resolve(e=>{

//             });
//         }
//     );
// };
function parseJSON(response) {
    return response.text().then((responseText) => {
        return JSON.parse(responseText.replace('for(;;);', ''));
    });
    // return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(response.statusText);
    if (response.status === 401) {
        error.code = 3;
    }
    if (response.status === 403) {
        error.code = 403;
    }
    error.response = response;
    error.response.prototype = response.prototype;
    throw error;
}

export function jsonToString(json) {
    const res = [];
    for (const key in json) {
        res.push(key + '=' + json[key]);
    }
    return res.join('&');
}

function jsonToFormData(json) {
    const res = new FormData();
    for (const key in json) {
        res.append(key, json[key]);
    }

    return res;
}

function syncRequest(url, options) {
    const _promise = new Promise(function (resolve, reject) {
        const _reqwest = reqwest({
            url,
            contentType: 'application/json',
            headers: options.headers,
            method: options.method,
            data: options.body,
            async: false
        });
        const {
            request
        } = _reqwest;
        try {
            const resJson = JSON.parse(request.responseText);
            const res = {};
            res.data = resJson;
            if (request.status !== 200) {
                if (request.status === 401) {
                    res.error = {
                        msg: '未登录',
                        code: 3
                    };
                } else if (request.status === 403) {
                    res.error = {
                        msg: '暂无权限',
                        code: 403
                    };
                } else {
                    res.error = {
                        msg: '发生错误',
                        code: 4
                    };
                }
                if (!res.data.msg) {
                    res.data.msg = res.error.msg;
                }
            }
            resolve(res);
        } catch (e) {
            resolve({
                error: {
                    msg: '发生错误，请稍后重试',
                    code: 0
                },
                data: {
                    msg: '发生错误，请稍后重试'
                }
            });
        }
    });
    return _promise;
}


export function request(url, options, noAutoCatch, sync, notAutoGoLogin) {
    //模拟超时情况
    if (Cookies.get('csrftoken')) {
        options.headers['X-CSRFToken'] = Cookies.get('csrftoken');
    }
    let promise;
    if (sync) {
        //同步
        promise = syncRequest(url, options);
    } else {
        //异步
        promise = fetch(url, options);
    }
    //异步超时处理
    const timeoutPromise = new Promise(function (resolve) {
        setTimeout(() => {
            return resolve({
                error: {
                    msg: '请求超时，请重试',
                    code: 1
                }
            });
        }, 30000);
    });

    const req = Promise.race([promise, timeoutPromise]);
    let _req;
    if (sync) {
        //同步then参数为结果，无需处理
        _req = req.then();
    } else {
        //异步
        _req = req.then(checkStatus)
            .then(parseJSON)
            .then((data) => {

                return {
                    data
                };
            }).catch((e) => {
                if (e.response) {

                    return e.response.json().then(res => {
                        const _res = {};
                        _res.data = res;
                        if (e.code === 3) {
                            _res.error = {
                                msg: '未登录',
                                code: 3
                            };
                        } else if (e.code === 403) {
                            _res.error = {
                                msg: '暂无权限',
                                code: 403
                            };
                        } else {
                            _res.error = {
                                msg: '发生错误',
                                code: 4
                            };
                        }
                        if (!_res.data.msg) {
                            _res.data.msg = _res.error.msg;
                        }
                        return _res;
                    });
                } else {
                    const _res = {};
                    _res.data = {};
                    if (e.code === 3) {
                        _res.error = {
                            msg: '未登录',
                            code: 3
                        };
                    } else if (e.code === 403) {
                        _res.error = {
                            msg: '暂无权限',
                            code: 403
                        };
                    } else {
                        _res.error = {
                            msg: '发生错误，请稍后重试',
                            code: 0
                        };
                    }
                    _res.data.msg = _res.error.msg;
                    return _res;
                }
            }).catch((e) => {
                return {
                    error: {
                        msg: '发生错误，请稍后重试',
                        code: 0
                    },
                    data: {
                        msg: '发生错误，请稍后重试'
                    }
                };
            });
    }

    return _req.then(res => {
        if (res.error) {
            if (!notAutoGoLogin && res.error.code === 3) {
                toUrl('/login');
                return Promise.reject(res);
            }

            if (!noAutoCatch) {
                let msg = '发生错误，请稍后重试';
                if (res.data.code === 999) {
                    Object.keys(res.data.msg).forEach(key => {
                        msg = res.data.msg[key];
                    });
                } else {
                    msg = res.data.msg || res.error.msg;
                }
                if (res.error.code === 403) {
                    const modalNode = document.getElementsByClassName('forbidden-modal');
                    if (modalNode.length < 1) {
                        Modal.warning({
                            className: 'forbidden-modal',
                            title: '暂无权限',
                            content: '请联系管理员：薛猛（xuemeng@megvii.com）'
                        });
                    }

                } else {
                    Modal.error({
                        title: '错误',
                        content: msg
                    });
                }
            }

            return Promise.reject(res);
        } else {
            return res;
        }

    });
}
export function syncAjax(type, url, params, noAutoCatch = false, notAutoGoLogin = false) {
    const _url = API_URL + url;
    return createRequest(type, _url, params, noAutoCatch, true, notAutoGoLogin);
}

export default function ajax(type, url, params, noAutoCatch = false, notAutoGoLogin = false) {
    const _url = API_URL + url;
    return createRequest(type, _url, params, noAutoCatch, false, notAutoGoLogin);
}

export function createRequest(type, url, params, noAutoCatch = false, sync = false, notAutoGoLogin = false) {
    let _url = url;
    const option = {
        credentials: 'include',
        method: type,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (type === 'GET') {
        const _params = jsonToString(params);
        _url = url + '?_=' + new Date().getTime() + '&' + _params;
        option.body = undefined;
    } else {
        option.body = params ? JSON.stringify(params) : undefined;
    }
    return request(_url, option, noAutoCatch, sync, notAutoGoLogin);
}

export function requestFormData(type, url, params, noAutoCatch = false) {
    return request(API_URL + url, {
        credentials: 'include',
        method: type,
        headers: {},
        body: jsonToFormData(params)
    }, noAutoCatch);
}

export function getRealUrl(url) {
    return API_URL + url;
}
export function getAbsoluteRealUrl(url) {
    return window.location.origin + getRealUrl(url);
}



// WEBPACK FOOTER //
// ./src/utils/request.js