import React from 'react';
import TabOverview from 'components/OverviewComponents/TabOverview';
import {SERVICE_ID} from 'utils/const';
import config from 'config';
import jrQrcode from 'jr-qrcode';

export class Product extends React.Component {
    top = {
        partOne:{
            title:'FaceID 人脸比对',
            content:'FaceID 人脸比对服务提供“自拍照和留存照”之间1:1比对和活体检测功能。FaceID人脸比对功能可以应用于会议签到，身份识别，员工管理等多种场景。',
            docUrl:'/docs/idverify-android-sdkIntro.html',
            img:require('./face_overview01.png'),
            videoDemo:require('./faceDemo.mp4'),
            tabs:[
                {name:'APP下载',value:'app',serviceId:SERVICE_ID.FACE_COMPARE},
                {name:'H5体验',value:'h5',serviceId:SERVICE_ID.LITE_COMPARE,qrImg:jrQrcode.getQrBase64(config.liteUCH5Demo)},
                {name:'小程序体验',value:'lite',serviceId:SERVICE_ID.LITE_COMPARE,qrImg:config.liteUCMiniDemo}
            ],
            service: 201,
            bundle: 10000
        }
    }

    infos = [
        {
            name: 'SDK',
            partTwo:{
                img:require('./yewu.png'),
                liArray:[
                    <li>用户按照SDK UI页面的提示，进行点头，摇头，眨眼等<strong>动作活体验证</strong>。</li>,
                    <li>动作通过后，SDK内部会调用FaceID服务器进行<strong>云端攻击检测</strong>，并开始<strong>人脸比对</strong>。</li>,
                    <li>人脸比对的结果会通过SDK提供的<strong>回调接口</strong>返回给开发者，同时返回到开发者指定的<strong>服务器接口</strong>。</li>
                ],
            },
            partThree:{
                mustCert:true,
                serviceId:SERVICE_ID.FACE_COMPARE,
                sdkDocUrl:'/docs/idverify-android-sdkIntro.html'
            },
            partFour:{
                money:'0.50',
                moenyDoc:'/docs/idverify-price.html'
            }
        },
        {
            name: 'H5/小程序',
            partTwo:{
                img:require('./lite.png'),
                liArray:[
                    <li>用户按照H5/小程序页面的提示，进行<strong>视频活体验证</strong>。</li>,
                    <li>操作动作通过后，FaceID H5/微信小程序会调用FaceID服务器进行<strong>云端攻击检测</strong>，并开始<strong>人脸比对</strong>。</li>,
                    <li>人脸比对的结果会通过<strong>URL形式</strong>返回客户H5网页/客户小程序，同时返回给<strong>客户服务器</strong>。</li>
                ],
            },
            partThree:{
                mustCert:true,
                sdkDocUrl:'/docs/h5.html'
            },
            partFour:{
                money:'0.50',
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
// ./src/pages/ProductUc/Overview.js