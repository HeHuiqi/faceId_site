import React from 'react';
import { Form, Button, Input, Checkbox, Spin} from 'antd';
import {getAllPermission} from 'actions/permission';
import style from '../index.less';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;


class PermsForm extends React.Component {
    constructor(props) {
        super(props);
        this.changedDataPerms = [];
        this.changedFuncPerms = [];
    }
    state = {
        dataPermOptions: [], //数据权限点列表
        funcPermOptions: [], //功能权限点列表
        role: {}, //当前角色详情
        loading: false
    };
    onChange = (type, checkedValues)=> {

        const selectedPerms = type === 'func' ? this.props.selectedFuncPerms : this.props.selectedDataPerms;
        const tempCheckedvalues = Object.assign([], checkedValues); //修改后选中的结果
        const tempSelectedFuncPerms = Object.assign([], selectedPerms); //原始选中结果
        const plus = tempCheckedvalues.filter(e=> tempSelectedFuncPerms.indexOf(e) === -1);
        const minus = tempSelectedFuncPerms.filter(e=> tempCheckedvalues.indexOf(e) === -1);
        const changedPerms = minus.map(e=> `-${e}`).concat(plus.map(e=> `+${e}`));
        if (type === 'func') {
            this.changedFuncPerms = changedPerms;
        }else {
            this.changedDataPerms = changedPerms;
        }

    }

    onSubmit = (e)=> {
        e.preventDefault();
        this.props.form.validateFields((error, values)=> {
            if (!error) {
                //处理数据
                const params = Object.assign({}, values);
                delete params['data_perms'];
                delete params['func_perms'];
                const permissions = this.changedDataPerms.concat(this.changedFuncPerms).join(',');
                params['permissions'] = permissions;

                this.props.onSubmit(params);
            }
        });
    }
    async componentWillMount() {
        const params = {start: 0, limit: 10000};
        this.setState({loading: true});
        await getAllPermission(params).then(res=> {
            const pageData = res.data.this_page;

            const funcPermOptions = pageData.filter(e=> e.perm_type === 0).map((item)=> {
                return {label: item.display_name, value: item.id};
            });
            const dataPermOptions = pageData.filter(e=> e.perm_type === 1).map((item)=> {
                return {label: item.display_name, value: item.id};
            });

            this.setState({funcPermOptions, dataPermOptions, loading: false});
        }).catch(e=> {
            this.setState({loading: false});
            this.props.history.push('/admin/pages/perms');
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
            <Form layout="vertical" onSubmit={this.onSubmit} className="role-edit-form">
                <FormItem {...FormItemLayout} label="角色名" colon={true}>
                    {getFieldDecorator('name', {

                        rules: [
                            {required: true, message: '角色名不能为空'},
                            {max: 32, message: '角色描述长度不能超过32个字符'},
                            {min: 2, message: '不能少于2个字符'},
                        ]
                    })(
                        <Input placeholder="角色名长度不能超过32个字符"/>
                    )}
                </FormItem>

                <FormItem {...FormItemLayout} label="备注" colon={true}>
                    {getFieldDecorator('description', {

                        rules: [{max: 64, message: '角色描述长度不能超过64个字符'}]
                    })(
                        <Input placeholder="角色描述长度不能超过64个字符"/>
                    )}
                </FormItem>
                <Spin spinning={this.state.loading} wrapperClassName="role-edit-form">
                    <FormItem {...FormItemLayout} label="功能权限" colon={true}>
                        {getFieldDecorator('func_perms', {

                        })(
                            <CheckboxGroup
                                className={style.selection}
                                options={this.state.funcPermOptions}
                                onChange={this.onChange.bind(this, 'func')} />
                        )}
                    </FormItem>

                    <FormItem {...FormItemLayout} label="数据权限" colon={true}>
                        {getFieldDecorator('data_perms', {

                        })(
                            <CheckboxGroup
                                className={style.selection}
                                options={this.state.dataPermOptions}
                                onChange={this.onChange.bind(this, 'data')}/>
                        )}
                    </FormItem>
                </Spin>
                <FormItem >
                    <Button type="primary" htmlType="submit">确定</Button>
                </FormItem>
            </Form>
        );
    }
}

const WrapperPermsForm = Form.create({})(PermsForm);
export default WrapperPermsForm;



// WEBPACK FOOTER //
// ./src/pages/Admin/Perms/Manage/PermsForm.js