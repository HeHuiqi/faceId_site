import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware } from 'redux';
import configureStore from './utils/stores.js';
import 'antd/dist/antd.css';
// import './theme.less';
import './index.less';
import App from './pages/IndexRouter';
// import registerServiceWorker from './registerServiceWorker';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {$horus} from 'utils/tool';

const store = configureStore(applyMiddleware(thunk));
$horus.occur('page', {url:window.location.href,ref:window.document.referrer});

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <Provider store={store}>
            <App />
        </Provider>
    </LocaleProvider>,
    document.getElementById('root')
);

// registerServiceWorker();



// WEBPACK FOOTER //
// ./src/Overview.js