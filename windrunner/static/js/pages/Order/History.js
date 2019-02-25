import React from 'react';
import { Form,Modal } from 'antd';
import Table from 'components/Table';
import { getTrades,continuePay,closeRecharge } from 'actions/finance';
import moment from 'moment';
import BaseRangePicker from 'components/BaseRangePicker';
import {PAY_TYPE_INFO} from 'utils/const';
import {PAY_TYPE} from 'utils/const';
import OffLineInfo from 'components/OffLineInfo';
import { connect } from 'react-redux';
import {payMethod} from 'utils/tool';
import Fform from 'components/FilterForm';

const FormItem = Form.Item;
const confirm = Modal.confirm;



class History extends React.Component {
    state = {
        offLineInfo:{},
        list:[],
        total:0
    }
    columns = [{
        title: '日期',
        dataIndex: 'created_at',
        key: 'created_at',
        render:(text)=>{
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    }, {
        title: '订单编号',
        dataIndex: 'trade_no',
        key: 'trade_no',
    }, {
        title: '支付方式',
        dataIndex: 'pay_type',
        key: 'pay_type',
        render:(text)=>{
            return PAY_TYPE_INFO[text] && PAY_TYPE_INFO[text].name;
        }
    }, {
        title: '实付额（元）',
        dataIndex: 'amount',
        key: 'amount'
    }, {
        title: '到账金额（元）',
        dataIndex: 'total_amount',
        key: 'total_amount'
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render:(text,record)=>{
            let _res;
            switch (text) {
                case 1:
                    if(record.pay_type === PAY_TYPE.OFFLINE){
                        _res = <span style={{color:'#FFB100'}}>等待确认</span>;
                    }else{
                        _res = <span style={{color:'#FFB100'}}>待支付</span>;
                    }
                    break;
                case 2:
                    _res = <span style={{color:'#00B11F'}}>支付成功</span>;
                    break;
                case 4:
                    _res = <span style={{color:'#FB3F3F'}}>交易关闭</span>;
                    break;
                default:
                    break;
            }
            return _res;
        }
    },{
        title: '操作',
        dataIndex: 'status',
        key: 'status',
        render:(text,record)=>{
            let _res;
            switch (text) {
                case 1:
                    _res = [<a onClick={this.onContinuePay.bind(this,record.trade_no)}>继续支付</a>];
                    if(record.pay_type === PAY_TYPE.OFFLINE){
                        _res = [<a onClick={this.showOffLine.bind(this,record)}>查看详情</a>];
                    }
                    _res.push(' | ');
                    _res.push(<a onClick={this.onClose.bind(this,record)}>关闭交易</a>);
                    break;
                default:
                    break;
            }
            return _res;
        }
    }]

    componentDidMount() {
        if(this.props.autoSearch){
            this.handleSubmit();
        }

    }

    onClose = (info)=>{
        Modal.confirm({
            title:'确认关闭这笔交易吗？',
            onOk:()=>{
                closeRecharge(info.trade_no).then(res=>{
                    this.refresh();
                });
            }
        });
    }

    showOffLine = (info)=>{
        this.setState({isShowOffLine:true,offLineInfo:info});
    }
    onCancelOffLine = ()=>{
        this.setState({isShowOffLine:false});
    }


    onContinuePay = (trade_no)=>{
        continuePay(trade_no).then(res=>{
            confirm({
                title:'在线支付',
                content:'请在新页面完成支付',
                okText:'支付成功',
                cancelText:'支付遇到问题',
                onOk:()=>{
                    this.refresh();
                },
                onCancel:this.props.onFailPay.bind(this,trade_no)
            });
            payMethod(res.data.pay_type,res.data.third_pay_params);
        });
    }

    onStart = (tableParams) => {
        tableParams = tableParams || {};
        let _params = { ...tableParams };
        if(this.filterParams){
            _params = {..._params,...this.filterParams};
        }
        return getTrades(_params).then(e => {
            this.setState({ list: e.data.this_page ? e.data.this_page : [], total: e.data.total, loading: false });
        });
    }

    handleSubmit = (e) => {
        e&&e.preventDefault();
        const selectTime = this.rangePicker.getSelectTime();
        this.filterParams = {
            start_date:selectTime[0].format('YYYY-MM-DD'),
            end_date:selectTime[1].format('YYYY-MM-DD'),
        };
        this.table.change(1);
    }
    refresh(){
        this.table.refresh();
    }

    render() {
        return (
            <div>
                <Fform layout="inline" onSubmit={this.handleSubmit} disabledSubmit={!this.props.autoSearch}>
                    <FormItem
                        label="时间"
                    >
                        <BaseRangePicker
                            ref={(ref)=>this.rangePicker=ref}
                            incluedToday={true}
                        />
                    </FormItem>
                </Fform>
                <Table
                    style={{ marginTop: 20 }}
                    dataSource={this.state.list}
                    columns={this.columns}
                    onSubmit={this.onStart}
                    total={this.state.total}
                    ref={ref => this.table = ref}
                />
                <OffLineInfo
                    visible={this.state.isShowOffLine}
                    onCancel={this.onCancelOffLine}
                    onProblem = {this.props.onFailPay.bind(this,this.state.offLineInfo.trade_no)}
                    info = {{amount:this.state.offLineInfo.amount,username:this.props.account.username,tradeNo:this.state.offLineInfo.trade_no}}
                />
            </div>
        );
    }

}

function select(state) {
    return {
        account: state.account.info
    };
}
export default connect(select)(History);



// WEBPACK FOOTER //
// ./src/pages/Order/History.js