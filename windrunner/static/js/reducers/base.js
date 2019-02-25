const initialState = {
    type: '',
    message: ''
};
module.exports = function (state = initialState, action) {
    const nextState = {
        ...state
    };
    switch (action.type) {
        case 'BASE_MODAL':
            {
                nextState.type = action.data;
                return nextState;
            }
        case 'BASE_MODAL_CLEAR':
            {
                nextState.type = 'action.data';
                return nextState;
            }
        default:
            {
                return state;
            }
    }
};



// WEBPACK FOOTER //
// ./src/reducers/base.js