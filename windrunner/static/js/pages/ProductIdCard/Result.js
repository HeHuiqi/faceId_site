import React from 'react';
import Table from 'components/Table';
import BaseContent from 'components/BaseContent';
import moment from 'moment';
import { Spin, Form, Select, Input } from 'antd';
import BaseRangePicker from 'components/BaseRangePicker';
import {getOcrResult,exportResult} from 'actions/review';
import Fform from 'components/FilterForm';
import { SERVICE_ID,SERVICE_ID_TEXT } from 'utils/const';
const Option = Select.Option;
const FormItem = Form.Item;


class Result extends React.Component {

    state = {
        loading:false,
        type:'time',
        resultF:'no-limit',
        list: [],
        info:null,
        token:'',
        Apikeys:null,
        resultApiKey:'no-limit',
        product:'no-limit',
        exportUrl:'',
        apikey:''
    }
    columns = [{
        title: 'API_KEY',
        dataIndex: 'api_key',
        key: 'api_key'
    },{
        title: 'biz_token',
        dataIndex: 'biz_token',
        key: 'biz_token',
        width:250
    }, {
        title: 'API Key',
        dataIndex: 'api_key',
        key: 'api_key'
    },{
        title: '产品',
        dataIndex: 'service_id',
        key: 'service_id',
        width:150,
        render:(text)=>{
            return SERVICE_ID_TEXT[text];
        }
    },{
        title: '识别结果',
        dataIndex: 'result',
        key: 'result'
    },{
        title: '头像面识别分类',
        dataIndex: 'frontside_result',
        key: 'frontside_result'
    }, {
        title: '国徽面识别分类',
        dataIndex: 'backside_result',
        key: 'backside_result'
    },{
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        render:(text)=>{
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    }];

    onTypeChange = (value)=>{
        this.setState({type:value,token:'',resultApiKey:'no-limit'});
    }

    onStart = (tableParams) => {

        tableParams = tableParams || {};
        let _params = { ...tableParams };
        if(this.filterParams){
            _params = {..._params,...this.filterParams};
        }
        if(this.state.resultF !== 'no-limit'){
            _params.result_code = this.state.resultF;
        }
        if(this.state.resultApiKey !== 'no-limit'){
            _params.apikey = this.state.resultApiKey;
        }

        return getOcrResult(_params).then(e => {
            const state = { list: e.data.this_page ? e.data.this_page : [], total: e.data.total };

            if(this.state.type === 'time'){
                state.exportUrl = exportResult('/ocr_xlsx_result',_params);
            }else{
                state.exportUrl = '';
            }
            this.setState(state);
        });
    }

    handleSubmit = (e) => {
        if(e){
            e.preventDefault();
        }
        if(this.state.type === 'token'){
            this.filterParams = {
                biz_token:this.state.token
            };
        }else{
            const selectTime = this.rangePicker.getSelectTime();
            this.filterParams = {
                start_ts:selectTime[0].unix(),
                end_ts:selectTime[1].unix(),
            };
            if(this.state.product !== 'no-limit'){
                this.filterParams.service_id = this.state.product;
            }
            if(this.state.apikey !== ''){
                this.filterParams.api_key = this.state.apikey;
            }
        }

        this.table.change(1);
    }

    onTokenChange = (e)=>{
        this.setState({token:e.target.value});
    }

    onResultSelect = (value)=>{
        this.setState({resultF:value});
    }

    onApiKeyComplete = (Apikeys)=>{
        this.setState({Apikeys});
    }

    onApiKeyChange = (value)=>{
        this.setState({resultApiKey:value});
    }
    onProductChange = (value)=>{
        this.setState({product:value});
    }

    checkSearchButton = ()=>{
        if(this.state.type === 'token' && this.state.token === ''){
            return true;
        }
    }
    onApikeyChange = (e)=>{
        this.setState({apikey:e.target.value});
    }


    render() {
        let typeInput;
        if(this.state.type === 'token'){
            typeInput =<FormItem
                label="biz_token"
            >
                <Input
                    style={{width:300}}
                    value={this.state.token}
                    placeholder="请输入要查询的biz_token"
                    onChange={this.onTokenChange}
                />
            </FormItem>;
        }else if(this.state.type === 'time'){
            typeInput =[<FormItem
                label="时间范围"
            >
                <BaseRangePicker ref={(ref)=>this.rangePicker=ref}/>
            </FormItem>,<FormItem
                label="识别结果"
            >
                <Select value={this.state.resultF} style={{ width: 150 }} onChange={this.onResultSelect}>
                    <Option value="no-limit">不限</Option>
                    <Option value="1000">成功</Option>
                    <Option value="2000">失败</Option>
                    <Option value="3000">未识别</Option>
                </Select>

            </FormItem>,
                <FormItem
                    label="产品"
                >
                    <Select value={this.state.product} style={{ width: 150 }} onChange={this.onProductChange}>
                        <Option value="no-limit">全部</Option>
                        <Option value={SERVICE_ID.OCR_IDCARD+''}>身份证识别SDK</Option>
                        <Option value={SERVICE_ID.LITE_OCR+''}>H5/小程序</Option>
                    </Select>

                </FormItem>,
                <FormItem
                    label="API key"
                >
                    <Input
                        style={{width:300}}
                        value={this.state.apikey}
                        placeholder="请输入要查询的API key"
                        onChange={this.onApikeyChange}
                    />
                </FormItem>];
        }


        return (
            <BaseContent>
                <Spin
                    spinning={this.state.loading}
                    tip="提交中"
                >
                    <Fform exportUrl={this.state.exportUrl} layout="inline" onSubmit={this.handleSubmit} disabledSubmit={this.checkSearchButton()}>
                        <FormItem
                            label="查询方式"
                        >
                            <Select value={this.state.type} style={{ width: 120 }} onChange={this.onTypeChange}>
                                <Option value="time">按时间范围</Option>
                                <Option value="token">按biz_token</Option>
                            </Select>
                        </FormItem>
                        {typeInput}
                    </Fform>
                    <Table
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


export default Result;



// WEBPACK FOOTER //
// ./src/pages/ProductIdCard/Result.js