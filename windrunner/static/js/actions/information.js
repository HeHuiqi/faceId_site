import ajax from 'utils/request';

export function getNewMessage() {
    return ajax('GET', '/user/new_message');
}
export function getMessages(params) {
    return ajax('GET', '/user/message', params);
}
export function getStaffMessages(params) {
    return ajax('GET', '/staff/message', params);
}
export function getMessageById(params) {
    return ajax('GET', '/staff/get_message', params);
}
export function createMessage(params) {
    return ajax('POST', '/staff/create_message', params);
}
export function sendMessage(params) {
    return ajax('POST', '/staff/send_message', params);
}
export function updateMessage(params) {
    return ajax('PUT', '/staff/update_message', params);
}
export function deleteMessage(params) {
    return ajax('DELETE', '/staff/delete_message', params);
}


// WEBPACK FOOTER //
// ./src/actions/information.js