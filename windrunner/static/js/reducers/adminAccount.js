const initialState = {
    info: null
};
module.exports = function (state = initialState, action) {
    const nextState = {
        ...state
    };
    switch (action.type) {
        case 'GET_BASE_ADMIN_ACCOUNT_INFO':
            {
                nextState.info = action.data;
                return nextState;
            }
        case 'GET_BASE_ADMIN_ACCOUNT_FAIL':
            {
                nextState.info = {};
                return nextState;
            }
        default:
            {
                return state;
            }
    }
};



// WEBPACK FOOTER //
// ./src/reducers/adminAccount.js