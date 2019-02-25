import * as account from 'actions/account';
import * as oldAccount from 'actions/oldAccount';


function checkUser(username) {
    return account.checkUserName(username).then(e => {
        let _promise;
        if (e.data.exist === 2) {
            _promise = Promise.resolve(oldAccount);
        } else if (e.data.exist === 1) {
            _promise = Promise.resolve(account);
        } else {
            _promise = Promise.reject({
                data: {
                    msg: '用户不存在',
                    exist: e.data.exist
                }
            });
        }
        return _promise;
    });
}


export function resetPassword(params) {
    return checkUser(params.username).then(req => {
        return req.resetPassword(params);
    });
}

export function forgetPassword(username, email) {
    return checkUser(username).then(req => {
        return req.forgetPassword(username, email);
    });
}

export function login(username, password, captcha) {
    return checkUser(username).then(req => {
        return req.login(username, password, captcha);
    });
}



// WEBPACK FOOTER //
// ./src/actions/accountMiddle.js