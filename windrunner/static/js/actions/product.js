import ajax, {
    syncAjax
} from 'utils/request';

export function getProductUrl(id) {
    return syncAjax('GET', '/service/' + id);
}

export function getDemoUrl(id) {
    return ajax('GET', '/demo/info/' + id);
}



// WEBPACK FOOTER //
// ./src/actions/product.js