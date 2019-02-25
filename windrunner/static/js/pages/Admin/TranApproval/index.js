import React from 'react';
import Table from 'components/Table';
import BaseContent from 'components/BaseContent';
import { getBusiness } from 'actions/adminClients';
import { getOfflineTrade,changeOfflineTrade,exportTrade,getTradeClient } from 'actions/adminOfflineTrade';
import { Spin,Modal,Input,Form,Select } from 'antd';
import Fform from 'components/FilterForm';
import moment from 'moment';
import BaseRangePicker from 'components/BaseRangePicker';
import MaxAndMinInput from 'components/MaxAndMinInput';
const Option = Select.Option;
const FormItem = Form.Item;

class TranApproval extends React.Component {

    state = {
        loading:false,
        userList:[],
        list: [],
        exportUrl:'',
        type:'trade_no'
    }
    selectUser = 'all';
    columns = [{
        title: '订单编号',
        dataIndex: 'trade_no',
        key: 'trade_no',
        fixed: 'left',
        width: 300,
    }, {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
    }, {
        title: '企业名',
        dataIndex: 'company_name',
        key: 'company_name'
    }, {
        title: '时间',
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: true,
        render:(text)=>{
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    }, {
        title: '充值方式',
        dataIndex: 'pay_type',
        key: 'pay_type',
        filters: [
            { text: '支付宝', value: 1 },
            { text: '线下转账', value: 2 },
            { text: '个人网银', value: 3 },
            { text: '企业网银', value: 4 }
        ],
    },{
        title: '充值金额',
        dataIndex: 'total_amount',
        key: 'total_amount',
        sorter: true
    },{
        title: '实际花费',
        dataIndex: 'amount',
        key: 'amount'
    },{
        title: '流水号',
        dataIndex: 'trade_no_thirdparty',
        key: 'trade_no_thirdparty'
    },{
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        filters:[
            { text: '待确认', value: 1 },
            { text: '已完成', value: 2 },
            { text: '已关闭', value: 4 }
        ],
        render:(text)=>{
            let _res;
            switch (text) {
                case 1:
                    _res='待确认';
                    break;
                case 2:
                    _res='已确认';
                    break;
                case 4:
                    _res='已关闭';
                    break;
                default:
                    break;
            }
            return _res;
        }
    },{
        title: '商务',
        dataIndex: 'business',
        key: 'business_list',
        filterMultiple:false
    }, {
        title: '操作',
        dataIndex: 'trade_no',
        key: 'trade_no',
        fixed: 'right',
        width: 200,
        render:(text,info)=>{
            if(info.pay_type !== '线下转账'){
                return '';
            }
            if(info.status === 1){
                return <div><a onClick={this.changeTrade.bind(this,text,'confirm')}>确认充值</a>&nbsp;|&nbsp;<a onClick={this.changeTrade.bind(this,text,'close')}>关闭交易</a></div>;
            }
        }
    }];

    componentDidMount() {
        //获取商务列表
        Promise.all([getBusiness(),getTradeClient()]).then(res=>{
            //处理数据
            const _data = res[0].data.map(item=>{
                return { text: item.username, value:item.id };
            });
            this.columns.forEach(item=>{
                if(item.dataIndex === 'business'){
                    item.filters = _data;
                }
            });
            this.setState({userList:res[1].data});
            this.handleSubmit();
        });


    }

    changeTrade=(id,type)=>{
        let okText='确认',content='确定关闭该交易么？';
        if(type === 'confirm'){
            okText = '确认充值';
            content =  '请与财务确认该订单已经充值成功，确认后无法撤销操作！';
        }
        Modal.confirm({
            title: '提醒',
            content,
            okText,
            cancelText: '取消',
            onOk:()=>{
                changeOfflineTrade(id,type).then(e=>{
                    this.table.refresh();
                });
            }
        });
    }


    onStart = (tableParams,filters) => {
        tableParams = tableParams || {};
        let _params = { ...tableParams };
        if(this.filterParams){
            _params = {..._params,...this.filterParams};
        }
        if(filters){
            _params = {..._params,...filters};
        }
        this.setState({exportUrl:exportTrade(_params)});
        return getOfflineTrade(_params).then(e => {
            this.setState({ list: e.data.this_page ? e.data.this_page : [], total: e.data.total });
        });
    }

    onUserChange = (e)=>{
        this.selectUser = e;
    }

    handleSubmit = (e) => {
        if(e){
            e.preventDefault();
        }
        this.props.form.validateFields((err, values)=>{
            if(err){
                return;
            }
            this.filterParams = {};
            const selectTime = this.rangePicker.getSelectTime();
            this.filterParams = {
                ...this.filterParams,
                start_date:selectTime[0].format('YYYY-MM-DD'),
                end_date:selectTime[1].format('YYYY-MM-DD'),
            };
            if(this.selectUser!=='all'){
                this.filterParams.account_id = this.selectUser;
            }
            const formValues = this.props.form.getFieldsValue();
            Object.keys(formValues).forEach(item=>{
                if(formValues[item] === ''){
                    delete formValues[item];
                }
            });
            if(formValues.amount.min !== ''){
                this.filterParams.min_amount = formValues.amount.min;
            }
            if(formValues.amount.max !== ''){
                this.filterParams.max_amount = formValues.amount.max;
            }
            delete formValues.amount;
            this.filterParams = {...this.filterParams,...formValues};
            this.table.resetChange();
        });
    }

    onUserChange = (e)=>{
        this.selectUser = e;
    }

    onTypeChange = (type)=>{
        this.setState({type});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const filter = [
            <FormItem
                label="时间"
            >
                <BaseRangePicker incluedToday ref={(ref)=>this.rangePicker=ref}/>
            </FormItem>,
            <FormItem
                label="金额"
            >
                {getFieldDecorator('amount',{
                    initialValue:{min:'',max:''},
                    rules:[
                        {validator:(rule, value, callback)=>{
                                if((value.min !== '' && value.max ==='')){
                                    callback('请填写最大值');
                                }else if((value.min==='' && value.max!=='')){
                                    callback('请填写最小值');
                                }else{
                                    callback();
                                }
                            }}
                    ]
                })(
                    <MaxAndMinInput />
                )}
            </FormItem>
        ];
        if(this.state.type === 'trade_no'){
            filter.unshift(<FormItem
                label="订单编号"
            >
                {getFieldDecorator('q',{
                    initialValue:''
                })(
                    <Input style={{width:200}} type="text"/>
                )}
            </FormItem>);
        }else{
            filter.unshift(
                <FormItem
                    label={this.state.type === 'username'?'用户名':'企业名称'}
                >
                    <Select
                        defaultValue='all'
                        style={{ width: 120 }}
                        onChange={this.onUserChange}
                        showSearch
                        optionFilterProp="children"
                    >
                        <Option value='all'>全部</Option>
                        {this.state.userList.map(item=>{
                            return <Option value={item.account_id}>{this.state.type === 'username'?item.username:item.company_name}</Option>;
                        })}
                    </Select>
                </FormItem>
            );
        }


        return (
            <BaseContent>
                <Spin
                    spinning={this.state.loading}
                    tip="提交中"
                >
                    <Fform exportUrl={this.state.exportUrl} layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem
                            label="检索方法"
                        >
                            <Select
                                defaultValue={this.state.type}
                                style={{ width: 120 }}
                                onChange={this.onTypeChange}
                            >
                                <Option value='trade_no'>订单编号</Option>
                                <Option value='company_name'>企业名称</Option>
                                <Option value='username'>用户名</Option>
                            </Select>
                        </FormItem>
                        {filter}

                    </Fform>
                    <Table
                        scroll={{ x: '200%'}}
                        style={{ marginTop: 20 }}
                        dataSource={this.state.list}
                        columns={this.columns}
                        onSubmit={this.onStart}
                        total={this.state.total}
                        ref={ref => this.table = ref}
                    />
                </Spin>
            </BaseContent>
        );
    }

}
export default Form.create()(TranApproval);




// WEBPACK FOOTER //
// ./src/pages/Admin/TranApproval/Overview.js