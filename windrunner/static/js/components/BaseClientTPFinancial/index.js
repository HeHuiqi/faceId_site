import React from 'react';
import Table from 'components/Table';
import { Spin,Form,Select } from 'antd';
import Fform from 'components/FilterForm';
import BaseRangePicker from 'components/BaseRangePicker';
import {getServiceIdList} from 'actions/account';
import {SERVICE_MAP,SERVICE_TYPE_MAP} from 'utils/const';

const FormItem = Form.Item;
const Option = Select.Option;
const serviceFilters = Object.keys(SERVICE_MAP).map(key=>{
    return { text: SERVICE_MAP[key], value:key };
});
const serviceTypeFilters = Object.keys(SERVICE_TYPE_MAP).map(key=>{
    return { text: SERVICE_TYPE_MAP[key], value:key };
});

const userColumns = [{
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    sorter:true
}, {
    title: '产品',
    dataIndex: 'service',
    key: 'service',
    filters:serviceFilters,
    render:(text)=>{
        return SERVICE_MAP[text];
    }
},{
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    filters:serviceTypeFilters,
    render:(text)=>{
        return SERVICE_TYPE_MAP[text];
    }
},{
    title: '规格',
    dataIndex: 'count',
    key: 'count'
},{
    title: '消费金额（元）',
    dataIndex: 'price',
    key: 'price',
    sorter: true
}];
class BaseClientTPFinancial extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            loading:true,
            unit:'day',
            list: [],
            outUrl:''
        };
        this.columns = userColumns;
    }


    componentDidMount() {
        //获取产品列表
        getServiceIdList().then(res=>{
            this.setState({loading:false});
            //处理数据
            const _data = res.data.map(item=>{
                return { text: item.name, value:item.service_id };
            });
            this.columns.forEach(item=>{
                if(item.key === 'service_name'){
                    item.filters = _data;
                }
            });
            this.handleSubmit();
        });

    }

    onStart = (tableParams,filters) => {
        tableParams = tableParams || {};
        let _params = { ...tableParams };
        if(this.filterParams){
            _params = {..._params,...this.filterParams};
        }
        if(filters){
            _params ={..._params,...filters};
        }
        this.setState({outUrl:this.props.outUrl(_params)});
        return this.props.getData(_params).then(e => {
            this.setState({ list: e.data.this_page ? e.data.this_page : [], total: e.data.total });
        });
    }

    handleSubmit = (e) => {
        if(e){
            e.preventDefault();
        }
        const selectTime = this.rangePicker.getSelectTime();
        this.filterParams = {
            start_date:selectTime[0].format('YYYY-MM-DD'),
            end_date:selectTime[1].format('YYYY-MM-DD'),
            statistics_unit:this.state.unit === 'day'?0:1
        };
        this.table.change({current:1,sorter:{order:'descend',field:'date'}});
    }
    onUnitChange = (value)=>{
        this.setState({unit:value});
    }

    render() {
        return (
            <div style={{padding:'20px'}}>
                <Spin
                    spinning={this.state.loading}
                    tip="提交中"
                >
                    <div style={{minHeight:'500px'}}>
                        <Fform disabledSubmit={this.state.loading} exportUrl={this.state.outUrl} layout="inline" onSubmit={this.handleSubmit}>
                            <FormItem
                                label="时间"
                            >
                                <BaseRangePicker
                                    incluedToday
                                    defaultValue={this.props.rangeTime}
                                    ref={(ref)=>this.rangePicker=ref}/>
                            </FormItem>
                            <FormItem
                                label="统计单位"
                            >
                                <Select value={this.state.unit} style={{ width: 120 }} onChange={this.onUnitChange}>
                                    <Option value="day">按日统计</Option>
                                    <Option value="month">按月统计</Option>
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
                    </div>
                </Spin>
            </div>
        );
    }

}


export default BaseClientTPFinancial;



// WEBPACK FOOTER //
// ./src/components/BaseClientTPFinancial/Overview.js