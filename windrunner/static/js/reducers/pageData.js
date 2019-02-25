const initialState = {
    breadcrumb: [],
    bc_params: {},
    route: '',
    path: '',
    title: ''
};
module.exports = function (state = initialState, action) {
    const nextState = {
        ...state
    };
    switch (action.type) {
        case 'SET_BREADCRUMB_PARAMS_DONE':
            {
                nextState.bc_params = action.data;
                return nextState;
            }
        case 'SET_PAGE_TITLE_DONE':
            {
                nextState.title = action.data;
                return nextState;
            }
        case 'SET_PAGE_DATA_DONE':
            {
                const {
                    data
                } = action;
                nextState.breadcrumb = data.breadcrumb;
                nextState.route = data.route;
                nextState.path = data.path;
                nextState.title = data.title;
                return nextState;
            }
        default:
            {
                return state;
            }
    }
};



// WEBPACK FOOTER //
// ./src/reducers/pageData.js