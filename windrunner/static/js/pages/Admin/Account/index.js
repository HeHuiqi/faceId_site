import React from 'react';
import { withRouter } from 'react-router-dom';
import BaseContent from 'components/BaseContent';
import Table from 'components/Table';
import { Button, Input, Modal} from 'antd';
import {getAccounts, resetPassword, deleteAccount} from 'actions/permission';
import style from './index.less';

const Filter = (props)=> {
    return (
        <Input.Search
            placeholder="搜索账号"
            enterButton
            size="small"
            style={{width: 200, display: 'block', margin: '40px 0 20px'}}
            onSearch={props.search}
        />
    );
};
class Account extends React.Component {
    state = {
        total: 10,
        list: [],
        loading: false, //table数据加载状态
    };
    columns = [{
        title: '账号',
        dataIndex: 'username',
        key: 'username',
        width: 120,
        // fixed: 'left',
    },{
        title: '姓名',
        dataIndex: 'realname',
        key: 'realname',
        width: 120,
        // fixed: 'left',
    },{
        title: '角色',
        dataIndex: 'roles',
        key: 'roles'
    },{
        title: '手机',
        dataIndex: 'phone',
        key: 'telephone',
        width: 120,
    },{
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 200,
        // sorter: true
    },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:180,
        render: (text, record, index) => {
            const operation = [
                <a onClick={e=> this.props.history.push(`/admin/pages/account/update/${record.id}`)}>管理</a>,
                '  |  ',
                <a onClick={this.resetPassword.bind(this,record.id)}>重置密码</a>,
                '  |  ',
                <a onClick={this.delete.bind(this, record.id)} style={{color: 'red'}}>删除</a>
            ];
            return operation;
        }
    }];
    delete = (id)=> {
        Modal.confirm({
            title: '确认要删除该账号吗?',
            content: '账号删除后，不可以恢复',
            onOk:()=>{
                const page = this.table.state.current;
                deleteAccount(id).then(e=> {
                    this.table.change(page);
                });
            }
        });
    }
    resetPassword = (account_id)=> {
        resetPassword(account_id).then(e=> {
            Modal.success({
                title: '密码重置邮件已发送！',
            });
        });

    }
    search = (value)=> {
        this.filterParams = {q: value};
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
        return getAccounts(_params).then(e => {
            this.setState({
                list: e.data.this_page,
                total: e.data.total,
                loading: false
            });
        }).catch(err=> {
            this.setState({loading: false});
        });

    }
    componentDidMount() {
        this.table.change(1);
    }
    render() {

        return (
            <BaseContent>
                <p className={style.tips}>
                    您可以创建账号，与您一起管理控制台。通过为他们配置角色或权限，您可以限制他们的数据访问和功能使用。<br/>
                    您也可以随时删除这些账号，被删除的账号将无法继续使用您的控制台。
                </p>
                <Button type='primary' onClick={e=> this.props.history.push('/admin/pages/account/create')}>创建账号</Button>
                <Filter search={this.search}/>
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
export default withRouter(Account);


// WEBPACK FOOTER //
// ./src/pages/Admin/Account/Overview.js