const initialState = {
    info: null
};
module.exports = function (state = initialState, action) {
    const nextState = {
        info: {
            ...state.info
        }
    };

    switch (action.type) {
        case 'GET_BASE_ACCOUNT_INFO':
            {
                nextState.info = {
                    ...action.data
                };
                return nextState;
            }
        case 'GET_BASE_ACCOUNT_FAIL':
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
// ./src/reducers/account.js