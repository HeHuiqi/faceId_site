import moment from 'moment';
export const phoneReg = /^1+\d{10}$/;
export const passwordReg = /^[\w~!@#$%^*()+-=;'?/\\|><.,`[\]{}]+$/;
export const passwordRule = [{
        required: true,
        message: '请输入密码'
    },
    {
        pattern: passwordReg,
        message: '密码格式不正确'
    },
    {
        min: 6,
        message: '密码为6～20个字符'
    },
    {
        max: 20,
        message: '密码为6～20个字符'
    },
    {
        validator: (rule, value, callback) => {
            const _value = value || '';
            const valueArr = _value.split();
            const eg = /[a-zA-Z]/;
            const num = /\d/;
            const other = /[_~!@#$%^*()+\-=;'?/\\|><.,`[\]{}]/;
            const regArr = [eg, num, other];
            const typeKind = {};
            valueArr.map((item) => {
                regArr.map((item2, key) => {
                    if (item2.test(item)) {
                        typeKind[key] = true;
                    }
                    return null;
                });
                return null;
            });
            if (Object.keys(typeKind).length < 2) {
                callback('至少含有字母、数字、特殊字符中的两种字符');
            }
            callback();
        }
    }
];
export const usernameRule = [{
        required: true,
        message: '请输入用户名'
    },
    {
        pattern: /^\w{6,20}$/,
        message: '用户名为6-20个字符，字符只能是英文或数字或_'
    }
];

function Browser() {
    const userAgent = navigator.userAgent;
    const isOpera = userAgent.indexOf('Opera') > -1;
    if (isOpera) {
        return 'Opera';
    }; //判断是否Opera浏览器
    if (userAgent.indexOf('Firefox') > -1) {
        return 'FF';
    } //判断是否Firefox浏览器
    if (userAgent.indexOf('Chrome') > -1) {
        return 'Chrome';
    }
    if (userAgent.indexOf('Safari') > -1) {
        return 'Safari';
    } //判断是否Safari浏览器
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
        return 'IE';
    }; //判断是否IE浏览器
    if (userAgent.indexOf('Trident') > -1) {
        return 'Edge';
    } //判断是否Edge浏览器
}
export const browser = Browser();

function IESaveAs(imgURL) {
    const pop = window.open(imgURL, '', 'width=1, height=1, top=5000, left=5000');
    for (; pop.document.readyState !== 'complete';) {
        if (pop.document.readyState === 'complete') break;
    }
    pop.document.execCommand('SaveAs');
    pop.close();
}
export const downLoad = function (url, name) {
    if (Browser() === 'IE' || Browser() === 'Edge') {
        //IE
        const oImg = document.createElement('img');
        oImg.src = url;
        oImg.id = 'downImg';
        const odown = document.getElementById('down');
        odown.appendChild(oImg);
        IESaveAs(document.getElementById('downImg').src);
    } else {
        // const eleLink = document.createElement('a');
        // eleLink.download = name;
        // eleLink.style.display = 'none';
        // const beauty = new Image();
        // beauty.src = url;
        // beauty.crossOrigin = 'Anonymous';
        // // 图片转base64地址
        // const canvas = document.createElement('canvas');
        // const context = canvas.getContext('2d');
        // const width = beauty.natureWidth;
        // const height = beauty.natureHeight;
        // debugger;
        // context.drawImage(beauty, 0, 0);
        // // 如果是PNG图片，则context.toDataURL('image/png')
        // eleLink.href = canvas.toDataURL('image/jpeg');
        // // 触发点击
        // document.body.appendChild(eleLink);
        // eleLink.click();
        // // 然后移除
        // document.body.removeChild(eleLink);
    }
};

//用户认证状态
export const STATUS = {
    UNCERTIFIED: 99,
    TOCERTIFIED: 1,
    PASS: 3,
    DISMISSAL: 2,
    FACEPLUSPLUS: 10000 //标识face++用户
};


//支付类型
export const PAY_TYPE = {
    ALIPAY: 1,
    OFFLINE: 2,
    PERSONAL: 3,
    ENTERPRISE: 4
};
export const PAY_TYPE_INFO = {
    [PAY_TYPE.ALIPAY]: {
        image: require('../image/recharge-alipay.png'),
        name: '支付宝'
    }, //支付宝
    [PAY_TYPE.OFFLINE]: {
        image: require('../image/recharge-transfer.png'),
        name: '转账汇款'
    }, //线下
    [PAY_TYPE.PERSONAL]: {
        image: require('../image/recharge-geren.png'),
        imageDis: require('../image/recharge-geren-disabled.png'),
        name: '个人网银'
    },
    [PAY_TYPE.ENTERPRISE]: {
        image: require('../image/recharge-qiye.png'),
        imageDis: require('../image/recharge-qiye-disabled.png'),
        name: '企业网银',
        min: 500
    }
};
//产品id
export const SERVICE_ID = {
    FACE_VERIFY: 200010,
    FACE_COMPARE: 201010,
    OCR_IDCARD: 100000,
    LITE_VERIFY: 200021,
    LITE_COMPARE: 201021,
    LITE_OCR: 100001
};
//产品
export const SERVICE_MAP = {
    200: '人脸核身',
    201: '人脸比对',
    100: '身份证OCR'
};
//类型
export const SERVICE_TYPE_MAP = {
    0: 'SDK',
    1: 'Lite',
    2: 'SDK+Lite'
};
//用于结果查询翻译
export const SERVICE_ID_TEXT = {
    [SERVICE_ID.FACE_VERIFY]: '动作活体SDK',
    [SERVICE_ID.FACE_COMPARE]: '动作活体SDK',
    [SERVICE_ID.OCR_IDCARD]: '身份证识别SDK',
    [SERVICE_ID.LITE_VERIFY]: 'H5/小程序',
    [SERVICE_ID.LITE_COMPARE]: 'H5/小程序',
    [SERVICE_ID.LITE_OCR]: 'H5/小程序'
};



export const RANGE_TIME_INCLUED_TODAY = [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')];
export const RANGE_TIME_UNINCLUED_TODAY = [moment().subtract(7, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')];

//代金券状态
export const VOUCHER_STATUS = {
    'notstart': 1,
    'canuse': 2,
    'used': 3,
    'overdue': 4
};

// 产品形态
export const SERVICE_OPTIONS = [{
        label: '人脸核身',
        value: 'FACE_VERIFY'
    },
    {
        label: '人脸比对',
        value: 'FACE_COMPARE'
    },
    {
        label: '身份证识别',
        value: 'OCR_IDCARD'
    }
];

//产品接入方式
export const SERVICE_TYPE_OPTIONS = [{
        label: 'SDK',
        value: 'SDK'
    },
    {
        label: 'Lite',
        value: 'LITE'
    }
];
export function getServiceText(service_id) {
    switch (service_id) {
        case '200010': //人脸核身动作活体 sdk
        case '200021': //人脸核身视频活体 lite
            return '人脸核身';
        case '201010': //人脸比对动作活体 sdk
        case '201021': //人脸比对动作活体 sdk
            return '人脸比对';
        case '100000': //身份证识别 sdk
        case '100001': //身份证识别 lite
            return '身份证识别';
        default:
            return '';
    }
}

// parse params in location
export function parseSearch() {
    let search = window.location.search;

    if (!search) {
        return {};
    } else {
        search = search.slice(1);
        if (!search) {
            return {};
        }
        search = search.split('&');
        const res = {};
        search.forEach(item => {
            if (!item) {
                return false;
            }
            const [key, value] = item.split('=');
            res[key] = value;
        });
        return res;
    }
}



// WEBPACK FOOTER //
// ./src/utils/const.js