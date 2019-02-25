import React from 'react';
import CardLayer from 'components/CardLayer';
import { Form, Input,Button,Modal,Col,Spin } from 'antd';
import { connect } from 'react-redux';
import {getPhoneToken,emailToken,oldToken,checkToken,updatePhone,updateEmail,bindPhone} from 'actions/account';
import CutDownButton from 'components/CutDownButton';
import Ficon from 'components/Ficon';
import style from './index.less';
import {setUserInfo} from 'actions/account';
import { bindActionCreators } from 'redux';

const FormItem = Form.Item;
const typeInfo = {
    'email':{
        text:'邮箱',
        validationText:'验证码',
        title:'更新邮箱',
        content:'验证码已发送到您的手机',
        button:'验证手机号',
        nextButton:'更换邮箱',
        rules:[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '邮箱格式错误' }
        ],
        placeholder:'请输入新的邮箱'

    },
    'phone':{
        text:'手机号',
        validationText:'手机验证码',
        title:'更新手机号',
        content:'我们向您的旧手机号发送了一封含有验证码的短信，请查收并填写',
        button:'验证手机号',
        nextButton:'更换手机号',
        rules:[
            { required: true, message: '请输入手机号' },
            { pattern: /^1\d{10}$/, message: '手机号格式错误' }
        ],
        placeholder:'请输入新的手机号'
    }
};
const formItemLayout = {
    labelCol: { style: {width: '80px',textAlign:'left',marginRight:'20px'},sm: { span: 4 } },
    wrapperCol: {  style: {display: 'inline-block',width:'600px'},sm: { span: 16 }},
};
const ModalFormLayout = {
    labelCol: { style: {marginRight:'0'},sm: { span: 5 } },
    wrapperCol: {  sm: { span: 19 }},
};
class Home extends React.Component {
    state = {
        changeLoading:false,
        loading:false,
        isShowChange:false,
        changeType:'',
        modStep:0,
        new:''
    }
    firstToken = '';

    onChangeEmail = ()=>{
        this.setState({loading:true});
        oldToken('phone').then(e=>{
            this.setState({isShowChange:true,changeType:'email',loading:false});
        }).catch(()=>{
            this.setState({loading:false});
        });
    }

    onChangePhone = ()=>{
        const {phone} = this.props.account;
        const _state = {isShowChange:true,changeType:'phone'};
        if(!phone || phone === ''){
            _state.modStep = 1;
            this.setState(_state);
        }else{
            this.setState({loading:true});
            oldToken('phone').then(e=>{
                _state.loading = false;
                this.setState(_state);
            }).catch(()=>{
                this.setState({loading:false});
            });
        }

    }

    onCancel = ()=>{
        this.setState({isShowChange:false,modStep:0});
    }

