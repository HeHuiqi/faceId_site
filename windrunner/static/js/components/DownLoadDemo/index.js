import React from 'react';
import { Modal,Spin } from 'antd';
import style from './index.less';
import { STATUS } from 'utils/const';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getDemoUrl } from 'actions/product';
import { getAbsoluteRealUrl} from 'utils/request.js';
import jrQrcode from 'jr-qrcode';

class DownloadDemo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible:false,
            selectTab:props.tabs[0],
            code:'',
            call_count: 0,
            expire_time: 0
        };
    }

    onClick = (type)=>{
        if(type && this.props.account.status !== STATUS.PASS){
            Modal.confirm({
                title:'企业认证用户才能下载体验Demo',
                content: '此Demo涉及实名认证，需进行企业认证后才能使用',
                okText: '马上认证',
                cancelText:'暂不认证',
                onOk:()=>{
                    this.props.history.push('/pages/auth');
                }
            });
            return;
        }
        if(!this.state.code && type){
            this.setState({loading:true,visible:true});
            this.getCode(this.state.selectTab);
            return;
        }
        this.setState({visible:type});
    }
    onTabClick = (tab)=>{
        if(tab === this.state.selectTab){
            return;
        }
        this.setState({selectTab:tab,loading:true});
        this.getCode(tab);
    }

    getCode(tab){
        getDemoUrl(tab.serviceId).then(e=>{
            let download_img;
            if(tab.qrImg){
                download_img = tab.qrImg;
            }else{
                download_img = jrQrcode.getQrBase64(getAbsoluteRealUrl(e.data.download_url));
            }
            this.setState({
                code:e.data.code+'',
                call_count: e.data.call_count,
                expire_time: e.data.expire_time,
                download_img,
                loading:false
            });
        });
    }
    openKF = ()=> {
        window.KF5SupportBoxAPI.ready(function(){
            // 打开组件弹出层
            window.KF5SupportBoxAPI.open(function(){
                // 动画完成后执行的回调函数
                // .........
            });
        });
    }

    render(){
        const list = React.Children.map(this.props.children,item=>{
            return React.cloneElement(item, { onClick: this.onClick});
        });
        list.push(<Modal
            title=""
            width={640}
            visible={this.state.visible}
            wrapClassName={style.modal}
            footer={null}
            onCancel={this.onClick.bind(this,false)}
        >
            <Spin spinning={this.state.loading}>
                <div className={style.modalTitleBox}>
                    <p className={style.download_title}>Demo下载及体验</p>
                </div>
                <div  className={style.modalBox}>
                    <div className={style.tabs}>
                        {this.props.tabs && this.props.tabs.map(res=>{
                            return <a onClick={this.onTabClick.bind(this,res)} className={this.state.selectTab === res?style.action:null}>{res.name}</a>;
                        })}
                    </div>
                    <div className={style.tabsMain}>
                        <div className={style.qrbox}>
                            <h1>请所描二维码下载Demo</h1>
                            <img className={style.qrcode} src={this.state.download_img} alt=""/>
                        </div>
                        <div className={style.codebox}>
                            <h1>请牢记以下邀请码，<span>在体验Demo时输入</span></h1>
                            <div className={style.code}>
                                {this.state.code.split('').map(item=>{
                                    return <span>{item}</span>;
                                })}
                            </div>
                            <p className={style.tips}>在初次进入Demo时请输入6位数字邀请码，<br/>邀请码可使用{this.state.call_count}次，有效时间{this.state.expire_time}天。<br/>如有问题请<a onClick={this.openKF}>联系我们</a></p>
                        </div>
                    </div>
                </div>

            </Spin>
        </Modal>);
        return list;
    }

};

function select(state) {
    return {
        account: state.account.info
    };
}
export default connect(select)(withRouter(DownloadDemo));



// WEBPACK FOOTER //
// ./src/components/DownLoadDemo/Overview.js