import React from 'react';
import ChartReportForStatistics from 'components/ChartReportForStatistics';

class ChartReportNormal extends React.Component {

    shouldComponentUpdate(nextProps,nextState){
        //本页面相关配置页面
        if(nextProps.info.reportUrl === this.props.info.reportUrl && nextProps.info.kind=== this.props.info.kind){
            return false;
        }
        return true;
    }

    //调用量类计算方式
    onCallCount(data){
        let count=0;
        data.forEach(item=>{
            count = count + item.value;
        });
        return [
            {name:this.props.totalText,value:count},
            {name:this.props.averageText,value:Math.round(count/data.length)}
        ];
    }
    //成功率类计算方式

    onPassRate(data){
        let passRate = 0,times = 0;
        data.forEach(item=>{
            if(item.count !== 0){
                times++;
                passRate = passRate + item.pass_count/item.count;
            }
        });
        const oneData = {name:this.props.rateText};
        if(times === 0){
            oneData.value = '-';
            oneData.unit = ' ';
        }else{
            oneData.value = (passRate/times*100).toFixed(2);
            oneData.unit = '%';
        }
        return [oneData];
    }

    onGetData = (data)=>{
        if(this.props.kind === 'rate'){
            return this.onPassRate(data);
        }else{
            return this.onCallCount(data);
        }
    }


    formatX = (item)=>{
        let _res = item.value;
        if(this.props.kind === 'rate'){
            if(item.count === 0){
                _res = 0;
            }else{
                _res = item.pass_count/item.count;
            }
        }
        return _res;
    }



    render(){
        return (
            <ChartReportForStatistics
                title={this.props.title}
                formatX={this.formatX}
                kind={this.props.kind}
                onGetData={this.onGetData}
                info={this.props.info}
            />
        );
    }
};

export default ChartReportNormal;



// WEBPACK FOOTER //
// ./src/components/ChartReportNormal/Overview.js