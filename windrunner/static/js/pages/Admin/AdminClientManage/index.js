import React from 'react';
import Table from 'components/Table';
import BaseContent from 'components/BaseContent';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getAllClient,recharge,updateBusiness,exportClients,getBusiness } from 'actions/adminClients';
import { changeActionByClientId } from 'actions/adminAuthManage';
import { Spin, Modal,Input,Form,Button,Select } from 'antd';
import { STATUS } from 'utils/const';
import Fform from 'components/FilterForm';
import BaseRangePicker from 'components/BaseRangePicker';
const Option = Select.Option;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const state_text = {
    [STATUS.UNCERTIFIED]:'未认证',
    [STATUS.TOCERTIFIED]:'待审核',
    [STATUS.PASS]:'已通过',
    [STATUS.DISMISSAL]:'已驳回'
};
const operation_text = ['启用', '停用'];
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};
const moneyReg=/^(-|\+)?\d+(\d+)?$/;
class AdminClientManage extends React.Component {

    state = {
        loading:false,
        list: [],
        showRecharge:false,
        rechargeMoney:'',
        rechargeError:'',
        type:'keyWord',
        selectedBusiness: undefined
    }
    columns = [{
        title: '用户',
        dataIndex: 'username',
        key: 'username',
        fixed: 'left',
        width: 200,
        render: (text, record, index) => {
            return <div style={{textAlign:'left'}}>帐号：{text}<br />id：{record.account_id}</div>;
        }
    }, {
        title: '注册时间',
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: true,
        width:200,
        render: (text, record, index) => {
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    }, {
        title: '联系方式',
        dataIndex: 'email',
        key: 'email',
        width:300,
        render:(text, record, index)=>{
            return <div style={{textAlign:'left'}}>邮箱：{text}<br />手机号：{record.phone}</div>;
        }
    }, {
        title: '企业名称',
        dataIndex: 'company_name',
        key: 'company_name'
    },  {
        title: '充值金额',
        dataIndex: 'recharge_amount',
        key: 'recharge_amount'
    },  {
        title: '赠送金额',
        dataIndex: 'discount_amount',
        key: 'discount_amount'
    },{
        title: '余额',
        dataIndex: 'balance_amount',
        key: 'balance_amount',
        width:100
    },{
        title: '认证时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        width:200,
        render:(text, record)=>{
            if(record.status === STATUS.PASS || record.status === STATUS.DISMISSAL){
                return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
            }
            return '无';
        }
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        render: (text, record, index) => {
            let _state = state_text[text];
            let style = {color:'red'};
            if (record.is_active === 0){
                _state = _state + '(已停用)';
            } else if (text === STATUS.PASS ){
                style = null;
            }

            return <span style={style}>{_state}</span>;
        },
        filters: [
            { text: state_text[STATUS.UNCERTIFIED], value: STATUS.UNCERTIFIED },
            { text: state_text[STATUS.TOCERTIFIED], value: STATUS.TOCERTIFIED },
            { text: state_text[STATUS.PASS], value: STATUS.PASS },
            { text: state_text[STATUS.DISMISSAL], value: STATUS.DISMISSAL }
        ],
    },{
        title: '商务',
        dataIndex: 'business',
        key: 'business',
        filterMultiple:false,
    },{
        title: '用户来源',
        dataIndex: 'platform',
        key: 'platform',
        filterMultiple:false,
        filters: [
            { text: 'Face++', value: 1},
            { text: 'FaceID', value: 0}
        ]

    },{
        title: '操作',
        dataIndex: 'account_id',
        fixed: 'right',
        width: 200,
        key: 'account_id',
        render: (text, record) => {
            const _operation = operation_text[record.is_active];
            const operation = [
                <a onClick={this.changeUserTip.bind(this, record)}>{_operation}</a>,
                '  |  '
            ];
            if (record.status !== STATUS.UNCERTIFIED){
                operation.push(<Link to={'/admin/pages/client/' + text}>查看</Link>);
            }else{
                operation.push('未提交认证');
            }
            operation.push('  |  ',<a onClick={this.onRecharge.bind(this, text)}>赠送</a>);
            operation.push('  |  ',<a onClick={this.onNote.bind(this, record)}>商务</a>);


            return operation;
        }
    }];

    handleChange = (value)=> {
        this.setState({selectedBusiness: value});
    }

    onNote = (record)=>{
        const defautlBusiness = this.bizOptions.filter(e=> e.text === record.business);
        const defautlBizId = defautlBusiness.length > 0 ? defautlBusiness[0].value : undefined;
        Modal.confirm({
            title: '添加商务',
            content:  <Select
                ref={ref=>this.noteRef = ref}
                allowClear
                showSearch
                style={{ width: 200 }}
                optionFilterProp="children"
                defaultValue={defautlBizId}
                onChange={this.handleChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {this.bizOptions.map(option=> <Option value={option.value}>{option.text}</Option>)}
            </Select>,
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
                if(!this.noteRef){
                    return;
                }

                if (this.state.selectedBusiness === this.noteRef.props.defaultValue) {
                    return;
                }
                const business = this.state.selectedBusiness ? this.state.selectedBusiness : 0;
                updateBusiness(record.account_id, business).then(e=>{
                    Modal.success({
                        title:'修改成功'
                    });
                    this.table.refresh();
                });
            }
        });
    }

    handleCancel = ()=>{
        this.setState({showRecharge:false,rechargeMoney:'',rechargeError:''});
    }
    onRecharge = (id)=>{
        this.setState({showRecharge:true,rechargeId:id});
    }
    onRechargeOk = ()=>{
        this.setState({showRecharge:false,rechargeMoney:''});
        recharge(this.state.rechargeId,this.state.rechargeMoney).then(e=>{
            Modal.success({
                title: '充值成功',
                onOk:()=>{
                    this.table.refresh();
                }
            });
        });
    }
    onRechargeChange = (e)=>{
        const money = e.target.value;
        const _state = {
            rechargeMoney:money,
            rechargeError:''
        };
        if(!money || money === ''){

        }else if(money.match(moneyReg) == null){

            _state.rechargeError = '金额为正负整数';
        }else if(parseFloat(money)>9999999){
            _state.rechargeError = '最大金额不可超过9999999';
        }else if(parseFloat(money)<-9999999){
            _state.rechargeError = '最小金额不可小于-9999999';
        }
        this.setState(_state);
    }

    changeUserTip(record){
        if (record.is_active === 1){
            Modal.confirm({
                iconType:'exclamation-circle',
                title: '确定要停用此客户权限吗',
                onOk: () => {
                    this.changeUser(record);
                }
            });
            return;
        }
        this.changeUser(record);
    }

    changeUser(record){
        const action = ['enable','disable'];
        this.setState({ loading:true});
        changeActionByClientId(record.account_id, action[record.is_active]).then(res=>{
            this.table.refresh();
            this.setState({ loading: false });
        }).catch(()=>{
            this.setState({ loading: false });
        });
    }

    componentDidMount() {
        //获取商务列表
        getBusiness().then(res=>{

            //处理数据
            const _data = res.data.map(item=>{
                return { text: item.username, value:item.id };
            });
            this.columns.forEach(item=>{
                if(item.key === 'business'){
                    item.filters = _data;
                }
            });
            this.bizOptions = _data;
            this.table && this.table.change(1);
        });
    }

    onStart = (tableParams,filters) => {
        tableParams = tableParams || {};
        let _params = { ...tableParams };
        if(filters){
            if(filters.status){
                _params.status = filters.status;
            }
            if(filters.business){
                _params.business_list = filters.business.join(',');
            }
            if (filters.platform) {
                _params.platform = filters.platform.join(',');
            }

        }
        if(this.filterParams){
            _params = {..._params,...this.filterParams};
        }
        this.setState({exportUrl:exportClients(_params)});

        return getAllClient(_params).then(e => {
            this.setState({ list: e.data.this_page ? e.data.this_page : [], total: e.data.total });
        });
    }

    handleSubmit = (e) => {
        if(e){
            e.preventDefault();
        }
        this.filterParams = {};
        if(this.state.type === 'register_time'){
            const selectTime = this.rangePicker.getSelectTime();
            this.filterParams = {
                ...this.filterParams,
                register_start_date:selectTime[0].format('YYYY-MM-DD'),
                register_end_date:selectTime[1].format('YYYY-MM-DD'),
            };
        }else if(this.state.type === 'auth_time'){
            const selectTime = this.rangeAuthPicker.getSelectTime();
            this.filterParams = {
                ...this.filterParams,
                auth_start_date:selectTime[0].format('YYYY-MM-DD'),
                auth_end_date:selectTime[1].format('YYYY-MM-DD'),
            };
        }else{
            const formValues = this.props.form.getFieldsValue();
            Object.keys(formValues).forEach(item=>{
                if(formValues[item] === ''){
                    delete formValues[item];
                }
            });
            this.filterParams = formValues;
        }
        this.table.resetChange();
    }
    onTypeChange = (value)=>{
        this.setState({type:value});
    }

    render() {
        let _filter;
        const { getFieldDecorator } = this.props.form;
        if(this.state.type === 'register_time'){
            _filter = <FormItem
                label="注册时间"
            >
                <BaseRangePicker incluedToday ref={(ref)=>this.rangePicker=ref}/>
            </FormItem>;
        }else if(this.state.type === 'keyWord'){
            _filter = <FormItem
                label="搜索"
            >
                {getFieldDecorator('q',{
                    initialValue:''
                })(
                    <Input type="text"/>
                )}
            </FormItem>;
        }else if(this.state.type === 'balance'){
            _filter = <FormItem
                label="余额范围"
            >
                <InputGroup compact>
                    {getFieldDecorator('min_balance',{
                        initialValue:''
                    })(
                        <Input style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                    )}
                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                    {getFieldDecorator('max_balance',{
                        initialValue:''
                    })(
                        <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                    )}
                </InputGroup>
            </FormItem>;
        }else{
            _filter = <FormItem
                label="认证时间"
            >
                <BaseRangePicker incluedToday ref={(ref)=>this.rangeAuthPicker=ref}/>
            </FormItem>;
        }

        return (
            <BaseContent>
                <Spin
                    spinning={this.state.loading}
                    tip="提交中"
                >
                    <Fform
                        exportUrl={this.state.exportUrl}
                        layout="inline"
                        onSubmit={this.handleSubmit}
                    >
                        <FormItem
                            label="检索方法"
                        >
                            <Select
                                defaultValue={this.state.type}
                                style={{ width: 120 }}
                                onChange={this.onTypeChange}
                            >
                                <Option value='keyWord'>全局搜索</Option>
                                <Option value='register_time'>按注册时间</Option>
                                <Option value='auth_time'>按认证时间</Option>
                                <Option value='balance'>余额</Option>
                            </Select>
                        </FormItem>
                        {_filter}
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
                <Modal
                    title="赠送"
                    visible={this.state.showRecharge}
                    onCancel={this.handleCancel}
                    footer={<Button disabled={this.state.rechargeMoney==='' || this.state.rechargeError!==''} type='primary' onClick={this.onRechargeOk}>确定</Button>}
                >
                    <FormItem
                        {...formItemLayout}
                        label="赠送金额"
                        validateStatus={this.state.rechargeError===''?'success':'error'}
                        help={this.state.rechargeError}
                    >
                        <Input value={this.state.rechargeMoney} style={{width:'80%'}} onChange={this.onRechargeChange}/>&nbsp;元
                    </FormItem>
                </Modal>
            </BaseContent>
        );
    }

}
const WrappedApp = Form.create()(AdminClientManage);
export default WrappedApp;



// WEBPACK FOOTER //
// ./src/pages/Admin/AdminClientManage/Overview.js