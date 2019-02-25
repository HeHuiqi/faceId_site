import moment from 'moment';
import config from 'config';
import {
    PAY_TYPE
} from 'utils/const';
import Horus from '@honour/horus';

export const toUrl = function (url) {
    window.location.href = config.basename + url;
};
export const getUrl = function (url) {
    return config.basename + url;
};
export const getDocUrl = function (url) {
    return config.docUrl + url;
};
//incluedToday true,今天与今天之后的为false
//incluedToday false,今天之后的为false,今天为true
export const disabledDateAfterNow = function (current, incluedToday = false) {
    let compareMoment = moment();
    if (!incluedToday) {
        compareMoment = moment().subtract(1, 'days');
    }
    if (current) {
        return current.isAfter(compareMoment, 'day') || current.isBefore('2018-05-01', 'day');
    }
    return current;
};

export const comdify = function (n) {
    n = n + '';
    const re = /\d{1,3}(?=(\d{3})+$)/g;
    const n1 = n.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
        return s1.replace(re, '$&,') + s2;
    });
    return n1;
};

export const payMethod = function (type, params) {
    switch (type) {
        case PAY_TYPE.OFFLINE:
            break;
        case PAY_TYPE.ALIPAY:
            window.open('https://mapi.alipay.com/gateway.do?' + params);
            break;
        case PAY_TYPE.PERSONAL:
        case PAY_TYPE.ENTERPRISE:
            postFormZhongjin(params);
            break;
        default:
            break;
    }
};
const postFormZhongjin = (params) => {
    const f = document.createElement('form');
    f.method = 'post';
    f.action = config.zhongjinPayUrl;
    f.target = '_black';
    document.body.appendChild(f);
    Object.keys(params).forEach(item => {
        const i = document.createElement('input');
        i.type = 'hidden';
        f.appendChild(i);
        i.value = params[item];
        i.name = item;
    });
    f.submit();
};


export const $horus = new Horus({
    project: 'FACEID-WEB',
    url: config.logUrl
});



// WEBPACK FOOTER //
// ./src/utils/tool.js