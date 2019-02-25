import ajax from 'utils/request';

export function getCoupons(params) {
    return ajax('GET', '/staff/vouchers_list', params);
}

export function delayCoupons(params) {
    return ajax('PUT', '/staff/batch_vouchers', params);
}
export function deleteCoupons(params) {
    return ajax('DELETE', '/staff/batch_vouchers', params);
}

export function createCoupon(params) {
    return ajax('PUT', '/staff/vouchers', params);
}

export function getCoupon(params) {
    return ajax('GET', '/staff/op_vouchers', params);
}

export function editCoupon(params) {
    return ajax('PUT', '/staff/op_vouchers', params);
}

//代金券审批
//control:accept/refuse
export function setCouponApproval(id, control) {
    return ajax('POST', '/staff/vouchers/' + id + ':' + control);
}
//获取代金券申请者
export function getCouponCreators() {
    return ajax('GET', '/staff/vouchers_creators');
}

//获取审批人
export function getCouponApprovers() {
    return ajax('GET', '/staff/vouchers_approvers');
}



// WEBPACK FOOTER //
// ./src/actions/coupon.js