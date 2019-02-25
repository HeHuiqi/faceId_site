import React from 'react';
import { Form, Input, Button, Alert } from 'antd';
import IndexForm from 'components/IndexForm';
import style from './index.less';
import { checkUserName} from 'actions/account';
import { Link } from 'react-router-dom';
import {toUrl} from 'utils/tool.js';
import { getRealUrl} from 'utils/request.js';
import { withRouter } from 'react-router-dom';
const FormItem = Form.Item;
const captchaURL = getRealUrl('/captcha?type=login_captcha&value=');

class Login extends React.Component {

    state = {
        showCaptcha:false,
        captcha:'',
        loading:false,
        isOpenUser:false
    }

    getCaptcha(username,type){
        if(type === 101017007){
            return `/api/user/${username}/captcha?ts=${(new Date()).getTime()}`;
        }else if(type === 1009){
            return captchaURL + username;
        }

    }

    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                this.props.doLogin(values['username'], values['password'], values['captcha']).then(res => {
                    if(res.accountType === 'old'){
                        if(res.data.sms_token){
                            this.props.history.push('/verify/'+res.data.sms_token);
                        }else{
                            window.location.href = '/pages';
                        }
                    }else{
                        toUrl('/pages');
                    }

                }).catch(err=>{
                    err = err.data;
                    if (err.code === 1009 || err.code === 101017007){
                        if (!this.state.showCaptcha){
                            this.setState({
                                showCaptcha: true,
                                captcha: this.getCaptcha(values['username'],err.code),
                                errMsg: null
                            });
                        }else{
                            this.refresh();
                            this.setState({ errMsg: err.msg});
                        }
                    }else if(err.code === 1302){
                        window.user = values;
                        this.props.history.push('/facepp/bind-phone');
                    }else{
                        this.setState({ errMsg: err.msg,showCaptcha: false });
                    }
                    this.setState({loading:false});
                }).then(()=>{
                    this.setState({loading:false});
                });

            }


        });
    }
    refresh=()=>{

        this.props.form.validateFields(['username'],(err, values) => {
            if (!err) {
                const username = values['username'];
                if(this.props.type === 'facepp'){
                    this.setState({
                        captcha:captchaURL + username + '&time='+ new Date().getTime()
                    });
                    return;
                }

                checkUserName(values['username']).then(e=>{
                    let _promise;
                    if(e.data.exist === 2){
                        this.setState({
                            captcha:`/api/user/${username}/captcha?ts=${(new Date()).getTime()}`,
                        });
                    }else if(e.data.exist === 1){
                        this.setState({
                            captcha:captchaURL + username + '&time='+ new Date().getTime()
                        });
                    }else{
                        this.setState({ loading: false, errMsg: '用户不存在'});
                        _promise = Promise.reject();
                    }
                    return _promise;
                }).catch(err=>{

                    this.setState({ loading: false});
                });
            }
        });
    }
    closeAlert = ()=> {
        this.setState({errMsg: null});
    }
    render() {
        const {config, title} = this.props;
        const { getFieldDecorator } = this.props.form;
        let captcha;
        if (this.state.showCaptcha){
            captcha = <FormItem>
                {getFieldDecorator('captcha', {
                    rules: [{ required: true, message: '请输入验证码' }],
                })(
                    <Input style={{ width: '68%' }} placeholder="验证码" />
                )}
                <a onClick={this.refresh} style={{ width: '30%', height: '40px', float: 'right' }}><img style={{ width: '100%', height: '100%' }} alt="验证码" src={this.state.captcha} /></a>
            </FormItem>;
        }

        return (
            <IndexForm title={title} onSubmit={this.handleSubmit} >
                <FormItem>
                    <input type="text" autocomplete="off" style={{position:'absolute', top: -3000}}/>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: config.field_username_placeholder }],
                        validateTrigger: 'onBlur'
                    })(
                        <Input placeholder={config.field_username_required_msg} />
                    )}
                </FormItem>
                <FormItem>
                    <input type="password" autocomplete="off" style={{position:'absolute', top: -3000}}/>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: config.field_password_required_msg }],
                        validateTrigger: 'onBlur'
                    })(
                        <Input type="password" placeholder={config.field_password_placeholder} />
                    )}
                </FormItem>
                {captcha}
                {this.state.errMsg ? <Alert message={this.state.errMsg} type="error" closable style={{margin: '10px 0'}} onClose={this.closeAlert}/>: null}
                <FormItem>
                    <Button loading={this.state.loading} type="primary" htmlType="submit">{config.submit_button_text}</Button>
                </FormItem>
                {config.link_to ? [
                    <Link key="1" onClick={this.onRegClick} className={style['login-form-reg']} to="/register">注册新账号</Link>,
                    <Link key="2" className={style['login-form-forget']} to="/forget-password">忘记密码</Link>
                ]: null}
                {this.props.link}
            </IndexForm>

        );
    }

}

const WrappedLogin = Form.create()(withRouter(Login));
export default WrappedLogin;



// WEBPACK FOOTER //
// ./src/pages/Login/Loginform.js