import ajax, {
    getRealUrl,
    jsonToString
} from 'utils/request';
export function getAllClient(params) {
    return ajax('GET', '/staff/users', params);
}
export function getAuthClient() {
    return ajax('GET', '/staff/auth_users');
}

export function getUserStatistics(params) {
    return ajax('GET', '/staff/user/statistics', params);
}

export function getStatisticsById(id) {
    return (params) => {
        return ajax('GET', '/staff/user/' + id + '/statistics', params);
    };
}
export function exportStatistics(params) {
    const str = jsonToString(params);
    return getRealUrl('/staff/user/export_statistics?' + str);
}
export function exportStatisticsById(id) {
    return (params) => {
        const str = jsonToString(params);
        return getRealUrl('/staff/user/' + id + '/export_statistics?' + str);
    };
}
export function exportClients(params) {
    const str = jsonToString(params);
    return getRealUrl('/staff/export_users?' + str);
}

//充值

export function recharge(id, amount) {
    amount = parseFloat(amount);
    return ajax('PUT', '/staff/recharge/' + id, {
        amount
    });
}

/**
 * @description 更新客户关联的商务
 * @param {number} id userid
 * @param {number} business business id, 取消关联商务时，business=0
 */
export function updateBusiness(id, business) {
    return ajax('PUT', '/staff/user/' + id, {
        business
    });
}

//获取商务列表
export function getBusiness() {
    return ajax('GET', '/staff/business');
}



// WEBPACK FOOTER //
// ./src/actions/adminClients.js