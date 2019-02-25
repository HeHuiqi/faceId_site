import ajax from 'utils/request';

export function getAuthByClientId(id) {
    return ajax('GET', '/staff/auth_info/' + id);
}

export function changeAuthStateByClientId(id, type, reason) {
    const baseUrl = '/staff/auth_info/' + id + ':' + type;
    let params;
    if (reason) {
        params = {
            reason
        };
    }
    return ajax('PUT', baseUrl, params);
}

export function changeActionByClientId(id, type, reason) {
    const baseUrl = '/staff/user/' + id + ':' + type;
    let params = null;
    if (reason) {
        params = {
            reason
        };
    }
    return ajax('PUT', baseUrl, params);
}



// WEBPACK FOOTER //
// ./src/actions/adminAuthManage.js