    onSubmit = ()=>{
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({changeLoading:true});
                if(this.state.modStep === 0){
                    //认证
                    //账号体系修改，邮箱手机第一步都验证手机
                    checkToken({type:'phone',token:values.token}).then(e=>{
                        this.setState({modStep:1,changeLoading:false});
                        this.firstToken = values.token;
                    }).catch(()=>{
                        this.setState({changeLoading:false});
                    });

                }else{
                    const params={first_token:this.firstToken,token:values.token};
                    params[this.state.changeType]=values[this.state.changeType];
                    let up;
                    if(this.state.changeType === 'phone'){
                        up = updatePhone;
                        const {phone} = this.props.account;
                        if(!phone || phone === ''){
                            up = bindPhone;
                            delete params.first_token;
                        }
                    }else{
                        up = updateEmail;
                    }

                    up(params).then(e=>{
                        const newAcc = {...this.props.account};
                        newAcc[this.state.changeType] = values[this.state.changeType];
                        this.props.setUserInfo(newAcc);
                        this.setState({changeLoading:false,modStep:2,new:values[this.state.changeType]});
                    }).catch(()=>{
                        this.setState({changeLoading:false});
                    });
                }
            }
        });

    }
    sendOldCode = (callback)=>{

        oldToken(this.state.changeType).then(e=>{
            callback();
        });
    }
    sendCode = (callback)=>{
        this.props.form.validateFields([this.state.changeType],(err, values) => {
            if(err){
                return;
            }
            let getToken,_type;
            const {phone} = this.props.account;
            _type = 'update_user_token';
            if(this.state.changeType === 'phone'){
                getToken = getPhoneToken;
                if(!phone || phone === ''){
                    _type = 'auth_token';
                }
            }else{
                getToken = emailToken;

            }
            getToken(values[this.state.changeType],_type).then(e=>{
                callback();
            });
        });
    }

    render() {
        const account = this.props.account;
        const { getFieldDecorator } = this.props.form;
        let modInfo = {},
            modForm;
        if(this.state.isShowChange){
            modInfo = typeInfo[this.state.changeType];

            if(this.state.modStep === 0){
                modForm = <Form>
                    <p>{modInfo.content}</p>
                    <FormItem
                        label={'当前手机号'}
                        {...ModalFormLayout}
                    >
                        {account.phone}
                    </FormItem>
                    <FormItem
                        key='old'
                        label={modInfo.validationText}
                        {...ModalFormLayout}
                    >
                        {getFieldDecorator('token', {
                            rules: [{ required: true, message: '请输入验证码' }],
                            validateTrigger: 'onBlur'
                        })(
                            <Col span={16}>
                                <Input placeholder="请输入验证码" />
                            </Col>
                        )}
                        <Col span={1}>
                            &nbsp;
                        </Col>
                        <Col span={7}>
                            <CutDownButton
                                start={true}
                                style={{ height: 32, width: '100%', float:'initial'}}
                                onClick={this.sendOldCode}
                                text="获取验证码" />
                        </Col>
                    </FormItem>
                </Form>;
            }else if(this.state.modStep === 1){
                modForm = <Form>

                    <FormItem
                        label={'新'+modInfo.text}
                        {...ModalFormLayout}
                    >
                        {getFieldDecorator(this.state.changeType, {
                            rules: modInfo.rules,
                            validateTrigger: 'onBlur'
                        })(
                            <Col span={16}>
                                <Input placeholder={modInfo.placeholder}/>
                            </Col>
                        )}
                        <Col span={8}>
                            &nbsp;
                        </Col>
                    </FormItem>
                    <FormItem
                        key='new'
                        label={modInfo.validationText}
                        {...ModalFormLayout}
                    >
                        {getFieldDecorator('token', {
                            rules: [{ required: true, message: '请输入验证码' }],
                            validateTrigger: 'onBlur'
                        })(
                            <Col span={16}>
                                <Input placeholder="请输入验证码" />
                            </Col>
                        )}
                        <Col span={1}>
                            &nbsp;
                        </Col>
                        <Col span={7}>
                            <CutDownButton style={{ height: 32, width: '100%', float:'initial'}} onClick={this.sendCode} text="获取验证码" />
                        </Col>
                    </FormItem>
                </Form>;
            }else{
                //成功
                modForm = <div>
                    <div style={{textAlign:'center',marginTop:'29px'}}>
                        <span style={{display:'inline-block'}}>
                            <Ficon style={{color:'#00B11F',fontSize:'42px',float:'left'}} type="check-circle" />
                            <span style={{lineHeight:'42px',fontSize:'24px',display:'block',height:'42px',marginLeft:'62px'}}>修改成功！</span>
                        </span>
                    </div>
                    <div style={{textAlign:'center',marginTop:'20px',marginBottom:'54px'}}>
                        <span style={{color:'rgba(0,0,0,0.55)',paddingRight:'20px'}}>{'当前'+modInfo.text+'：'}</span><span style={{fontWeight:'bold'}}>{this.state.new}</span>
                    </div>
                </div>;
            }
        }

        let button;
        if(this.state.modStep !== 2){
            button = <div style={{textAlign:'center',marginTop:'32px',marginBottom:'21px'}}>
                <Button key="return" type="primary" onClick={this.onSubmit} loading={this.state.changeLoading}>{this.state.modStep===0?modInfo.button:modInfo.nextButton}</Button>
            </div>;
        }


        return (
            <CardLayer cardStyle={{padding:'40px 60px'}}>
                <div>
                    <Spin
                        spinning={this.state.loading}
                    >
                        <Form>
                            <FormItem
                                label={<span className={style.title}><Ficon style={{marginRight:'8px'}} type='people'/>用户名</span>}
                                {...formItemLayout}
                            >
                                <Input style={{width:'280px'}} disabled={true} value={this.props.account.username} />
                            </FormItem>
                            <FormItem
                                label={<span className={style.title}><Ficon style={{marginRight:'8px'}} type='mail'/>邮箱</span>}
                                {...formItemLayout}
                            >
                                <Input style={{width:'280px',marginRight:'10px'}} disabled={true} value={this.props.account.email} />
                                <Button type="primary" onClick={this.onChangeEmail}>修改</Button>
                            </FormItem>
                            <FormItem
                                label={<span className={style.title}><Ficon style={{marginRight:'8px'}} type='phone'/>手机号</span>}
                                {...formItemLayout}
                            >
                                <Input style={{width:'280px',marginRight:'10px'}} disabled={true} value={this.props.account.phone} />
                                <Button type="primary" onClick={this.onChangePhone}>修改</Button>
                            </FormItem>
                        </Form>
                    </Spin>
                </div>
                <Modal
                    maskClosable={false}
                    destroyOnClose={true}
                    title={modInfo.title}
                    visible={this.state.isShowChange}
                    onCancel={this.onCancel}
                    footer={null}
                >
                    <Spin
                        spinning={this.state.changeLoading}
                        tip="提交中"
                    >
                        {modForm}
                        {button}
                    </Spin>
                </Modal>
            </CardLayer>
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
        setUserInfo: bindActionCreators(setUserInfo, dispatch)
    };
}
const HomeForm = Form.create()(Home);
export default connect(select,mapDispatchToProps)(HomeForm);



// WEBPACK FOOTER //
// ./src/pages/Home/Overview.js