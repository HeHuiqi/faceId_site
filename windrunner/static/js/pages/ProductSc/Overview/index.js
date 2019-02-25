import React from 'react';
import TabOverview from 'components/OverviewComponents/TabOverview';
import {SERVICE_ID} from 'utils/const';
import config from 'config';
import jrQrcode from 'jr-qrcode';

export class Product extends React.Component {


    top = {
        partOne:{
            title:'FaceID 人脸核身',
            content:'FaceID 人脸核身服务提供了“我是我”的真人核验能力，通过姓名、身份证号、人脸识别、动作判断等多种手段来有效的核实使用者的身份，有效防止身份冒用、欺诈等风险。',
            docUrl:'/docs/idverify-android-sdkIntro.html',
            img:require('./face_overview01.png'),
            videoDemo:require('./faceDemo.mp4'),
            tabs:[
                {name:'APP下载',value:'app',serviceId:SERVICE_ID.FACE_VERIFY},
                {name:'H5体验',value:'h5',serviceId:SERVICE_ID.LITE_VERIFY,qrImg:jrQrcode.getQrBase64(config.liteH5Demo)},
                {name:'小程序体验',value:'lite',serviceId:SERVICE_ID.LITE_VERIFY,qrImg:config.liteMiniDemo}
            ],
            service: 200,
            bundle: 10000
        }
    }

    infos = [
        {
            name:'SDK',
            partTwo:{
                img:require('./yewu.png'),
                liArray:[
                    <li>用户按照SDK UI页面的提示，进行点头，摇头，眨眼等<strong>动作活体验证</strong>。</li>,
                    <li>动作通过后，SDK内部会调用FaceID服务器进行<strong>云端攻击检测</strong>，并开始<strong>人脸身份验证</strong>。</li>,
                    <li>人脸身份验证的结果会通过SDK提供的<strong>回调接口</strong>返回给开发者，同时返回到开发者指定的<strong>服务器接口</strong>。</li>
                ],
            },
            partThree:{
                mustCert:true,
                serviceId:SERVICE_ID.FACE_VERIFY,
                sdkDocUrl:'/docs/idverify-android-sdkIntro.html'
            },
            partFour:{
                money:'1.00',
                moenyDoc:'/docs/idverify-price.html'
            }
        },
        {
            name:'H5/小程序',
            partTwo:{
                img:require('./lite.png'),
                liArray:[
                    <li>用户按照H5/小程序页面的提示，进行<strong>视频活体验证</strong>。</li>,
                    <li>操作通过后，FaceID H5/微信小程序会调用FaceID服务端进行<strong>云端攻击检测</strong>，并开始<strong>人脸身份验证</strong>。</li>,
                    <li>人脸身份验证的结果信息将通过<strong>URL形式</strong>返回客户H5网页/客户小程序，同时返回给<strong>客户服务器</strong>。</li>
                ],
            },
            partThree:{
                mustCert:true,
                sdkDocUrl:'/docs/h5.html'
            },
            partFour:{
                money:'1.00',
                moenyDoc:'/docs/idverify-price.html'
            }
        }

    ]

    render() {
        return (
            <TabOverview top={this.top} infos={this.infos}/>
        );
    }

}

export default Product;



// WEBPACK FOOTER //
// ./src/pages/ProductSc/Overview/index.js