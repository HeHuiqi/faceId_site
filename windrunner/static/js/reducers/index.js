import {
    combineReducers
} from 'redux';

const req = require.context('./', false, /.js/);
const reducers = {};
req.keys().map(item => {
    const str = item.match(/\.\/(.*).js/)[1];
    if (str && str !== 'index') {
        reducers[str] = req(item);
    }
    return null;
});

export default combineReducers(reducers);



// WEBPACK FOOTER //
// ./src/reducers/Overview.js