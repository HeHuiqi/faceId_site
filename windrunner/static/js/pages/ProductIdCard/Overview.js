import React from 'react';
import {SERVICE_ID} from 'utils/const';
import TabOverview from 'components/OverviewComponents/TabOverview';
import config from 'config';
import jrQrcode from 'jr-qrcode';

export class Product extends React.Component {

    top = {
        partOne:{
            title:'FaceID 身份证识别服务',
            content:'FaceID 身份证识别服务提供了身份证核验及识别能力，用户在客户端上按照提示操作，获取有效身份证照片进行核验及识别，并将结果及对应照片信息返回。',
            docUrl:'/docs/idcard-android-sdkIntro.html',
            img:require('./face_overview01.png'),
            videoDemo:require('./faceDemo.mp4'),
            tabs:[
                {name:'APP下载',value:'app',serviceId:SERVICE_ID.OCR_IDCARD},
                {name:'H5体验',value:'h5',serviceId:SERVICE_ID.LITE_OCR,qrImg:jrQrcode.getQrBase64(config.liteIDCardH5Demo)},
                {name:'小程序体验',value:'lite',serviceId:SERVICE_ID.LITE_OCR,qrImg:config.liteIDCardMiniDemo}
            ],
            service: 100,
            bundle: 10000
        }
    }


    infos = [
        {
            name:'SDK',
            partTwo:{
                img:require('./yewu.png'),
                liArray:[
                    <li>APP调起SDK身份证识别服务，用户操作完成身份证正反面照片获取。</li>,
                    <li>云端识别身份证正反面照片信息。</li>,
                    <li>SDK获取识别结果并返回给APP。</li>
                ],
            },
            partThree:{
                mustCert:true,
                serviceId:SERVICE_ID.OCR_IDCARD,
                sdkDocUrl:'/docs/idcard-android-sdkIntro.html'
            },
            partFour:{
                money:'0.20',
                moenyDoc:'/docs/idcard-price.html'
            }
        },
        {
            name:'H5/小程序',
            partTwo:{
                img:require('./lite.png'),
                liArray:[
                    <li>用户按照H5/小程序页面的提示，拍摄身份证。</li>,
                    <li>云端进行身份证OCR识别，返回用户识别结果。</li>,
                    <li>通过API接口获取详细信息。</li>
                ],
            },
            partThree:{
                mustCert:true,
                sdkDocUrl:'/docs/ocr-h5.html'
            },
            partFour:{
                money:'0.20',
                moenyDoc:'/docs/idcard-price.html'
            }
        }
    ];

    render() {
        return (
            <TabOverview top={this.top} infos={this.infos}/>
        );
    }

}

export default Product;



// WEBPACK FOOTER //
// ./src/pages/ProductIdCard/Overview.js