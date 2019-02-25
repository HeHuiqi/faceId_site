import {
    createRequest
} from 'utils/request';

function request(tyep, url, params) {
    return createRequest(tyep, url, params, true, false, true).then(res => {
        res.accountType = 'old';
        return res;
    }).catch(res => {
        const data = {
            code: res.data.errcode || 4,
            msg: res.data.errmsg || '错误'
        };
        const error = {
            code: 4,
            msg: '发生错误'
        };
        return Promise.reject({
            data,
            error
        });
    });
}

export function login(username, password, captcha) {
    const params = {
        username,
        password
    };
    if (captcha) {
        params.captcha = captcha;
    }
    return request('POST', '/api/user/login', params);
}

export function forgetPassword(username, email) {
    const params = {
        username,
        email
    };
    return request('POST', '/api/user/send_recover_password_email', params);
}

export function resetPassword(params) {
    return request('POST', '/api/user/reset_password', params);
}

export function oldVerifyGetToken(token) {
    return request('POST', '/api/user/login/step2/send_sms', {
        token
    });
}

export function oldVerifyLogin(params) {
    return request('POST', '/api/user/login/step2/sms', params);
}

export function oldCheckLogin() {
    return request('GET', '/api/accounts/accounts_info');
}



// WEBPACK FOOTER //
// ./src/actions/oldAccount.js