import React from 'react';
import { withRouter } from 'react-router-dom';
import BaseContent from 'components/BaseContent';
import {Form, Input, Button, Table, Modal} from 'antd';

import {getAccountsOfRole, getAccounts, updateRole} from 'actions/permission';


class PermsAccredit extends React.Component {
    state = {
        accounts: [], //角色已关联的账号
        name: '',//角色名
        description: '', //角色描述
        accountListVisible: false, //添加账户成员面板可见状态
        selectedRowKeys: [], //已勾选的新增账户ID列表
        loadingMyAccounts: false, //加载当前角色关联的角色
        loading: false, // 加载账户列表
    };
    columns = [{
        title: '账号',
        dataIndex: 'username',
        key: 'username',
    },{
        title: '姓名',
        dataIndex: 'realname',
        key: 'realname',
    },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record)=> {
            return <a onClick={this.removeAccount.bind(this, record.id)} style={{color: 'red'}}>删除</a>;
        }
    }];

    removeAccount = (accountid)=> {

        const that = this;
        Modal.confirm({
            title: '确定删除该账号?',
            content: '删除后不能撤销操作',
            onOk() {
                updateRole(that.props.match.params.id, {accounts: `-${accountid}`}).then(e=> {
                    that.getMyAccounts();
                });
            }
        });
    }

    addAccount = async ()=> {

        this.setState({loading: true});
        const unSelectedAccounts = [];
        await getAccounts({start: 0, limit: 10000}).then(e=> {
            const allAccounts = e.data.this_page;
            allAccounts.forEach(account=> {
                const ret = this.state.accounts.find(ele=> ele.id === account.id);
                if (!ret) {
                    unSelectedAccounts.push(account);
                }
            });
        });
        this.setState({accountListVisible: true, loading: false, unSelectedAccounts});
    }

    addAccountConfirmed = ()=> {

        if (this.state.selectedRowKeys.length === 0) {
            this.setState({accountListVisible: false});
            return;
        }
        const params = {
            accounts: this.state.selectedRowKeys.map(ele=> `+${ele}`).join(',')
        };
        updateRole(this.props.match.params.id, params).then(e=> {
            this.getMyAccounts();
            this.setState({accountListVisible: false});
        });

    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    getMyAccounts = async ()=> {
        this.setState({loadingMyAccounts: true});
        await getAccountsOfRole(this.props.match.params.id).then(res=> {
            const {accounts, name, description} = res.data;
            this.setState({accounts, name, description});
        }).catch(err=> {

        });
        this.setState({loadingMyAccounts: false});
    }
    componentWillMount() {
        this.getMyAccounts();
    }

    render() {
        const FormItemLayout = {
            labelCol: {
                span: 2,
                offset: 4
            },
            wrapperCol: {
                span: 8
            }
        };
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <BaseContent>
                <Form layout="horizontal">
                    <Form.Item {...FormItemLayout} label="角色名" colon={true}>
                        <Input value={this.state.name} disabled/>
                    </Form.Item>
                    <Form.Item {...FormItemLayout} label="备注" colon={true}>
                        <Input value={this.state.description} disabled/>
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 6}} colon={true}>
                        <Button type="primary" onClick={this.addAccount} loading={this.state.loading}>添加成员</Button>
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 6, span: 8}} style={{marginTop: 20}}>
                        <Table
                            loading={this.state.loadingMyAccounts}
                            bordered
                            pagination={false}
                            columns={this.columns}
                            dataSource={this.state.accounts}/>
                    </Form.Item>
                </Form>
                <Modal
                    visible={this.state.accountListVisible}
                    title="增加角色成员"
                    onOk={this.addAccountConfirmed}
                    onCancel={e=> this.setState({accountListVisible: false})}>
                    <Table
                        pagination={false}
                        columns={this.columns.slice(0,2) }
                        dataSource={this.state.unSelectedAccounts}
                        rowKey="id"
                        rowSelection={rowSelection}/>
                </Modal>
            </BaseContent>
        );
    }
}
export default withRouter(PermsAccredit);



// WEBPACK FOOTER //
// ./src/pages/Admin/Perms/Manage/accredit.js