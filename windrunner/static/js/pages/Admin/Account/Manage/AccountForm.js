import React from 'react';
import { Form, Button, Input, Table, Checkbox} from 'antd';
import {getAllRoles} from 'actions/permission';
import {usernameRule, phoneReg} from 'utils/const';
const FormItem = Form.Item;

class TableField extends React.Component {
    state = {
        selectedRowKeys: this.props.value || [] //账号角色ID列表
    };

    columns = [{
        title: '',
        dataIndex: 'operation',
        key: 'operation',
        render: (text,record)=> {
            return <Checkbox checked={this.state.selectedRowKeys.indexOf(record.id) > -1}></Checkbox>;
        }
    },{
        title: '角色名',
        dataIndex: 'name',
        key: 'name'
    },{
        title: '备注',
        dataIndex: 'description',
        key: 'description',
    }];

    onRowClick = (e)=> {

        const selectedRowKeys = this.state.selectedRowKeys;
        const index = selectedRowKeys.indexOf(e.id);
        if ( index > -1) {
            selectedRowKeys.splice(index,1);
        }else {
            selectedRowKeys.push(e.id);
        }
        this.setState({selectedRowKeys});
        this.props.onChange(selectedRowKeys);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            const new_ = nextProps.value.sort((a,b)=> a>b).join(',');
            const old_ = (this.props.value && this.props.value.sort((a,b)=> a>b).join(',')) || '';
            if (new_ !== old_) {
                this.setState({selectedRowKeys: nextProps.value});
            }
        }
    }

    render() {

        return <Table
            pagination={false}
            onRowClick={this.onRowClick}
            dataSource={this.props.roles}
            columns={this.columns}
        />;
    }
}

class AccountForm extends React.Component {
    state = {
        roles: []
    };

    onSubmit = (e)=> {
        e.preventDefault();
        this.props.form.validateFields((error, values)=> {
            if (!error) {
                //处理数据
                this.props.onSubmit(values);
            }
        });
    }
    componentWillMount() {
        const params = {
            start:0,
            limit: 10000
        };
        getAllRoles(params).then(res=> {
            const data = res.data;
            this.setState({roles: data.this_page});
        }).catch(err=> {

        });
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const FormItemLayout = {
            wrapperCol: {
                span: 8
            }
        };

        return (
            <Form layout="vertical" onSubmit={this.onSubmit}>

                <FormItem {...FormItemLayout} label="账号名" colon={true}>
                    {getFieldDecorator('username', {
                        rules: usernameRule
                    })(
                        <Input disabled={this.props.type === 'update'}/>
                    )}
                </FormItem>

                <FormItem {...FormItemLayout} label="姓名" >
                    {getFieldDecorator('realname', {
                        rules: [
                            {required: true, message: '请输入姓名'},
                            {max: 11, message: '不能超过11个字符'},
                            {min: 2, message: '不能少于2个字符'},
                        ]
                    })(
                        <Input/>
                    )}
                </FormItem>

                <FormItem {...FormItemLayout} label="手机">
                    {getFieldDecorator('phone', {
                        rules: [
                            {required: true, message: '请输入手机'},
                            {pattern: phoneReg, message: '请输入正确的手机号'}
                        ]
                    })(
                        <Input/>
                    )}
                </FormItem>

                <FormItem {...FormItemLayout}
                          label={<div style={{display: 'inline'}}>邮箱 <span style={{fontSize: 12, paddingLeft: 10, color: '#aaa'}}>该账号设定初次登录密码的链接将发送到该邮箱，请确认填写无误。</span></div>}>
                    {getFieldDecorator('email', {
                        rules: [
                            {required: true, message: '请输入邮箱'},
                            {pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, message: '邮箱格式不正确'}
                        ]
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem label="角色选择">
                    {getFieldDecorator('roles', {
                    })(
                        <TableField roles={this.state.roles}/>
                    )}
                </FormItem>

                <FormItem >
                    <Button type="primary" htmlType="submit">确认</Button>
                </FormItem>
            </Form>
        );
    }
}
const WrapperAccountForm = Form.create({})(AccountForm);
export default WrapperAccountForm;



// WEBPACK FOOTER //
// ./src/pages/Admin/Account/Manage/AccountForm.js