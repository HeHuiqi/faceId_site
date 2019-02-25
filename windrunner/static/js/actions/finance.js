import ajax, {
    syncAjax
} from 'utils/request';
import {
    getDocUrl
} from 'utils/tool.js';

export function getTrades(params) {
    return ajax('GET', '/trade', params);
}

export function getTradeRes(trade_no) {
    return syncAjax('GET', '/trade/' + trade_no);
}

export function getBalance() {
    return ajax('GET', '/balance');
}

export function pay(params) {
    return syncAjax('POST', '/trade', params);
}
export function continuePay(trade_no) {
    return syncAjax('GET', '/trade/' + trade_no);
}
export function closeRecharge(trade_no) {
    return syncAjax('PUT', '/trade/' + trade_no + ':close');
}

export function checkProblem(trade_no) {
    return getTradeRes(trade_no).then(res => {
        if (res.status !== 4) {
            window.open(getDocUrl('/docs/faq-pay.html'));
        }
    });
}

//获取资源包
export function getResourceBundle(params) {
    return ajax('GET', '/bundle_list', params);
}

//获取次数包充值规格
export function getBundleList(params) {
    return ajax('GET', '/bundle', params);
}

//获取资源包列表
export function getBundleTradeNoList() {
    return ajax('GET', '/bundle/trade_no');
}

//获取用量列表
export function getBundleStatistics(params) {
    return ajax('GET', '/bundle/statistics', params);
}

//购买资源包
export function buyBundle(params) {
    return ajax('POST', '/bundle', params);
}



// WEBPACK FOOTER //
// ./src/actions/finance.js