import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { forgetPassword,resetPassword } from 'actions/accountMiddle';
import PropTypes from 'prop-types';
import IndexForm from 'components/IndexForm';
import { Link } from 'react-router-dom';
import formError from 'utils/formError';
import CutDownButton from 'components/CutDownButton';
import { passwordRule } from 'utils/const';
import { getRealUrl} from 'utils/request.js';

const FormItem = Form.Item;
const captchaURL = getRealUrl('/captcha?type=reset_password_captcha&value=');

class ForgetPassword extends React.Component {

    state = {

    }

    getCaptcha(username){
        return captchaURL + username;
    }

    sendCode = (callback) => {
        this.setState({errMsg:''});
        forgetPassword(this.state.username,this.state.email).then(req => {
            Modal.success({
                title: '验证码已发送到您的手机。'
            });
            callback();
        }).catch(err=>{
            err = err.data;
            if(err.code === 999){
                formError(err, this.props.form);
            }else{
                this.setState({errMsg:err.msg});
            }
        });
    }

    handleSubmit = (e) => {
        this.setState({errMsg:''});
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(!this.state.next){
                    forgetPassword(values['username'],values['email']).then(res => {

                        if(res.accountType === 'old'){
                            Modal.success({
                                title: '密码重置方法已经发送到您的邮箱。如果未收到，请检查您的垃圾邮件。'
                            });
                            return;
                        }
                        Modal.success({
                            title: '验证码已发送到您的手机。'
                        });
                        const _state = {
                            next:true,
                            username:values['username'],
                            email:values['email']
                        };
                        _state.captcha = this.getCaptcha(values['username']);
                        this.setState(_state);

                    }).catch(err=>{
                        err = err.data;
                        if(err.code === 999){
                            formError(err, this.props.form);
                        }else{
                            let msg = err.msg;
                            if(err.exist === 3){
                                msg = '请在faceplusplus.com.cn上更改密码';
                            }
                            this.setState({errMsg:msg});
                        }
                    });
                }else{
                    values.username = this.state.username;
                    values.email = this.state.email;
                    resetPassword(values).then(e=>{
                        Modal.success({
                            title: '重置密码成功，请用新密码重新登录',
                            onOk: () => {
                                this.context.router.history.push('/login');
                            }
                        });
                    }).catch(err=>{
                        err = err.data;
                        if(err.code === 999){
                            formError(err, this.props.form);
                        }else{
                            this.setState({errMsg:err.msg});
                        }
                    });
                }
            }
        });
    }

    refresh=()=>{
        const username = this.state.username;
        this.setState({captcha:captchaURL + username + '&time='+ new Date().getTime()});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let content;

        if(this.state.next){
            content = [<FormItem key='3'>
                {/* 兼容去掉chrome密码自动填充 */}
                <input type="reset_password_token" name="reset_password_token" style={{display:'none'}} />
                {getFieldDecorator('reset_password_token', {
                    rules: [{ required: true, message: '请输入手机验证码' }],
                    validateTrigger: 'onBlur'
                })(
                    <Input key='token' style={{ width: '55%' }} placeholder="请输入手机验证码" />
                )}
                <CutDownButton start={true} onClick={this.sendCode} text="获取手机验证码" />
            </FormItem>,
                <FormItem key='4'>
                    {/* 兼容去掉chrome密码自动填充 */}
                    <input type="password" name="password" style={{display:'none'}} />
                    {getFieldDecorator('password', {
                        rules: passwordRule,
                        validateTrigger: 'onBlur'
                    })(
                        <Input type="password" placeholder="请输入密码" />
                    )}
                </FormItem>,
                <FormItem key='5'>
                    {getFieldDecorator('captcha', {
                        rules: [{ required: true, message: '请输入验证码' }],
                        validateTrigger: 'onBlur'
                    })(
                        <Input style={{ width: '55%' }} placeholder="验证码" />
                    )}
                    <a onClick={this.refresh} style={{ width: '40%', height: '40px', float: 'right' }}><img style={{ width: '100%', height: '100%' }} alt="验证码" src={this.state.captcha} /></a>
                </FormItem>
            ];
        }else{
            content = [<FormItem key='1'>
                {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入用户名' }],
                })(
                    <Input disabled={this.state.next} placeholder="请输入用户名" />
                )}
            </FormItem>];
        }

        return (
            <IndexForm title="找回密码" onSubmit={this.handleSubmit}>
                <div style={{ position: 'absolute', top: -25, color:'#f5222d'}}>{this.state.errMsg}</div>
                {content}
                <FormItem>
                    <Button type="primary" htmlType="submit">
                        {this.state.next?'重置密码':'下一步'}
                    </Button>
                    <Link to="/login">返回登录</Link>
                </FormItem>
            </IndexForm>
        );
    }

}
ForgetPassword.contextTypes = {
    router: PropTypes.object
};

const WrappedForgetPassword = Form.create()(ForgetPassword);
export default WrappedForgetPassword;



// WEBPACK FOOTER //
// ./src/pages/ForgetPassword/Overview.js