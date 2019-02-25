import ajax, {
    getRealUrl,
    jsonToString
} from 'utils/request';

export function getOfflineTrade(params) {
    return ajax('GET', '/staff/trade/offline', params);
}
//type:close,confirm
export function changeOfflineTrade(id, type) {
    const baseUrl = '/staff/trade/offline/' + id + ':' + type;
    return ajax('PUT', baseUrl);
}

//导出订单
export function exportTrade(params) {
    const str = jsonToString(params);
    return getRealUrl('/staff/trade/export_offline?' + str);
}
//获取所有订单用户列表
export function getTradeClient() {
    return ajax('GET', '/trade/users');
}



// WEBPACK FOOTER //
// ./src/actions/adminOfflineTrade.js