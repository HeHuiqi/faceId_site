import {
    createStore
} from 'redux';
import reducers from '../reducers';

const stores = function (initialState) {
    const store = createStore(reducers, initialState);


    return store;
};
export default stores;



// WEBPACK FOOTER //
// ./src/utils/stores.js