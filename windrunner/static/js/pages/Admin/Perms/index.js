import React from 'react';
import { withRouter } from 'react-router-dom';
import BaseContent from 'components/BaseContent';
import {Button, Modal} from 'antd';
import Table from 'components/Table';
import {getAllRoles, deleteRole} from 'actions/permission';
import style from './index.less';

class Perms extends React.Component {
    state = {
        total: 10,
        list: [],
        loading: false
    };
    columns = [{
        title: '角色',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        // fixed: 'left',
    },{
        title: '备注',
        dataIndex: 'description',
        key: 'description',
        // fixed: 'left',
    },{
        title: '权限点',
        dataIndex: 'permission_cnt',
        key: 'permission_cnt',
        render: (text)=> {
            return `${text}个权限点`;
        }
    },{
        title: '账号数',
        dataIndex: 'account_cnt',
        key: 'account_cnt',
        width: 120,
    },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:240,
        render: (text, record, index) => {
            const operation = [
                <a onClick={e=> this.props.history.push(`/admin/pages/perms/update/${record.id}`)}>编辑角色和权限</a>,
                '  |  ',
                <a onClick={e=> this.props.history.push(`/admin/pages/perms/accredit/${record.id}`)}>管理成员</a>,
                '  |  ',
                <a onClick={this.delete.bind(this, record.id)} style={{color: 'red'}}>删除</a>
            ];
            return operation;
        }
    }];
    delete = (role_id)=> {
        Modal.confirm({
            title: '确认要删除该角色吗?',
            content: '角色删除后，不可以恢复',
            onOk:()=>{
                const page = this.table.state.current;
                deleteRole(role_id).then(e=> {
                    this.table.change(page);
                });
            }
        });

    }
    search = (value)=> {
        this.filterParams = {account: value};
        this.table.change(1);
    }

    onStart = (tableParams, filters)=> {
        tableParams = tableParams || {};
        let _params = { ...tableParams };
        if(filters && filters.status){
            _params.status = filters.status;
        }
        if(this.filterParams){
            _params = {..._params,...this.filterParams};
        }
        // console.log(_params);
        this.setState({loading: true});
        return getAllRoles(_params).then(e => {

            this.setState({
                list: e.data.this_page,
                total: e.data.total,
                loading: false
            });
        }).catch(err=> this.setState({loading: false}));

    }
    componentDidMount() {
        this.table.change(1);
    }
    render() {

        return (
            <BaseContent>
                <p className={style.tips}>
                    角色是权限点的集合。您可以按您的组织或业务所需，通过创建角色——如“开发”、“运营”——来绑定一组权限点.<br/>
                    然后您可以赋予账号角色，实现更加直观和便利的账号赋权。
                </p>
                <Button type='primary' onClick={e=> this.props.history.push('/admin/pages/perms/create')}>创建角色</Button>

                <Table
                    loading={this.state.loading}
                    className={style.table}
                    rowKey='id'
                    dataSource={this.state.list}
                    columns={this.columns}
                    onSubmit={this.onStart}
                    total={this.state.total}
                    ref={ref => this.table = ref}
                />
            </BaseContent>
        );
    }
}
export default withRouter(Perms);


// WEBPACK FOOTER //
// ./src/pages/Admin/Perms/Overview.js