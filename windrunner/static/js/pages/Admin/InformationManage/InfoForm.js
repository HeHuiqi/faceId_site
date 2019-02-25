import React from 'react';
import { Button, Form, Input, Modal, Icon, Select, Radio} from 'antd';
import { withRouter } from 'react-router-dom';
import style from './create.less';
import RadioGroup from 'antd/lib/radio/group';
const FormItem = Form.Item;
const CONTENT_TYPE_GG = 'gg';
const CONTENT_TYPE_DX = 'dx';

class InformationForm extends React.Component {
    state = {
        showModal: false,
        content_type: CONTENT_TYPE_GG,
        isAll: false
    };
    onConfirm = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.is_pop_up) {
                    values['is_pop_up'] = values.is_pop_up === 'true' ? true : false;
                }
                this.values = values;
                this.setState({showModal: true});
            }
        });
    }

    onConfirmCancel = () => {
        this.setState({showModal: false});
    }

    handleChange = (value) => {
        this.setState({content_type: value});
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        let messageForm;
        if (this.state.content_type === CONTENT_TYPE_GG) {
            messageForm = [
                <FormItem
                    label="显示弹窗"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 4 }}
                >
                    {getFieldDecorator('is_pop_up', {
                        initialValue: this.props.formData ? (this.props.formData['is_pop_up'] + '') : 'true',
                        rules: [
                            { required: true, message: '未设置是否显示弹窗' }
                        ],
                    })(
                        <Select disabled={!!this.props.formData}>
                            <Select.Option value="true">是</Select.Option>
                            <Select.Option value="false">否</Select.Option>
                        </Select>
                    )}
                </FormItem>
            ];
        }else {
            messageForm = [
                <FormItem
                    label="短信模板id"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 8 }}
                >
                    {getFieldDecorator('template_id', {
                        rules: [
                            { required: true, message: '短信模板id不能为空' },
                            { pattern: /^\d+$/, message: '短信模板id只能是数字' }
                        ],
                    })(
                        <Input />
                    )}
                </FormItem>,
                <div>
                    <FormItem label="用户名列表" labelCol={{span: 3}} wrapperCol={{ span: 8}}>
                        <RadioGroup defaultValue="none" onChange={e=> {
                            this.setState({isAll: e.target.value === 'all'});
                            this.props.form.setFieldsValue({user_list: e.target.value === 'all' ? '全部' : null});
                        }}>
                            <Radio value="all">全部客户</Radio>
                            <Radio value="none">自定义客户</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        wrapperCol={{ span: 8, offset: 3 }}
                        style={{display: this.state.isAll?'none':'block'}}
                    >
                        {getFieldDecorator('user_list', {
                            rules: [
                                { required: true, message: '用户名列表不能为空' }
                            ],
                        })(
                            <Input.TextArea rows={3} />
                        )}
                        <span className={style.titleExtra}>(请用分号分隔用户名)</span>
                    </FormItem>
                </div>
            ];
        }
        return (
            <Form >
                <FormItem
                    label="消息类型"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 4 }}
                >
                    {getFieldDecorator('content_type', {
                        initialValue: this.state.content_type,
                        rules: [
                            { required: true, message: '消息类型不能为空' }
                        ],
                    })(
                        <Select onChange={this.handleChange} disabled={this.props.type === 'update'}>
                            <Select.Option value={CONTENT_TYPE_GG}>公告</Select.Option>
                            <Select.Option value={CONTENT_TYPE_DX}>短信</Select.Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    label="消息内容"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 8 }}
                >
                    {getFieldDecorator('content', {
                        initialValue: this.props.formData ? this.props.formData['content'] : null,
                        rules: [
                            { required: true, message: '消息内容不能为空' },
                            { max: 256, message: '不能超过256个汉字' }
                        ],
                    })(
                        <Input.TextArea rows={3} />
                    )}

                </FormItem>
                { messageForm  }
                <FormItem wrapperCol={{ offset: 2}}>
                    <Button type="primary" disabled={this.props.loading} style={{width: 80}} onClick={this.onConfirm}>{this.props.type === 'create' ? '发送' : '修改'}</Button>
                </FormItem>
                <Modal
                    visible={this.state.showModal}
                    onCancel={this.onConfirmCancel}
                    footer={
                        <div>
                            <Button type="default" onClick={this.onConfirmCancel}>返回修改</Button>
                            <Button type="primary" onClick={ ()=> {
                                this.setState({showModal: false});
                                this.props.onSubmit(this.values);
                            }} disabled={this.props.loading} loading={this.props.loading}>确定发送</Button>
                        </div>
                    }
                >
                    <div className={style.confirm}>
                        <h4>确定发送此消息？</h4>
                    </div>
                    <div className={style.iconBox}>
                        <Icon type="exclamation-circle" />
                    </div>
                </Modal>
            </Form>
        );
    }

}

const InfoForm = Form.create({})(InformationForm);
export default withRouter(InfoForm);



// WEBPACK FOOTER //
// ./src/pages/Admin/InformationManage/InfoForm.js