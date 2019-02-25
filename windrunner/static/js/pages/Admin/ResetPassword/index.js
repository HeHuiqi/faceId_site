import React from 'react';
import { withRouter } from 'react-router-dom';
import {Card, Form, Input, Button, Modal} from 'antd';
import {updatePassword} from 'actions/permission';
import {toUrl} from 'utils/tool.js';

import style from './index.less';
const FormItem = Form.Item;

class ResetPassword extends React.Component {
    state = {
        loading: false
    };
    onSubmit = (e)=> {
        e.preventDefault();
        this.props.form.validateFields((error, values)=> {
            if (!error) {
                delete values['new_password_confirm'];
                this.setState({loading: true});
                updatePassword(values).then(()=> {
                    this.setState({loading: false});
                    Modal.success({
                        title: '密码修改成功',
                        onOk: ()=> {
                            toUrl('/admin/login');
                        }
                    });
                }).catch(()=> {
                    this.setState({loading: false});
                });

            }
        });
    }
    handleConfirmPassword = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('new_password')) {
            callback('两次输入不一致');
        }

        if(value && value.length > 0){
            if (value.length < 8 || !/[0-9]+/.test(value) || !/[a-zA-Z]+/.test(value)) {
                callback('至少8个字符，包含字母、数字等');
                return;
            }

        }
        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const FormItemLayout = {
            labelCol: {
                span: 3,
                offset: 2
            },
            wrapperCol: {
                span: 8
            }
        };
        return (
            <div className={style.password}>
                <Card title="密码&设置" style={{ width: '100%' }}>
                    <Form layout="horizontal" onSubmit={this.onSubmit}>
                        <FormItem {...FormItemLayout} label="原密码" colon={true}>
                            {getFieldDecorator('source_password', {
                                rules: [
                                    {required: true, message: '原密码不能为空'}
                                ]
                            })(
                                <Input type="password"/>
                            )}
                        </FormItem>

                        <FormItem {...FormItemLayout} label="新密码" colon={true}>
                            {getFieldDecorator('new_password', {
                                rules: [
                                    {required: true, message: '新密码不能为空'},
                                    {validator: this.handleConfirmPassword}
                                ]

                            })(
                                <Input type="password"/>
                            )}
                        </FormItem>

                        <FormItem {...FormItemLayout} label="确认新密码" colon={true}>
                            {getFieldDecorator('new_password_confirm', {
                                rules: [
                                    {required: true, message: '确认新密码不能为空'},
                                    {validator: this.handleConfirmPassword}
                                ]

                            })(
                                <Input type="password"/>
                            )}
                        </FormItem>
                        <FormItem wrapperCol={{offset: 5}} >
                            <Button type="primary" htmlType="submit" loading={this.state.loading}>确认修改</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        );
    }
}
const WrapperResetPassword = Form.create({})(ResetPassword);
export default withRouter(WrapperResetPassword);



// WEBPACK FOOTER //
// ./src/pages/Admin/ResetPassword/Overview.js