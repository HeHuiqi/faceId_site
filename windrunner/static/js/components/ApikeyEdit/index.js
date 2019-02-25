import React from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
    },
};

class ApiKeyEdit extends React.Component {
    state = {
        showSecret:false
    }
    onShowSecret=()=>{
        this.setState({showSecret:!this.state.showSecret});
    }

    render(){
        const info = this.props.info || {};
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="应用名称"
                >
                    {getFieldDecorator('name', {
                        initialValue:info.name,
                        rules: [
                            { required: true, message: '请输入应用名称' },
                            { max: 64, message: '最多输入64个字符' }
                        ],
                    })(
                        <Input id="error" placeholder="最多输入64个字符"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="应用描述"
                >
                    {getFieldDecorator('description', {
                        initialValue:info.description,
                        rules: [
                            { max: 256, message: '最多输入256个字符' }
                        ],
                    })(
                        <TextArea autosize={{ minRows: 4, maxRows: 6 }} placeholder="最多输入256个字符" id="error" />
                    )}
                </FormItem>
            </Form>
        );
    }
};

export default Form.create()(ApiKeyEdit);



// WEBPACK FOOTER //
// ./src/components/ApiKeyEdit/Overview.js