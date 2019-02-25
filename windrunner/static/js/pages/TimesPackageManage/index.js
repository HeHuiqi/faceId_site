import React from 'react';
import { Form,Input,Button } from 'antd';
import Table from 'components/Table';
import { getResourceBundle } from 'actions/finance';
import moment from 'moment';
import BaseRangePicker from 'components/BaseRangePicker';
import { Link } from 'react-router-dom';
import Fform from 'components/FilterForm';
import BaseContent from 'components/BaseContent';

const FormItem = Form.Item;



class TimesPackageManage extends React.Component {
    state = {
        offLineInfo:{},
        list:[],
        total:0
    }
    searchTradeNo = ''
    columns = [{
        title: '订购时间',
        dataIndex: 'paid_at',
        key: 'paid_at',
        fixed: 'left',
        width: 200,
        render:(text)=>{
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    }, {
        title: 'ID',
        fixed: 'left',
        width: 200,
        dataIndex: 'trade_no',
        key: 'trade_no',
    }, {
        title: '产品',
        dataIndex: 'service',
        key: 'service',
        render:(text)=>{
            const serviceMap = {
                200:'人脸核身',
                201:'人脸比对',
                100:'身份证OCR'
            };
            return serviceMap[text];
        }
    }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render:(text)=>{
            const typeMap = {
                0:'SDK',
                1:'Lite',
                2:'SDK+Lite'
            };
            return typeMap[text];
        }
    }, {
        title: '使用情况(已用/总量)',
        dataIndex: 'count',
        key: 'count',
        render:(text,record)=>{
            return record.used_count+'/'+text ;
        }
    }, {
        title: '有效期',
        dataIndex: 'expired_at',
        key: 'expired_at',
        render:(text)=>{
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    },{
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render:(text)=>{
            const typeMap = {
                0:{text:'正常',color:'#00B11F'},
                1:{text:'预警',color:'#FFB100'},
                2:{text:'过期',color:'#585858'}
            };
            const status = typeMap[text] || {};
            return <span style={{color:status.color}}>{status.text}</span>;
        }
    },{
        title: '费用',
        dataIndex: 'price',
        key: 'price'
    },{
        title: '操作',
        dataIndex: 'trade_no',
        key: 'contral',
        fixed: 'right',
        width: 200,
        render:(text)=>{
            return <Link to={'/pages/resource_package_consumption/'+text} >用量详情</Link>;
        }
    }]

    componentDidMount() {
        this.handleSubmit();
    }


    onStart = (tableParams) => {
        tableParams = tableParams || {};
        let _params = { ...tableParams };
        if(this.filterParams){
            _params = {..._params,...this.filterParams};
        }
        return getResourceBundle(_params).then(e => {
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
        if(this.searchTradeNo !== ''){
            this.filterParams.trade_no = this.searchTradeNo;
        }
        this.table.change(1);
    }
    refresh(){
        this.table.refresh();
    }

    onTradeNoChange = (e)=>{
        this.searchTradeNo = e.target.value;
    }

    render() {
        return (
            <BaseContent>
                <Fform layout="inline" onSubmit={this.handleSubmit}>
                    <FormItem
                        label="时间"
                    >
                        <BaseRangePicker
                            ref={(ref)=>this.rangePicker=ref}
                            incluedToday={true}
                        />
                    </FormItem>
                    <FormItem
                        label="资源包ID"
                    >
                        <Input onChange={this.onTradeNoChange} type="text" placeholder="请输入资源包ID"/>
                    </FormItem>
                </Fform>
                <Link style={{position:'absolute',right:20,top:24,lineHeight:'30px',display:'block',height:30,border:'1px #00A5E3 solid',borderRadius:3,width:100,textAlign:'center'}} to='/pages/buy_package'>购买资源包</Link>
                <Table
                    scroll={{ x: '150%'}}
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

export default TimesPackageManage;



// WEBPACK FOOTER //
// ./src/pages/TimesPackageManage/index.js