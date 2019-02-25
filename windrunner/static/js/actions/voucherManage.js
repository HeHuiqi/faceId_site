import ajax from 'utils/request';

export function getUserVouchers(params) {
    return ajax('GET', '/user/vouchers', params);
}

export function getUserCanUseVouchers() {
    return ajax('GET', '/user/vouchers', {
        start: 0,
        limit: 100,
        status: 2
    });
}




// WEBPACK FOOTER //
// ./src/actions/voucherManage.js