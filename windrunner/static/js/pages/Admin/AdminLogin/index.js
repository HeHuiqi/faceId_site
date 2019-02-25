import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import IndexForm from 'components/IndexForm';
import { adminLogin } from 'actions/account';
import {toUrl} from 'utils/tool.js';
import { getRealUrl} from 'utils/request.js';
const FormItem = Form.Item;
const captchaURL = getRealUrl('/captcha?type=login_captcha&value=');

class AdminLogin extends React.Component {

    state = {
        showCaptcha:false,
        captcha: '',
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                adminLogin(values['username'], values['password'], values['captcha']).then(e => {
                    toUrl('/admin/pages/api_key');
                }).catch(err => {
                    err = err.data;
                    if (err.code === 1009) {
                        if (!this.state.showCaptcha) {
                            this.setState({ showCaptcha: true, captcha: captchaURL + values['username'] });
                        } else {
                            this.refresh();
                            Modal.error({
                                title: '错误',
                                content: err.msg
                            });
                        }
                    } else {
                        Modal.error({
                            title: '错误',
                            content: err.msg
                        });
                    }
                }).then(() => {
                    this.setState({ loading: false });
                });
            }


        });
    }

    refresh = () => {
        const username = this.props.form.getFieldValue('username');
        this.setState({ captcha: captchaURL + username + '&time=' + new Date().getTime() });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let captcha;
        if (this.state.showCaptcha) {
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
            <div>
                <IndexForm title="FaceID 管理员控制台" onSubmit={this.handleSubmit}>
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入用户名' }],
                            validateTrigger: 'onBlur'
                        })(
                            <Input placeholder="用户名" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }],
                            validateTrigger: 'onBlur'
                        })(
                            <Input type="password" placeholder="密码" />
                        )}
                    </FormItem>
                    {captcha}
                    <FormItem>
                        <Button loading={this.state.loading} type="primary" htmlType="submit">
                            登录
                        </Button>
                    </FormItem>
                </IndexForm>
            </div>
        );
    }

}

const WrappedLogin = Form.create()(AdminLogin);
export default WrappedLogin;



// WEBPACK FOOTER //
// ./src/pages/Admin/AdminLogin/Overview.js