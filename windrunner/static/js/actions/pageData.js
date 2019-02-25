export function setBreadcrumb(params) {
    return function (dispatch) {
        dispatch({
            type: 'SET_BREADCRUMB_PARAMS_DONE',
            data: params
        });
    };
}
export function setPageTitle(title) {
    return function (dispatch) {
        dispatch({
            type: 'SET_PAGE_TITLE_DONE',
            data: title
        });
    };
}

export function setPageData(params) {
    return function (dispatch) {
        dispatch({
            type: 'SET_PAGE_DATA_DONE',
            data: params
        });
    };
}



// WEBPACK FOOTER //
// ./src/actions/pageData.js