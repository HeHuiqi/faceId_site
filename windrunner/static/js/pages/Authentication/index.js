import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import BaseContent from 'components/BaseContent';
import { editAuth, getAuth } from 'actions/clientAuth';
import ProtocolsModal from 'components/AuthenticationForm/ProtocolsModal';
import AuthenticationForm from 'components/AuthenticationForm';
import {setBreadcrumb} from  'actions/pageData';
import { Spin, Button, Modal,Form,Checkbox } from 'antd';
import { STATUS } from 'utils/const';
import formError from 'utils/formError';
import style from './index.less';
import moment from 'moment';
import {setUserInfo} from 'actions/account';
import { getRealUrl} from 'utils/request.js';

const FormItem = Form.Item;
const ENABLE_STATE = [STATUS.TOCERTIFIED,STATUS.PASS]; //禁止操作表单的状态值
class Authentication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            authed: false,
            uploading:false,
            authInfo:null,
            hasPermission:false,
            canSub:false
        };
    }
    componentDidMount(){
        getAuth().then(res => {
            this.setState({ authInfo: res.data,hasPermission:res.data.status === STATUS.UNCERTIFIED?false:true});
        });
    }

    onReasonClick = ()=>{
        Modal.warning({
            title: '驳回原因',
            content: this.state.authInfo.reject_reason,
        });
    }

    renderStatusBar() {
        if(!this.state.authInfo) {
            return null;
        }
        let status_text = '',reason;
        const { status } = this.state.authInfo;
        if(status === STATUS.UNCERTIFIED){
            return;
        }
        switch (status) {
            // case STATUS.UNCERTIFIED:
            //     status_text = '未认证';
            //     break;
            case STATUS.TOCERTIFIED:
                status_text = <p><span style={{color:'#FFB100'}}>待审核</span>（以下内容不可修改）</p>;
                break;
            case STATUS.PASS:
                status_text = <p><span style={{color:'#00B11F'}}>认证成功</span>（以下内容不可修改）</p>;
                break;
            case STATUS.DISMISSAL:
                status_text = <p><span style={{color:'#FB3F3F'}}>认证未通过</span></p>;
                // usrButton = <Button style={{float:'right'}} type="primary" onClick={this.onReasonClick}>查看驳回原因</Button>;
                reason = <p style={{marginTop:'15px',marginBottom:0,fontSize:'14px',fontWeight:'normal'}}>{this.state.authInfo.reject_reason}</p>;
                break;
            default:
                break;
        }
        return (
            <div className={style.statusBar}>
                <div className={style.titleBox}>
                    <div className={style.title}>状态：</div>
                    <div className={style.status}>
                        {status_text}
                        {reason}
                    </div>
                </div>
            </div>
        );
    }
    authSubmit = (params)=>{
        this.setState({ uploading:true});
        const isEdit = this.state.authInfo.status === STATUS.DISMISSAL;
        editAuth(params, isEdit).then(res=>{
            Modal.success({
                title: '资料提交成功！',
                content:'您的认证申请会在1-3个工作日后审核完成。',
                onOk:()=>{
                    window.location.reload();
                }
            });
            this.setState({ uploading: false });

        }).catch(err=>{
            err = err.data;
            formError(err, this.authForm.getForm());
            this.setState({ uploading: false });
        });
    }
    handleCheck=(e)=>{
        this.setState({hasPermission: e.target.checked});
    }

    checkEditable() {
        const { status} = this.state.authInfo;
        if (ENABLE_STATE.includes(status)){
            return false;
        }
        return true;
    }

    checkSubmit(){
        const { status} = this.state.authInfo;
        if (ENABLE_STATE.includes(status)){
            return false;
        }else if(this.state.hasPermission && this.state.canSub){
            return true;
        }
    }

    onFininsh = (status)=>{
        if(status !== this.state.canSub){
            this.setState({canSub:status});
        }
    }

    render() {
        const {authInfo} = this.state;
        if (!this.state.authInfo){
            return <Spin key={1} tip="加载中..." ><BaseContent /></Spin>;
        }
        let permission;
        const commit = <FormItem style={{ marginTop: 20 }}>
            <Button
                type="primary"
                size="large"
                htmlType="submit"
                disabled={!this.checkSubmit()}
            >
                提交审核</Button>
        </FormItem>;
        if(authInfo.status === STATUS.UNCERTIFIED){
            permission =<div style={{ marginBottom: 20}}>
                <Checkbox key="checkbox"
                          onClick={this.handleCheck}>
                </Checkbox>
                <a target="_black" href={getRealUrl('/user/conf/url/ap')} style={{marginLeft: 10}}>我同意《FaceID 自助服务平台用户协议》</a>
            </div>;
        }else{
            permission = <div>您已于{moment.unix(authInfo.start_auth_time).local().format('YYYY/MM/DD HH:mm:ss')}同意<a target="_black" href={getRealUrl('/user/conf/url/ap')} style={{marginLeft: 10}}>《FaceID 自助服务平台用户协议》</a></div>;
        }

        let tips;
        if(this.state.authInfo.status===STATUS.UNCERTIFIED){
            tips = <ProtocolsModal account={this.props.account}/>;
        }

        return (
            <Spin
                spinning={this.state.uploading}
                tip="提交中...">
                {this.renderStatusBar()}
                {tips}
                <AuthenticationForm
                    onFininsh={this.onFininsh}
                    ref={ref =>  this.authForm = ref }
                    authInfo={this.state.authInfo}
                    submit={this.authSubmit}
                    eiditable={this.checkEditable()}
                >
                    {permission}
                    {commit}
                </AuthenticationForm>
            </Spin>
        );
    }
}

function select(state) {
    return {
        account: state.account.info
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setBreadcrumb: bindActionCreators(setBreadcrumb, dispatch),
        setUserInfo: bindActionCreators(setUserInfo, dispatch),
    };
}
export default connect(select, mapDispatchToProps)(Authentication);



// WEBPACK FOOTER //
// ./src/pages/Authentication/Overview.js