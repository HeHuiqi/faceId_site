import ajax, {
    requestFormData
} from 'utils/request';

export function getAuth() {
    return ajax('GET', '/user/auth_info');
}

export function editAuth(params, isEdit) {
    let type = 'POST';
    if (isEdit) {
        type = 'PUT';
    }
    return requestFormData(type, '/user/auth_info', params, true);
}



// WEBPACK FOOTER //
// ./src/actions/clientAuth.js