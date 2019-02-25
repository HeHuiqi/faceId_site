import React from 'react';
import Table from 'components/Table';
import BaseContent from 'components/BaseContent';
import moment from 'moment';
import { Modal,Spin, Form, Select, Input } from 'antd';
import BaseRangePicker from 'components/BaseRangePicker';
import {getFaceCompareResult,exportResult} from 'actions/review';
import ModalTitle from 'components/ModalTitle';
import style from './Result.less';
import Fform from 'components/FilterForm';
import {result} from './const';
import ResultInfo from 'components/ResultInfo';
import { SERVICE_ID,SERVICE_ID_TEXT } from 'utils/const';
const Option = Select.Option;
const FormItem = Form.Item;
//处理result为antd的filter结构
const resultFailFilter = Object.keys(result).map((item,index)=>{
    return {
        label:result[item],
        value:item
    };
});

class Result extends React.Component {

    state = {
        loading:false,
        type:'time',
        resultF:'no-limit',
        product:'no-limit',
        showInfo:false,
        list: [],
        info:null,
        token:'',
        exportUrl:'',
        apikey:''
    }
    columns = [{
        title: '序号',
        dataIndex: 'id',
        key: 'index',
        render:(text,info,index)=>{
            return index;
        }
    },{
        title: 'API_KEY',
        dataIndex: 'api_key',
        key: 'api_key'
    },{
        title: 'biz_token',
        dataIndex: 'id',
        key: 'biz_token',
        render:(text,info,index)=>{
            return info.detail.biz_token;
        }
    },{
        title: '产品',
        dataIndex: 'service_id',
        key: 'service_id',
        render:(text,info,index)=>{
            return SERVICE_ID_TEXT[text];
        }
    }, {
        title: '比对结果',
        dataIndex: 'server_result',
        key: 'server_result'
    }, {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render:(text)=>{
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    }, {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        render:(text,info,index)=>{
            return <a onClick={this.onShowInfo.bind(this,info)}>查看详情</a>;
        }
    }];

    onShowInfo = (info) =>{
        this.setState({showInfo:true,info});
    }

    onTypeChange = (value)=>{
        this.setState({type:value,token:''});
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
        return getFaceCompareResult(_params).then(e => {
            const state = { list: e.data.this_page ? e.data.this_page : [], total: e.data.total };
            if(this.state.type === 'time'){
                state.exportUrl = exportResult('/face_compare_xlsx_result',_params);
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
    handleCancel = ()=>{
        this.setState({showInfo:false});
    }
    onTokenChange = (e)=>{
        this.setState({token:e.target.value});
    }

    onResultSelect = (value)=>{
        this.setState({resultF:value});
    }
    onProductChange = (value)=>{
        this.setState({product:value});
    }
    onApikeyChange = (e)=>{
        this.setState({apikey:e.target.value});
    }

    render() {
        let typeInput;
        const info = this.state.info;
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
            </FormItem>,
                <FormItem
                    label="比对结果"
                >
                    <Select value={this.state.resultF} style={{ width: 150 }} onChange={this.onResultSelect}>
                        <Option value="no-limit">不限</Option>
                        {resultFailFilter.map(item=>{
                            return <Option value={item.value}>{item.label}</Option>;
                        })}
                    </Select>

                </FormItem>,
                <FormItem
                    label="产品"
                >
                    <Select value={this.state.product} style={{ width: 150 }} onChange={this.onProductChange}>
                        <Option value="no-limit">全部</Option>
                        <Option value={SERVICE_ID.FACE_COMPARE+''}>动作活体SDK</Option>
                        <Option value={SERVICE_ID.LITE_COMPARE+''}>H5/小程序</Option>
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
        let otherInfo,modalContent,actionTable = <div className={style.action} style={{marginLeft:30}}>无</div>;
        if(info){
            const action_sequence = info.detail.sdk_result.action_sequence || {};
            const action_sequence_length = Object.keys(action_sequence).length;
            if(action_sequence_length !== 0){
                const queue = [];
                for(let i =0;i<action_sequence_length;i++){
                    queue.push(i);
                }
                actionTable = <table className={style.action}>
                    <tr>
                        {queue.map(item=>{
                            return <th>第{item+1}个动作</th>;
                        })}
                    </tr>
                    {['action','state'].map(key=>{
                        return (
                            <tr>
                                {queue.map(item=>{
                                    return <td>{key === 'action'?'名称：':'结果：'}{action_sequence[item][key]}</td>;
                                })}
                            </tr>
                        );
                    })}
                </table>;
            }
            modalContent = [
                {name:'Biz_token',value:info.detail.biz_token},
                {name:'API Key',value:info.detail.api_key},
                {name:'活体结果',value:info.detail.sdk_result.result === 1?'通过':'不通过'},
                {name:'比对结果',value:info.server_result},
                {name:'平台版本',value:info.detail.sdk_result.sdk_version || '无'},
                {name:'时间',value:moment.unix(info.timestamp).local().format('YYYY/MM/DD HH:mm:ss')}
            ];
            otherInfo = [
                <ModalTitle>动作序列</ModalTitle>,
                actionTable
            ];
        }


        return (
            <BaseContent>
                <Spin
                    spinning={this.state.loading}
                    tip="提交中"
                >
                    <Fform exportUrl={this.state.exportUrl} layout="inline" onSubmit={this.handleSubmit} disabledSubmit={this.state.type === 'token' && this.state.token === ''}>
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
                <Modal
                    title="活体详情"
                    visible={this.state.showInfo}
                    footer={null}
                    width={600}
                    onCancel={this.handleCancel}
                >
                    <ResultInfo info={modalContent} other={otherInfo}/>
                </Modal>
            </BaseContent>
        );
    }

}


export default Result;




// WEBPACK FOOTER //
// ./src/pages/ProductUc/Result.js