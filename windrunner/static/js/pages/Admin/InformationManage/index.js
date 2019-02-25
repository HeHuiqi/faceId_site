import React from 'react';
import BaseContent from 'components/BaseContent';
import { Button, Icon, Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import Table from 'components/Table';
import moment from 'moment';
import {getStaffMessages, deleteMessage} from 'actions/information';

class InformationManage extends React.Component {
    state = {
        list: []
    }
    columns = [{
        title: '全部消息',
        dataIndex: 'message_content',
        key: 'message_content',
        width: 400,
        fixed: 'left',
        render:(text,record,index)=>{
            return record.message_content;
        }
    },{
        title: '消息类型',
        dataIndex: 'content_type',
        key: 'content_type',
        render:(text,record,index)=>{
            return record.content_type;
        },
        sorter: true
    }, {
        title: '创建人',
        dataIndex: 'editor',
        key: 'editor',
        align: 'center',
        width: 200,
        render:(text,record,index)=>{
            return record.editor;
        }
    },
        {
            title: '时间',
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'right',
            width: 200,
            render:(text,record,index)=>{
                return moment.unix(record.date).local().format('YYYY/MM/DD HH:mm:ss');
            },
            sorter: true
        },{
            title: '操作',
            dataIndex: 'operator',
            key: 'operator',
            align: 'right',
            fixed: 'right',
            render:(text,record,index)=>{
                if (record.content_type === '短信') {
                    return '';
                }
                return (
                    <div>
                        <a style={{marginRight: 10}} onClick={()=> this.props.history.push(`/admin/pages/information/update/${record.id}`)}>修改</a>
                        <a onClick={()=>this.onDeleteMessage(record.id)}>删除</a>
                    </div>
                );
            }
        }];

    onDeleteMessage = (id)=> {
        const that = this;
        Modal.confirm({
            title: '确定删除该消息吗?',
            content: '删除之后不能撤回',
            onOk() {

                const page = that.table.state.current;
                deleteMessage({id}).then(()=> {
                    that.table.change(page);
                }).catch(()=> {

                });
            }
        });

    }

    onStart = (tableParams)=> {
        tableParams = tableParams || {};
        return getStaffMessages(tableParams).then(e => {
            this.setState({ list: e.data.this_page ? e.data.this_page : [], total: e.data.total });
        });

    }

    componentDidMount() {
        this.table.change(1);
    }
    render() {
        return (
            <div>
                <Button type="primary" style={{margin: '20px 0'}}
                        onClick={e=> this.props.history.push('/admin/pages/information/create')}><Icon type="plus" />新建消息</Button>
                <BaseContent>
                    <Table
                        dataSource={this.state.list}
                        columns={this.columns}
                        onSubmit={this.onStart}
                        total={this.state.total}
                        ref={ref => this.table = ref}
                    />
                </BaseContent>
            </div>
        );
    }

}

InformationManage = withRouter(InformationManage);

export default InformationManage;



// WEBPACK FOOTER //
// ./src/pages/Admin/InformationManage/Overview.js