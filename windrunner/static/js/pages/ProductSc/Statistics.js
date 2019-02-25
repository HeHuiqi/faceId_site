import React from 'react';
import CardBox from 'components/CardBox';
import ChartReportNormal from 'components/ChartReportNormal';
import ajax from 'utils/request';
import moment from 'moment';
import { Radio,Spin } from 'antd';
import { SERVICE_ID } from 'utils/const';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const product = {
    'action':[
        {title:'调用量',totalText:'调用总量',averageText:'平均调用量',info:{reportUrl:'/user/face_verify/'+SERVICE_ID.FACE_VERIFY+'/report',kind:'call_count'}},
        {title:'通过率',kind:'rate',rateText:'平均通过率',division:{numerator:'pass_count',denominator:'count'},info:{reportUrl:'/user/face_verify/'+SERVICE_ID.FACE_VERIFY+'/report',kind:'pass_rate'}},
        {title:'攻击数',totalText:'攻击总数',averageText:'平均攻击数',info:{reportUrl:'/user/face_verify/'+SERVICE_ID.FACE_VERIFY+'/report',kind:'attack_count'}}
    ],
    'lite':[
        {title:'调用量',totalText:'调用总量',averageText:'平均调用量',info:{reportUrl:'/user/face_verify/'+SERVICE_ID.LITE_VERIFY+'/report',kind:'call_count'}},
        {title:'通过率',kind:'rate',rateText:'平均通过率',division:{numerator:'pass_count',denominator:'count'},info:{reportUrl:'/user/face_verify/'+SERVICE_ID.LITE_VERIFY+'/report',kind:'pass_rate'}},
        {title:'攻击数',totalText:'攻击总数',averageText:'平均攻击数',info:{reportUrl:'/user/face_verify/'+SERVICE_ID.LITE_VERIFY+'/report',kind:'attack_count'}}
    ]
};
const cardUrl = {
    'action':'/user/face_verify/'+SERVICE_ID.FACE_VERIFY+'/overview',
    'lite':'/user/face_verify/'+SERVICE_ID.LITE_VERIFY+'/overview'
};


class overview extends React.Component {

    state = {
        overview:{},
        selectProduct:'action',  //action，lite
        loading:true
    }

    componentDidMount(){
        this.getTopData();
    }
    onGroupChange = (e)=>{
        this.setState({selectProduct:e.target.value,loading:true},()=>{
            this.getTopData();
        });
    }

    getTopData = ()=>{
        this.setState({overview:{}});
        ajax('GET',cardUrl[this.state.selectProduct]).then(res=>{
            res = res.data;
            this.setState({
                loading:false,
                overview:res,
                time:moment.unix(res.time).local().format('YYYY-MM-DD HH:mm:ss')
            });
        });
    }

    render() {
        const {overview} = this.state;
        let pass_rate;
        if(typeof overview.count !== 'undefined'){
            pass_rate = (overview.count===0)?'无':(overview.pass_count/overview.count*100).toFixed(2);
        }
        const cards = [
            {title:'调用量',num:overview.count,unit:'次'},
            {title:'通过率',num:pass_rate,unit:'%'},
            {title:'拦截攻击',num:overview.attack_count,unit:'次'},
        ];

        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <div style={{display:'flex',marginTop:30,justifyContent:'center'}}>
                        <RadioGroup onChange={this.onGroupChange} defaultValue="action" size="large">
                            <RadioButton value="action">动作活体SDK</RadioButton>
                            <RadioButton value="lite">H5/微信小程序</RadioButton>
                        </RadioGroup>
                    </div>
                </Spin>
                <h1 className='public-face-title'>今日概览<span className='time'>截止时间 {this.state.time}</span></h1>
                <CardBox cards={cards}/>
                <h1 className='public-face-title'>数据走势</h1>
                {product[this.state.selectProduct].map(item=>{
                    return <ChartReportNormal {...item} />;
                })}
            </div>
        );
    }

}

export default overview;



// WEBPACK FOOTER //
// ./src/pages/ProductSc/Statistics.js