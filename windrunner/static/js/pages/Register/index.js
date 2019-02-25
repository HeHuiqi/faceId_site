import React from 'react';
import { Form, Input, Button,Checkbox } from 'antd';
import IndexForm from 'components/IndexForm';
import { register,getPhoneToken } from 'actions/account';
import { passwordRule, usernameRule } from 'utils/const';
import RegisterSucc from 'components/RegisterSucc';
import CutDownButton from 'components/CutDownButton';
import formError from 'utils/formError';
import { getRealUrl} from 'utils/request.js';
import { Link } from 'react-router-dom';
import {$horus} from 'utils/tool';
import { withRouter } from 'react-router-dom';

const FormItem = Form.Item;

class Register extends React.Component {

    state = {
        jumpSecond: 3,
        agreeAgreement:false
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                register(values).then(e => {
                    $horus.occur('register_success');
                    this.setState({ isRegistSucc: true });
                    this.countDownJump();
                }).catch(err=>{
                    err = err.data;
                    if(typeof err.msg === 'object'){
                        Object.keys(err.msg).forEach(item=>{
                            $horus.occur('fail_register_' + item);
                        });
                    }
                    formError(err,this.props.form);
                });
            }
        });
    }

    countDownJump = () => {
        if (this.state.jumpSecond === 0) {
            this.props.history.push('/login');
            return;
        }
        setTimeout(() => {
            this.setState({ jumpSecond: this.state.jumpSecond - 1 });
            this.countDownJump();
        }, 1000);
    }

    sendPhoneCode = (callback) => {
        this.props.form.validateFields(['phone'], (e, values) => {
            if (!e) {
                getPhoneToken(values['phone']).then(res => {

                    callback();
                });
            }
        });
    }

    onAgreement = (e)=>{
        this.setState({agreeAgreement:e.target.checked});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let content;
        if (!this.state.isRegistSucc) {
            content = (
                <div>
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: usernameRule,
                            validateTrigger: 'onBlur'
                        })(
                            <Input placeholder="请输入登录用户名" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('phone', {
                            rules: [
                                { required: true, message: '请输入手机号' },
                                { pattern: /^1\d{10}$/, message: '手机号格式错误' }
                            ],
                            validateTrigger: 'onBlur'
                        })(
                            <Input placeholder="请输入手机号" />
                        )}
                    </FormItem>
                    <FormItem>

                        {getFieldDecorator('phone_token', {
                            rules: [{ required: true, message: '请输入验证码' }],
                            validateTrigger: 'onBlur'
                        })(
                            <Input style={{ width: '55%' }} placeholder="请输入手机验证码" />
                        )}
                        <CutDownButton onClick={this.sendPhoneCode} text="获取手机验证码" />

                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: passwordRule,
                            validateTrigger: 'onBlur'
                        })(
                            <Input type="password" placeholder="请输入密码" />

                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password_two', {
                            rules: [
                                { required: true, message: '请输入密码' },
                                {
                                    validator: (rule, value, callback) => {
                                        const pass = this.props.form.getFieldValue('password');
                                        if (pass !== value) {
                                            callback('两次密码不一致');
                                        } else {
                                            callback();
                                        }
                                    }
                                }
                            ],
                            validateTrigger: 'onBlur'
                        })(
                            <Input type="password" placeholder="请再次输入密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Checkbox onChange = {this.onAgreement}>我已阅读并同意<a target="_black" href={getRealUrl('/user/conf/url/rp')} >《用户注册协议》</a>和<a target="_black" href={getRealUrl('/user/conf/url/pp')} >《隐私政策》</a></Checkbox>
                    </FormItem>
                    <FormItem>
                        <Button disabled={!this.state.agreeAgreement} type="primary" htmlType="submit">
                            完成注册
                        </Button>
                    </FormItem>
                    <Link to="/login">已有账号，去登录</Link>
                </div>
            );
        } else {
            content = <RegisterSucc time={this.state.jumpSecond} />;
        }
        return (
            <div>
                <IndexForm title="欢迎使用 FaceID 服务" onSubmit={this.handleSubmit}>
                    {content}
                </IndexForm>
            </div>
        );
    }

}

const WrappedRegister = Form.create()(Register);
export default withRouter(WrappedRegister);



// WEBPACK FOOTER //
// ./src/pages/Register/index.js