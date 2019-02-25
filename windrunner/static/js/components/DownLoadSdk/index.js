import React from 'react';
import { Modal } from 'antd';
import style from './index.less';
import { STATUS } from 'utils/const';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProductUrl } from 'actions/product';
import {SERVICE_ID} from 'utils/const';
import {$horus} from 'utils/tool';
// const CheckStatus = [SERVICE_ID.FACE_VERIFY,SERVICE_ID.FACE_COMPARE,SERVICE_ID.OCR_IDCARD];

class DownLoadSdk extends React.Component{
    state = {
        visible:false
    }

    onClick = (type)=>{
        if(type && this.props.account.status !== STATUS.PASS){
            Modal.confirm({
                title:'企业认证用户才能下载此SDK',
                content: '此SDK涉及实名认证，需进行企业认证后才能使用',
                okText: '马上认证',
                cancelText:'暂不认证',
                onOk:()=>{
                    this.props.history.push('/pages/auth');
                }
            });
            return;
        }

        if(!this.state.androidD && type){
            getProductUrl(this.props.productId).then(e=>{
                if(this.props.productId === SERVICE_ID.LITE_VERIFY || this.props.productId === SERVICE_ID.LITE_OCR){
                    window.open(e.data.download_android_url);
                }else{
                    this.setState({androidD:e.data.download_android_url,iosD:e.data.download_ios_url,visible:true});
                }

            });
            return;
        }
        if(this.props.productId !== SERVICE_ID.LITE_VERIFY){
            this.setState({visible:type});
        }else{
            window.open(this.state.androidD);
        }
    }

    download(platform){
        $horus.occur('download_sdk',{serviceid:this.props.productId,platform});
    }

    render(){
        const list = React.Children.map(this.props.children,item=>{
            return React.cloneElement(item, { onClick: this.onClick });
        });
        list.push(<Modal
            title=""
            visible={this.state.visible}
            footer={null}
            onCancel={this.onClick.bind(this,false)}
        >
            <p className={style.download_title}>请选择 Android 或 iOS SDK 下载使用</p>
            <div className={style.download_button}>
                <a target="_blank" onClick={this.download.bind(this,'android')} className={style.download_button_a} href={this.state.androidD}>Android SDK下载</a>
                <a target="_blank" onClick={this.download.bind(this,'ios')} className={style.download_button_ios} href={this.state.iosD}>iOS SDK下载</a>
            </div>
        </Modal>);
        return list;
    }

};

function select(state) {
    return {
        account: state.account.info
    };
}
export default connect(select)(withRouter(DownLoadSdk));



// WEBPACK FOOTER //
// ./src/components/DownLoadSdk/Overview.js