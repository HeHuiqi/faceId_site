import ajax, {
    getRealUrl,
    jsonToString
} from 'utils/request';

export function getComponents(params) {
    return ajax('GET', '/user/statistics', params);
}

export function exportComponents() {
    return (params) => {
        const str = jsonToString(params);
        return getRealUrl('/user/export_statistics?' + str);
    };

}

//获取次数包购买列表
export function getPurchaseComponents(params) {
    return ajax('GET', '/user/bundle/purchase/statistics', params);
}

export function exportPurchaseComponents() {
    return (params) => {
        const str = jsonToString(params);
        return getRealUrl('/user/bundle/purchase/export_statistics?' + str);
    };

}



// WEBPACK FOOTER //
// ./src/actions/components.js