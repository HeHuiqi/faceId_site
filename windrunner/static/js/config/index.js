import configTest from './configTest';
import configProd from './configProd';
let config;
if (process.env.REACT_APP_ENV === 'test') {
    config = configTest;
} else {
    config = configProd;
}
export default config;



// WEBPACK FOOTER //
// ./src/config/Overview.js