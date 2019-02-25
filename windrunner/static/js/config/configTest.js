const config = {
    basename: '/faceopen',
    docUrl: 'http://faceid.open/faceid-open-doc',
    loginFaceId: 'http://faceid.console',
    // zhongjinPayUrl: 'http://test.cpcn.com.cn/Gateway/InterfaceI',
    zhongjinPayUrl: 'https://www.china-clearing.com/Gateway/InterfaceI',
    logUrl: 'https://faceid-test.cn-beijing.log.aliyuncs.com/logstores/faceid-open/track?APIVersion=0.6.0',
    liteH5Demo: 'http://10.104.4.58:8010/lite/v1/demo',
    liteMiniDemo: require('../image/lite-demo-wx.jpg'),
    liteUCH5Demo: 'http://10.104.4.58:8010/lite/v1/demo?isuc=true',
    liteUCMiniDemo: require('../image/lite-uc-demo-wx.png'),
    liteIDCardH5Demo: 'http://10.104.4.58:8010/lite_ocr/v1/demo',
    liteIDCardMiniDemo: require('../image/lite-idcard-demo-wx.png')
};

export default config;



// WEBPACK FOOTER //
// ./src/config/configTest.js