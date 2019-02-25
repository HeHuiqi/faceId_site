import React from 'react';
import BaseContent from 'components/BaseContent';
import { withRouter } from 'react-router-dom';
import Table from 'components/Table';
import TableFiltersForm from './Filters';
import DelayForm from './DelayForm';
import moment from 'moment';
import {Modal, Button, Checkbox } from 'antd';
import {getCoupons, delayCoupons, deleteCoupons,setCouponApproval,getCouponCreators} from 'actions/coupon';
import style from './index.less';
const status_map = {
    1:'未开始',
    2:'可使用',
    3:'已使用',
    4:'已过期',
    5:'已删除',
    6:'待审批',
    7:'已拒绝'
};


class Coupon extends React.Component {
    state = {
        list: [],
        showDelayModal: false,
        selectedRowKeys:[],
        selectdisabled: true
    };
    columns = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
        width: 200
    },{
        title: '用户',
        dataIndex: 'username',
        key: 'username',
        fixed: 'left',
        width: 200
    },{
        title: '规则',
        dataIndex: 'rule',
        key: 'rule',
        render: (text, record, index)=> {
            return `满${text}可用`;
        }
    },{
        title: '面额',
        dataIndex: 'amount',
        key: 'amount',
        sorter: true
    },{
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        render: (text) => {
            return <span className={style[`status_${text}`]}>{status_map[text]}</span>;
        }
    },{
        title: '申请者',
        dataIndex: 'creator',
        key: 'creator_ids'
    },{
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: true,
        render: (text) => {
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    },{
        title: '修改时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        sorter: true,
        render: (text) => {
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    },{
        title: '生效时间',
        dataIndex: 'stime',
        key: 'stime',
        sorter: true,
        render: (text, record, index) => {
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    },{
        title: '到期时间',
        dataIndex: 'etime',
        key: 'etime',
        sorter: true,
        render: (text, record, index) => {
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    },{
        title: '标签',
        dataIndex: 'tags',
        key: 'tags'
    },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:150,
        fixed: 'right',
        render: (text, record, index) => {
            const control = [];
            if ([3,4,5].indexOf(record.status) > -1) {
                control.push(<span style={{color: '#999999'}}>编辑</span>);
            }else{
                control.push(<a onClick={e=> this.props.history.push(`/admin/pages/coupon/update/${record.id}`)}>编辑</a>);
            }
            if(record.status === 6){
                control.push([<a onClick={this.onApproval.bind(this,record,'accept')}>同意</a>,<a onClick={this.onApproval.bind(this,record,'refuse')}>拒绝</a>]);
            }
            return <div class={style.control}>{control}</div>;
        }
    }];

    componentDidMount() {

        //获取申请者列表
        getCouponCreators().then(res=>{
            this.columns.forEach(item=>{
                if(item.key==='creator_ids'){
                    item.filters = res.data.map(data=>{
                        return {
                            text: data.username,
                            value: data.id,
                        };
                    });
                }
            });
            this.table.change(1);
        });
    }

    onApproval = (item,type)=>{
        setCouponApproval(item.id,type).then(res=>{
            // item.status = 1;
            // this.setState({list:this.state.list});
            this.table.refresh();
        });
    }

    onSelectChange = (e)=>{
        if(e.target.checked){

            this.setState({selectedRowKeys:this.canSelectCacheKeys,checkAll:true,indeterminate:false});
        }else{
            this.setState({selectedRowKeys:[],checkAll:false,indeterminate:false});
        }

    }

    onShowDelay = ()=> {
        if (this.state.selectedRowKeys.length === 0) {
            return;
        }
        this.setState({showDelayModal: true});
    }

    hideDelayModal = ()=> {
        this.setState({showDelayModal: false});
    }

    onDelete = ()=> {
        if (this.state.selectedRowKeys.length === 0) {
            return;
        }
        Modal.confirm({
            title: '确认要删除这些代金券吗?',
            content: '代金券删除后，不可以恢复',
            onOk:()=>{
                // TODO: 调用接口删除代金券
                const page = this.table.state.current;
                const params ={
                    id_list:this.state.selectedRowKeys
                };
                deleteCoupons(params).then(()=> {
                    this.table.change(page);
                }).catch(()=> {

                });
            }
        });
    }

    onDelay = (params)=> {
        // TODO: 调用接口批量设置延期时间
        const page = this.table.state.current;
        params.id_list = this.state.selectedRowKeys;
        delayCoupons(params).then(()=> {
            this.table.change(page);
            this.hideDelayModal();
        }).catch(()=> {

        });
    }

    onSearch = (filters)=> {
        const timeArray = filters.time;
        delete filters.time;
        if(timeArray){
            filters.stime = timeArray[0].format('YYYY-MM-DD');
            filters.etime = timeArray[1].format('YYYY-MM-DD');
        }
        this.filterParams = filters;
        this.table.change(1);
    }

    onStart = (tableParams, filters)=> {
        tableParams = tableParams || {};
        let _params = { ...tableParams,...filters};
        if(this.filterParams){
            _params = {..._params,...this.filterParams};
        }
        return getCoupons(_params).then(e => {
            this.canSelectCacheKeys = e.data.this_page.filter(item=>{
                return [3,4,5].indexOf(item.status) < 0;
            }).map(item=>{
                return item.id;
            });
            const selectdisabled = this.canSelectCacheKeys.length === 0;
            this.setState({
                list: e.data.this_page,
                total: e.data.total,
                selectdisabled,
                selectedRowKeys:[],
                checkAll:false,
                indeterminate:false
            });
        });

    }

    render() {

        const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: (selectedRowKeys) => {
                //改为可控属性
                let indeterminate = false,checkAll = false;

                if(selectedRowKeys.length !== 0){
                    if(selectedRowKeys.length !== this.canSelectCacheKeys.length){
                        indeterminate = true;
                    }else{
                        checkAll = true;
                    }

                }
                this.setState({selectedRowKeys,indeterminate,checkAll});
            },
            getCheckboxProps: record => ({
                disabled: [3,4,5].indexOf(record.status) > -1
            }),
        };
        const footer = ()=> (
            <div>
                <div className={style.checkAll}>
                    <Checkbox
                        disabled={this.state.selectdisabled}
                        onChange={this.onSelectChange}
                        checked={this.state.checkAll}
                        indeterminate={this.state.indeterminate}
                    />
                </div>
                {/* <Button type="default" onClick={this.onShowDelay}>批量延期</Button> */}
                <Button type="default" style={{marginLeft: 20}} onClick={this.onDelete}>批量删除</Button>
            </div>
        );

        return (
            <div style={{marginTop: 20}}>
                <BaseContent>
                    <TableFiltersForm
                        history={this.props.history}
                        onSearch={this.onSearch}/>

                    <Table
                        rowKey='id'
                        scroll={{ x: '200%'}}
                        rowSelection={rowSelection}
                        footer={footer}
                        dataSource={this.state.list}
                        columns={this.columns}
                        onSubmit={this.onStart}
                        total={this.state.total}
                        ref={ref => this.table = ref}
                    />
                    <DelayForm
                        visible={this.state.showDelayModal}
                        hideModal={this.hideDelayModal}
                        onDelay={this.onDelay}
                        count={this.state.selectedRowKeys.length}/>
                </BaseContent>
            </div>
        );
    }
}

export default withRouter(Coupon);



// WEBPACK FOOTER //
// ./src/pages/Admin/Coupon/Overview.js