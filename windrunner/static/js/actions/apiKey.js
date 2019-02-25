import ajax, {
    syncAjax
} from 'utils/request';

export function createApiKey(name, description) {
    return ajax('POST', '/api_key', {
        name,
        description
    });
}
export function getApiKey(id) {
    return syncAjax('GET', '/api_key/' + id);
}
export function getApiKeys(params) {
    return ajax('GET', '/api_key', params);
}

//state:[disable,enable]
export function toggleApiKey(id, state) {
    return ajax('POST', '/api_key/' + id + ':' + state);
}

export function editApiKey(id, name, description) {
    return ajax('PUT', '/api_key/' + id, {
        name,
        description
    });
}



// WEBPACK FOOTER //
// ./src/actions/apiKey.js