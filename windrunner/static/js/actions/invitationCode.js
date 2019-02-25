import ajax from 'utils/request';

// 获取邀请码列表 [GET /demo/search]
export function getInvitationCode(params) {
    return ajax('GET', '/demo/search', params);
}
// 创建邀请码  [POST /demo/update]
export function createInvitationCode(params) {
    return ajax('POST', '/demo/update', params);
}



// WEBPACK FOOTER //
// ./src/actions/invitationCode.js