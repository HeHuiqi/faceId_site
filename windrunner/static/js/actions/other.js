import ajax from 'utils/request';

export function getKF() {
    return ajax('GET', '/user/kf', null, true);
}



// WEBPACK FOOTER //
// ./src/actions/other.js