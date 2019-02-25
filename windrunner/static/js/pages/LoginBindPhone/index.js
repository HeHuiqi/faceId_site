import React from 'react';
import { Form, Input, Button } from 'antd';
import IndexForm from 'components/IndexForm';
import CutDownButton from 'components/CutDownButton';
import { withRouter } from 'react-router-dom';
import {phoneLogin,getPhoneToken} from 'actions/account';
import formError from 'utils/formError';
import {toUrl} from 'utils/tool.js';
const FormItem = Form.Item;

class LoginBindPhone extends React.Component {

    state = {
        showCaptcha:false,
        captcha:'',
        loading:false,
        isOpenUser:false
    }
    constructor(props){
        super(props);
        //判断全局是否有用户名密码
        this.user = window.user;
        if(!this.user || (!this.user.username || !this.user.password) ){
            props.history.push('/facepp/login');
        }
    }

    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //绑定手机号
                const params = {...this.user,...values};
                phoneLogin(params).then(()=>{
                    toUrl('/pages');
                }).catch(err=>{
                    formError(err.data, this.props.form);
                });

            }
        });
    }

    sendPhoneCode = (callback) => {
        this.props.form.validateFields(['phone'], (e, values) => {
            if (!e) {
                getPhoneToken(values['phone'],'entry_phone_token').then(() => {
                    callback();
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <IndexForm title='绑定手机' onSubmit={this.handleSubmit} >
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

                    {getFieldDecorator('token', {
                        rules: [{ required: true, message: '请输入验证码' }],
                        validateTrigger: 'onBlur'
                    })(
                        <Input style={{ width: '55%' }} placeholder="请输入手机验证码" />
                    )}
                    <CutDownButton onClick={this.sendPhoneCode} text="获取手机验证码" />

                </FormItem>
                <FormItem>
                    <Button loading={this.state.loading} type="primary" htmlType="submit">绑定手机</Button>
                </FormItem>
            </IndexForm>

        );
    }

}

const WrappedLogin = Form.create()(withRouter(LoginBindPhone));
export default WrappedLogin;



// WEBPACK FOOTER //
// ./src/pages/LoginBindPhone/Overview.js