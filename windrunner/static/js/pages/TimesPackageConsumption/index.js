import React from 'react';
import { Form,Input,Select,Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import Table from 'components/Table';
import { getBundleTradeNoList,getBundleStatistics } from 'actions/finance';
import moment from 'moment';
import BaseRangePicker from 'components/BaseRangePicker';
import Fform from 'components/FilterForm';
import BaseContent from 'components/BaseContent';

const FormItem = Form.Item;
const Option = Select.Option;


class TimesPackageManage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bundleList:[],
            list:[],
            canSearch:false,
            loading:true,
            total:0,
            tradeNo:props.match.params.id,
            bizToken:''
        };
    }
    columns = [{
        title: '请求日期',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render:(text)=>{
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    }, {
        title: 'Biz_token',
        dataIndex: 'biz_token',
        key: 'biz_token',
    }, {
        title: '资源包ID',
        dataIndex: 'trade_no',
        key: 'trade_no'
    }, {
        title: '消耗（次）',
        dataIndex: 'count',
        key: 'count'
    }]

    componentDidMount() {
        getBundleTradeNoList().then(res=>{
            this.setState({bundleList:res.data,canSearch:true},()=>{

                this.handleSubmit();
            });
        });
    }


    onStart = (tableParams) => {
        tableParams = tableParams || {};
        let _params = { ...tableParams };
        if(this.filterParams){
            _params = {..._params,...this.filterParams};
        }
        return getBundleStatistics(_params).then(e => {
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
        if(this.state.tradeNo !== 'no-limit'){
            this.filterParams.trade_no = this.state.tradeNo;
        }
        if(this.state.bizToken !== ''){
            this.filterParams.biz_token = this.state.bizToken;
        }
        this.table.change(1);
    }

    onTradeNoChange = (value)=>{
        this.setState({tradeNo:value});
    }
    onBizTokenChange = (e)=>{
        this.setState({bizToken:e.target.value});
    }

    checkSearch = ()=>{
        if(this.state.tradeNo === 'no-limit' && this.state.bizToken === ''){
            return false;
        }
        return true;
    }

    render() {
        return (
            <BaseContent>
                <Fform layout="inline" onSubmit={this.handleSubmit} disabledSubmit={!this.checkSearch()}>
                    <FormItem
                        label="时间"
                    >
                        <BaseRangePicker
                            ref={(ref)=>this.rangePicker=ref}
                            incluedToday={true}
                        />
                    </FormItem>
                    <FormItem
                        label="Biz_token"
                    >
                        <Input onChange={this.onBizTokenChange} type="text" placeholder="请输入Biz_token"/>
                    </FormItem>
                    <FormItem
                        label="资源包ID"
                    >
                        <Select value={this.state.tradeNo} style={{ width: 250 }} onChange={this.onTradeNoChange}>
                            <Option value='no-limit'>全部</Option>
                            {this.state.bundleList.map(item=>{
                                return <Option value={item}>{item}</Option>;
                            })}
                        </Select>
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
            </BaseContent>
        );
    }

}

export default withRouter(TimesPackageManage);



// WEBPACK FOOTER //
// ./src/pages/TimesPackageConsumption/index.js