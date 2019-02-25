import React from 'react';
import {Button} from 'antd';
import style from './index.less';
import {SERVICE_ID} from 'utils/const';
import DownLoadSdk from 'components/DownLoadSdk';

class SDKDownload extends React.Component {
    render() {


        return (
            <div className={style.sdk}>
                <div className={style.column}>
                    <div className={style.card}>
                        <img src={require('./face_verify.png')} alt=""/>
                        <div className={style.info}>
                            <h1>人脸核身SDK</h1>
                            <p>FaceID 人脸核身服务提供了“我是我”的真人核验能力，通过姓名、身份证号、人脸识别、动作判断等多种手段来有效的核实使用者的身份，有效防止身份冒用、欺诈等风险。</p>
                        </div>
                        <DownLoadSdk productId={SERVICE_ID.FACE_VERIFY}>
                            <Button type='primary'>SDK下载</Button>
                        </DownLoadSdk>
                    </div>
                    <div className={style.card}>
                        <img src={require('./face_compare.png')} alt=""/>
                        <div className={style.info}>
                            <h1>人脸比对SDK</h1>
                            <p>FaceID 人脸比对服务提供“自拍照和留存照”之间1:1比对和活体检测功能。FaceID人脸比对功能可以应用于会议签到，身份识别，员工管理等多种场景。</p>
                        </div>
                        <DownLoadSdk productId={SERVICE_ID.FACE_COMPARE}>
                            <Button type='primary'>SDK下载</Button>
                        </DownLoadSdk>
                    </div>
                </div>
                <div className={style.column}>
                    <div className={style.card}>
                        <img src={require('./ocr_card.png')} alt=""/>
                        <div className={style.info}>
                            <h1>身份证识别SDK</h1>
                            <p>FaceID 身份证识别服务提供了身份证核验及识别能力，用户在客户端上按照提示操作，获取有效身份证照片进行核验及识别，并将结果及对应照片信息返回。</p>
                        </div>
                        <DownLoadSdk productId={SERVICE_ID.OCR_IDCARD}>
                            <Button type='primary'>SDK下载</Button>
                        </DownLoadSdk>
                    </div>
                    <div className={style.card}>
                        <img src={require('./face_verify.png')} alt=""/>
                        <div className={style.info}>
                            <h1>人脸核身微信小程序包</h1>
                            <p>FaceID 人脸核身服务提供了“我是我”的真人核验能力，通过姓名、身份证号、人脸识别、动作判断等多种手段来有效的核实使用者的身份，有效防止身份冒用、欺诈等风险。</p>
                        </div>
                        <DownLoadSdk productId={SERVICE_ID.LITE_VERIFY}>
                            <Button type='primary'>小程序包下载</Button>
                        </DownLoadSdk>
                    </div>
                </div>
                <div className={style.column}>
                    <div className={style.card}>
                        <img src={require('./ocr_card.png')} alt=""/>
                        <div className={style.info}>
                            <h1>身份证识别小程序包</h1>
                            <p>FaceID 身份证识别服务提供了身份证核验及识别能力，用户在客户端上按照提示操作，获取有效身份证照片进行核验及识别，并将结果及对应照片信息返回。</p>
                        </div>
                        <DownLoadSdk productId={SERVICE_ID.LITE_OCR}>
                            <Button type='primary'>小程序包下载</Button>
                        </DownLoadSdk>
                    </div>
                    <div className={style.emptyCard}>

                    </div>
                </div>
            </div>
        );
    }

}

export default SDKDownload;



// WEBPACK FOOTER //
// ./src/pages/SDKDownload/index.js