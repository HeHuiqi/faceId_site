import ajax from 'utils/request';

// 获取账户列表
export function getAccounts(params) {
    return ajax('GET', '/staff/accounts', params);
}
// 查看账户详情
export function getAccountById(id) {
    return ajax('GET', `/staff/account/${id}`);
}
// 创建账号
export function createAccount(params) {
    return ajax('POST', '/staff/account', params);
}
// 编辑账号
export function editAccount(id, params) {
    return ajax('PUT', `/staff/account/${id}`, params);
}
// 删除账号
export function deleteAccount(id) {
    return ajax('DELETE', `/staff/account/${id}`);
}
// 管理员重置账号密码
export function resetPassword(id) {
    return ajax('PUT', `/staff/account/${id}/reset_password`);
}
// 修改账号密码
export function updatePassword(params) {
    return ajax('PUT', '/account/update_password', params);
}

// 获取角色列表
export function getAllRoles(params) {
    return ajax('GET', '/staff/roles', params);
}
// 获取权限点列表
export function getAllPermission(params) {
    return ajax('GET', '/staff/permissions', params);
}
// 获取角色关联的权限点列表
export function getPermissionOfRole(role_id) {
    return ajax('GET', `/staff/role/${role_id}/permissions`);
}
// 获取角色关联的账号列表
export function getAccountsOfRole(role_id) {

    return ajax('GET', `/staff/role/${role_id}/accounts`);
}
// 获取权限点关联的账号列表
export function getAccountsOfPermission(id) {
    return ajax('GET', `/staff/permission/${id}`);
}
// 创建角色
export function createRole(params) {
    return ajax('POST', '/staff/role', params);
}
// 更新角色
export function updateRole(role_id, params) {
    return ajax('PUT', `/staff/role/${role_id}`, params);
}
// 删除角色
export function deleteRole(role_id) {
    return ajax('DELETE', `/staff/role/${role_id}`);
}



// WEBPACK FOOTER //
// ./src/actions/permission.js