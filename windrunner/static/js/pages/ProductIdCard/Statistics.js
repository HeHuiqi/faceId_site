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
    'sdk':[
        {title:'调用量',totalText:'调用总量',averageText:'平均调用量',info:{reportUrl:'/user/ocr/'+SERVICE_ID.OCR_IDCARD+'/report',kind:'count'}},
        {title:'识别量',totalText:'识别总量',averageText:'平均识别量',info:{reportUrl:'/user/ocr/'+SERVICE_ID.OCR_IDCARD+'/report',kind:'pass_count'}},
        {title:'成功率',kind:'rate',rateText:'平均成功率',division:{numerator:'pass_count',denominator:'count'},info:{reportUrl:'/user/ocr/'+SERVICE_ID.OCR_IDCARD+'/report',kind:'success_rate'}},
        {title:'非正式证件检出量',totalText:'检出总量',averageText:'平均检出量',info:{reportUrl:'/user/ocr/'+SERVICE_ID.OCR_IDCARD+'/report',kind:'non_idcard_count'}}
    ],
    'lite':[
        {title:'调用量',totalText:'调用总量',averageText:'平均调用量',info:{reportUrl:'/user/ocr/'+SERVICE_ID.LITE_OCR+'/report',kind:'count'}},
        {title:'识别量',totalText:'识别总量',averageText:'平均识别量',info:{reportUrl:'/user/ocr/'+SERVICE_ID.LITE_OCR+'/report',kind:'pass_count'}},
        {title:'成功率',kind:'rate',rateText:'平均成功率',division:{numerator:'pass_count',denominator:'count'},info:{reportUrl:'/user/ocr/'+SERVICE_ID.LITE_OCR+'/report',kind:'success_rate'}},
        {title:'非正式证件检出量',totalText:'检出总量',averageText:'平均检出量',info:{reportUrl:'/user/ocr/'+SERVICE_ID.LITE_OCR+'/report',kind:'non_idcard_count'}}
    ]
};
const cardUrl = {
    'sdk':'/user/ocr/'+SERVICE_ID.OCR_IDCARD+'/overview',
    'lite':'/user/ocr/'+SERVICE_ID.LITE_OCR+'/overview'
};

class overview extends React.Component {

    state = {
        overview:{
            count:0
        },
        selectProduct:'sdk',  //SDK，lite
        loading:true
    }

    getTopData = ()=>{
        this.setState({overview:{count:0}});
        ajax('GET',cardUrl[this.state.selectProduct]).then(res=>{
            res = res.data;
            this.setState({
                loading:false,
                overview:res,
                time:moment.unix(res.time).local().format('YYYY-MM-DD HH:mm:ss')
            });
        });
    }

    componentDidMount(){
        this.getTopData();
    }

    onGroupChange = (e)=>{
        this.setState({selectProduct:e.target.value,loading:true},()=>{
            this.getTopData();
        });
    }

    render() {
        const {overview} = this.state;
        const success_rate = (overview.count===0)?'无':(overview.pass_count/overview.count*100).toFixed(2);
        const cards = [
            {title:'调用量',num:overview.count,unit:'次'},
            {title:'识别量',num:overview.pass_count,unit:'次'},
            {title:'成功率',num:success_rate,unit:'%'},
            {title:'非正式证件检出量',num:overview.non_idcard_count,unit:'次'}
        ];
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <div style={{display:'flex',marginTop:30,justifyContent:'center'}}>
                        <RadioGroup onChange={this.onGroupChange} defaultValue="sdk" size="large">
                            <RadioButton value="sdk">身份证识别SDK</RadioButton>
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
// ./src/pages/ProductIdCard/Statistics.js