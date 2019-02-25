import React from 'react';
import ChartReport from 'components/ChartReport';
import ajax from 'utils/request';
import {RANGE_TIME_UNINCLUED_TODAY} from 'utils/const';
import { Radio,Spin } from 'antd';
import moment from 'moment';
import BaseRangePicker from 'components/BaseRangePicker';
import style from './index.less';
import CardLayerInset from 'components/CardLayerInset';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ChartReportForStatistics extends React.Component {

    state = {
        chartInfo:null,
        chartData:null,
        radio:'7',
        loading:true
    }

    componentDidMount(){
        const start_date = RANGE_TIME_UNINCLUED_TODAY[0].format('YYYY-MM-DD');
        const end_date = RANGE_TIME_UNINCLUED_TODAY[1].format('YYYY-MM-DD');

        this.getData(start_date,end_date);
    }

    componentWillReceiveProps(nextProps){
        // console.log(this.props.info);
        if(this.props.info !== nextProps.info){
            //info变化，初始化控件
            this.setState({chartInfo:null,chartData:null,loading:true,radio:'7'},()=>{
                const start_date = RANGE_TIME_UNINCLUED_TODAY[0].format('YYYY-MM-DD');
                const end_date = RANGE_TIME_UNINCLUED_TODAY[1].format('YYYY-MM-DD');
                this.getData(start_date,end_date);
            });
        }
    }

    resize(){
        if(this.myChart){
            this.myChart.resize();
        }
    }

    getData(start_date,end_date){
        const {info} = this.props;
        const params = {start_date,end_date};
        if(info.kind){
            params.kind = info.kind;
        }
        ajax('GET', info.reportUrl,params).then(res=>{
            let _data = res.data;
            if(this.props.package){
                _data =  res.data[this.props.package];
            }
            let info = [];
            if(this.props.onGetData){
                info = this.props.onGetData(res.data);
            }
            this.setState({chartInfo:info,chartData:_data,loading:false});
        });
    }

    onChange = (e)=>{
        this.rangePicker.changeSelectTime([null,null]);
        const end_date = moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD');
        const start_date = moment().subtract(parseInt(e.target.value,10), 'days').startOf('day').format('YYYY-MM-DD');
        this.setState({radio:e.target.value});
        this.getData(start_date,end_date);
    }

    onDataChange = (e)=>{
        this.setState({radio:null});
        const end_date =e[1].format('YYYY-MM-DD');
        const start_date = e[0].startOf('day').format('YYYY-MM-DD');
        this.getData(start_date,end_date);
    }
    render(){
        const report = <ChartReport ref={ref=>this.myChart=ref} kind={this.props.kind} formatX={this.props.formatX} title={this.props.title} info={this.state.chartInfo} data={this.state.chartData}/>;
        const filter = <div className={this.props.inTab?null:style.topFilter}>
            <RadioGroup style={{marginRight:10}} onChange={this.onChange} value={this.state.radio}>
                <RadioButton value="7">近7天</RadioButton>
                <RadioButton value="30">近30天</RadioButton>
                <RadioButton value="90">近90天</RadioButton>
            </RadioGroup>
            <BaseRangePicker ref={(ref)=>this.rangePicker=ref} defaultValue={[null,null]} onChange={this.onDataChange}/>
        </div>;
        let content;
        if(this.props.inTab){
            content = <div>
                {filter}
                {report}
            </div>;
        }else{
            content = (
                <CardLayerInset
                    title={this.props.title+'走势'}
                    titleContent={filter}
                >
                    {report}
                </CardLayerInset>
            );
        }
        return <Spin spinning={this.state.loading}>
            {content}
        </Spin>;

    }
};

export default ChartReportForStatistics;



// WEBPACK FOOTER //
// ./src/components/ChartReportForStatistics/Overview.js