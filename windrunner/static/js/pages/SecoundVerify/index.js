import React from 'react';
import { Form, Input, Button,Checkbox } from 'antd';
import IndexForm from 'components/IndexForm';
import { oldVerifyGetToken,oldVerifyLogin } from 'actions/oldAccount';
import CutDownButton from 'components/CutDownButton';
import style from './index.less';

const FormItem = Form.Item;

class SecoundVerify extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            loading:false,
        };
        this.token = props.match.params.token;
    }


    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                oldVerifyLogin({token:this.token,sms:values['token'],remember:values['remember']}).then(e=>{
                    window.location.href = '/pages';
                }).catch(err=>{
                    this.setState({ loading: false,errMsg:err.data.msg});
                });

            }
        });
    }

    sendCode = (callback)=>{
        this.setState({ loading: true });
        oldVerifyGetToken(this.token).then(e=>{
            callback();
        }).catch(err=>{
            this.setState({ loading: false,errMsg:err.data.errmsg});
        });
    }


    render() {
        const { getFieldDecorator,getFieldValue } = this.props.form;
        const token = getFieldValue('token');
        return (
            <div>
                <IndexForm title="短信验证" onSubmit={this.handleSubmit}>
                    <div style={{ position: 'absolute', top: -25, color:'#f5222d'}}>{this.state.errMsg}</div>
                    <FormItem>
                        {getFieldDecorator('token', {
                            rules: [{ required: true, message: '请输入验证码' }],
                            validateTrigger: 'onBlur'
                        })(
                            <Input style={{ width: '55%' }} placeholder="请输入验证码" />
                        )}
                        <CutDownButton onClick={this.sendCode} text="获取验证码" />
                    </FormItem>
                    <FormItem>
                        <Button disabled={!token} type="primary" htmlType="submit" className={style['login-form-button']}>
                            登录
                        </Button>
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked'
                        })(
                            <Checkbox>30天内记住此浏览器</Checkbox>
                        )}
                    </FormItem>
                </IndexForm>
            </div>
        );
    }

}

const WrappedLogin = Form.create()(SecoundVerify);
export default WrappedLogin;



// WEBPACK FOOTER //
// ./src/pages/SecoundVerify/index.js