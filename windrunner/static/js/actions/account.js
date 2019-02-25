import ajax from 'utils/request';
import {
    $horus
} from 'utils/tool';
import Cookies from 'js-cookie';

export function getAccountInfo(isAdmin, notAutoGoLogin) {
    let url = '/user/profile';
    // let type = 'GET_BASE_ACCOUNT_INFO';
    // let failType = 'GET_BASE_ACCOUNT_FAIL';
    if (isAdmin) {
        url = '/staff/profile';
        // type = 'GET_BASE_ADMIN_ACCOUNT_INFO';
        // failType = 'GET_BASE_ADMIN_ACCOUNT_FAIL';
    }
    return function (dispatch) {
        return ajax('GET', url, null, true, notAutoGoLogin).then(e => {
            dispatch({
                type: 'GET_BASE_ACCOUNT_INFO',
                data: e.data
            });
            if (!isAdmin) {
                //统计需求
                Cookies.set('account_id', e.data.account_id);
                $horus.setConfig('account_id', e.data.account_id);
                //统计需求 end
            }
        }).catch(() => {

            dispatch({
                type: 'GET_BASE_ACCOUNT_FAIL'
            });
        });
    };
}

export function checkLogin() {
    return ajax('GET', '/user/profile', null, true, true);
}

export function setUserInfo(data) {
    return function (dispatch) {
        dispatch({
            type: 'GET_BASE_ACCOUNT_INFO',
            data
        });
    };
}

export function login(username, password, captcha) {
    return ajax('POST', '/login', {
        username,
        password,
        captcha
    }, true);
}

export function adminLogin(username, password, captcha) {
    return ajax('POST', '/staff/login', {
        username,
        password,
        captcha
    }, true);
}

export function facePlusPlusLogin(username, password, captcha) {
    return ajax('POST', '/faceplusplus/login', {
        username,
        password,
        captcha
    }, true);
}

export function checkUserName(username) {
    return ajax('GET', '/check_username', {
        username
    });
}

export function register(params) {
    return ajax('POST', '/register', params, true);
}
export function emailToken(email, type = 'register_token') {
    return ajax('GET', '/email_token', {
        email,
        type
    });
}

export function forgetPassword(username, email) {

    return ajax('POST', '/forget_password', {
        username,
        email
    }, true);
}

export function resetPassword(params) {
    return ajax('POST', '/reset_password', params, true);
}

export function captcha(type, value) {
    return function (dispatch) {
        return ajax('GET', '/captcha', {
            type,
            value
        });
    };
}

export function logout() {
    return ajax('POST', '/logout', true);
}


export function getPhoneToken(phone, type = 'register_phone_token') {
    return ajax('GET', '/phone_token', {
        phone,
        type
    });
}

export function bindPhone(params) {
    return ajax('POST', '/bind_phone', params);
}
//face++/faceid绑定手机
export function phoneLogin(params) {
    return ajax('POST', '/phone_login', params, true);
}
//旧手机邮箱获取验证码
export function oldToken(type) {
    return ajax('GET', '/get_token', {
        type
    });
}
//验证验证码{value,token}
export function checkToken(params) {
    return ajax('POST', '/check_token', params);
}
//更新手机
export function updatePhone(params) {
    return ajax('PUT', '/update_phone', params);
}
//更新邮箱
export function updateEmail(params) {
    return ajax('PUT', '/update_email', params);
}

//用户概览-数据
export function getUserOverview() {
    return ajax('GET', '/user/overview');
}

//用户概览-统计
export function getUserReport(start_date, end_date) {
    return ajax('GET', '/user/report', {
        start_date,
        end_date
    });
}

//获取产品列表
export function getServiceIdList() {
    return ajax('GET', '/service_list');
}



// WEBPACK FOOTER //
// ./src/actions/account.js