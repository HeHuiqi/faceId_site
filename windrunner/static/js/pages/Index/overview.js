import React from 'react';
import style from './overview.less';
import {getUserOverview} from 'actions/account';
import CardLayer from 'components/CardLayer';
import { Button,Tabs } from 'antd';
import moment from 'moment';
import {getUrl} from 'utils/tool.js';
import CardBox from 'components/CardBox';
import ChartReportForStatistics from 'components/ChartReportForStatistics';
import { withRouter } from 'react-router-dom';

const TabPane = Tabs.TabPane;

const treatRate = function(count,pass_count) {
    const rate = (count===0)?'-':pass_count/count;
    let pass_rate,pass_unit;
    if(rate === '-'){
        pass_rate = rate;
        pass_unit = ' ';
    }else{
        pass_unit = '%';
        pass_rate = (rate*100).toFixed(2);
    }
    return {value:pass_rate,unit:pass_unit};
};
const product = {
    'face_verify':{
        onGetData:(data)=>{
            let count = 0;
            data.detail.forEach(item=>{
                count = count + item.value;
            });
            const res = treatRate(data.count,data.pass_count);
            return [
                {name:'调用总量',value:count},
                {name:'通过率',...res},
                {name:'攻击拦截',value:data.attack_count}
            ];
        },
        url:'/pages/sc_overview',
        reportUrl:'/user/overview/face_verify/report',
        reportTitle:'调用量'
    },
    'face_compare':{
        reportUrl:'/user/overview/face_compare/report',
        url:'/pages/uc_overview',
        onGetData:(data)=>{
            let count = 0;
            data.detail.forEach(item=>{
                count = count + item.value;
            });
            const res = treatRate(data.count,data.pass_count);
            return [
                {name:'调用总量',value:count},
                {name:'通过率',...res},
                {name:'攻击拦截',value:data.attack_count}
            ];
        },
        reportTitle:'调用量'
    },
    'ocr':{
        reportUrl:'/user/overview/ocr/report',
        url:'/pages/idcard_overview',
        onGetData:(data)=>{
            let count = 0;
            data.detail.forEach(item=>{
                count = count + item.value;
            });
            const res = treatRate(data.count,data.pass_count);
            return [
                {name:'调用总量',value:count},
                {name:'识别量',value:data.pass_count},
                {name:'成功率',...res}
            ];
        },
        reportTitle:'调用量'
    }
};
const sortProduct = ['face_verify','face_compare','ocr'];

class overview extends React.Component {

    state = {
        overview:{},
        chartInfo:{},
        chartData:{}
    }
    report = {}

    componentDidMount(){
        getUserOverview().then(res=>{
            res = res.data;
            res.time = moment.unix(res.time).local().format('YYYY-MM-DD HH:mm:ss');
            this.setState({
                overview:res,
                time:res.time
            });
        });
    }
    onTabsChange = (value)=>{
        if(this.report[value]){
            setTimeout(() => {
                this.report[value].resize();
            }, 20);
        }
    }

    onRecharge=()=>{
        window.open(getUrl('/pages/recharge'));
    }

    jump = (url)=>{
        this.props.history.push(url);
    }

    render() {
        const {overview} = this.state;
        const cards = [
            {title:'账户余额',color:'#00B2E3',num:overview.balance,unit:'元',children:<a onClick={this.onRecharge} className={style.recharge}>充值</a>},
            {title:'今日消耗金额',num:overview.total_consume,unit:'元'},
            {title:'近7日消耗',num:overview.seven_days_total_consume,unit:'元'}
        ];
        const access_status = this.props.account.access_status;
        const tabs = {};
        sortProduct.forEach(item=>{
            if(access_status[item]){
                tabs[item] = <ChartReportForStatistics ref={ref=>this.report[item]=ref} inTab title={product[item].reportTitle} package='detail' onGetData={product[item].onGetData} info={product[item]}/>;
            }else{
                tabs[item] = <div className={style['empty']}>
                    <img width={61} src={require('./empty.png')} alt=""/>
                    <p>您还没有接入该产品</p>
                    <Button onClick={this.jump.bind(this,product[item].url)} type="primary">查看产品详情</Button>
                </div>;
            }
        });



        return (
            <div className={style.overview}>
                <h1 className='public-face-title'>账户概览<span>及时跟踪当日数据情况，第一时间掌握产品动向</span><span className='time'>截止时间 {this.state.time}</span></h1>
                <CardBox cards={cards}/>
                <h1 className='public-face-title'>调用统计</h1>
                <CardLayer cardStyle={{padding:0}}>
                    <Tabs animated={false} defaultActiveKey="face_verify" onChange={this.onTabsChange}>
                        <TabPane tab="人脸核身" key="face_verify">
                            {tabs['face_verify']}
                        </TabPane>
                        <TabPane tab="人脸比对" key="face_compare">
                            {tabs['face_compare']}
                        </TabPane>
                        <TabPane tab="身份证识别" key="ocr">
                            {tabs['ocr']}
                        </TabPane>
                    </Tabs>
                </CardLayer>
            </div>
        );
    }

}

export default withRouter(overview);



// WEBPACK FOOTER //
// ./src/pages/Index/overview.js