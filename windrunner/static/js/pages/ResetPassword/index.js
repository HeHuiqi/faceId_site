import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { resetPassword } from 'actions/oldAccount';
import PropTypes from 'prop-types';
import IndexForm from 'components/IndexForm';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

const FormItem = Form.Item;

class ResetPasswordOld extends React.Component {

    state = {

    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const params = {
                    password:values['password'],
                    token:queryString.parse(this.props.location.search).token
                };
                resetPassword(params).then(e=>{
                    Modal.success({
                        title: '重置密码成功，请用新密码重新登录',
                        onOk: () => {
                            this.context.router.history.push('/login');
                        }
                    });
                }).catch(err=>{
                    err = err.data;
                    this.setState({errMsg:err.msg});
                });
            }
        });
    }

    render() {
        const { getFieldDecorator,getFieldValue } = this.props.form;
        return (
            <IndexForm title="设置密码" onSubmit={this.handleSubmit}>
                <div style={{ position: 'absolute', top: -25, color:'#f5222d'}}>{this.state.errMsg}</div>
                <FormItem>
                    {/* 兼容去掉chrome密码自动填充 */}
                    <input type="password" name="password" style={{display:'none'}} />
                    {getFieldDecorator('password', {
                        rules: [
                            {validator:(rule, value, callback)=>{
                                    if(value.length < 8 || !/[0-9]+/.test(value) || !/[a-zA-Z]+/.test(value)){
                                        callback('至少8个字符，包含字母、数字等！');
                                        return;
                                    }
                                    callback();
                                }}
                        ],
                        validateTrigger: 'onBlur'
                    })(
                        <Input type="password" placeholder="请输入密码" />
                    )}
                </FormItem>
                <FormItem>
                    {/* 兼容去掉chrome密码自动填充 */}
                    <input type="password" name="password" style={{display:'none'}} />
                    {getFieldDecorator('passwordtwo', {
                        rules: [
                            {validator:(rule, value, callback)=>{
                                    const pass = getFieldValue('password');
                                    if(value !== pass){
                                        callback('两次输入密码不一致，请重新输入');
                                        return;
                                    }
                                    callback();
                                }}
                        ],
                        validateTrigger: 'onBlur',
                    })(
                        <Input type="password" placeholder="请输入密码" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit">重置密码</Button>
                    <Link to="/login">返回登录</Link>
                </FormItem>
            </IndexForm>
        );
    }

}
ResetPasswordOld.contextTypes = {
    router: PropTypes.object
};

const WrappedForgetPassword = Form.create()(ResetPasswordOld);
export default WrappedForgetPassword;



// WEBPACK FOOTER //
// ./src/pages/ResetPasswordOld/index.js