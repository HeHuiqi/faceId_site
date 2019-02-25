import React from 'react';
import BaseContent from 'components/BaseContent';
import { withRouter } from 'react-router-dom';
import {Button, Form, Input, InputNumber, Select, Modal} from 'antd';
import {createInvitationCode} from 'actions/invitationCode';
import {SERVICE_OPTIONS, SERVICE_TYPE_OPTIONS, usernameRule} from 'utils/const';
const Option = Select.Option;

class InvitationCodeCreate extends React.Component {
    onSubmit = (e)=> {
        e.preventDefault();
        this.props.form.validateFields((error, values)=> {
            if (!error) {
                createInvitationCode(values).then(e=> {
                    Modal.success({
                        title: '邀请码创建成功',
                        onOk: ()=> {
                            this.props.history.push(`/admin/pages/${values.username}/${values.service_id+'-'+values.service_type}/invitation-code`);
                        }
                    });
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const FormItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {
                span: 5
            }
        };
        return (
            <BaseContent>

                <Form onSubmit={this.onSubmit}>

                    <Form.Item label="用户名" {...FormItemLayout}>
                        {getFieldDecorator('username', {
                            rules: usernameRule
                        })(
                            <Input placeholder="请输入用户名"/>
                        )}

                    </Form.Item>

                    <Form.Item label="产品" {...FormItemLayout}>
                        {getFieldDecorator('service_id', {
                            initialValue: SERVICE_OPTIONS[0].value,
                            rules: [{required: true, message: '请输入产品'}]
                        })(
                            <Select >
                                {SERVICE_OPTIONS.map((option, index)=> {
                                    return <Option key={index} value={option.value}>{option.label}</Option>;
                                })}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item label="类型" labelCol={{span: 2}} wrapperCol={{span: 3}}>
                        {getFieldDecorator('service_type', {
                            initialValue: SERVICE_TYPE_OPTIONS[0].value,
                            rules: [{required: true, message: '请输入类型'}]
                        })(
                            <Select>
                                {SERVICE_TYPE_OPTIONS.map((option, index)=> {
                                    return <Option key={index} value={option.value}>{option.label}</Option>;
                                })}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="有效期" {...FormItemLayout}>
                        {getFieldDecorator('expire_time', {
                            initialValue: 7
                        })(
                            <InputNumber max={365} min={1}/>
                        )}
                        <span style={{marginLeft: 10, fontSize: 14, color: '#666666'}}>天</span>
                        <span style={{marginLeft: 10, fontSize: 12, color: '#9B9B9B'}}>最多365天</span>
                    </Form.Item>

                    <Form.Item label="使用次数" {...FormItemLayout}>
                        {getFieldDecorator('max_call', {
                            initialValue: 30
                        })(
                            <InputNumber max={10000} min={1}/>
                        )}
                        <span style={{marginLeft: 10, fontSize: 14, color: '#666666'}}>次</span>
                        <span style={{marginLeft: 12, fontSize: 12, color: '#9B9B9B'}}>最多10,000次</span>
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 2}}>
                        <Button type="primary" htmlType="submit">生成邀请码</Button>
                        <span style={{marginLeft: 10, fontSize: 12, color: '#9B9B9B'}}>新的邀请码生成后，之前的邀请码会失效。</span>
                    </Form.Item>
                </Form>
            </BaseContent>
        );
    }
}
const WrapperInvitationCodeCreate = Form.create({})(InvitationCodeCreate);
export default withRouter(WrapperInvitationCodeCreate);



// WEBPACK FOOTER //
// ./src/pages/Admin/InvitationCode/Manage/Create.js