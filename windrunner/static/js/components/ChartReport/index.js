import React from 'react';
import style from './index.less';
import echarts from 'echarts';
import moment from 'moment';

class ChartReport extends React.Component {

    constructor(props){
        super(props);
        this.chartId = new Date().getTime()+this.MathRand();
    }
    MathRand(){
        let Num = '';
        for(let i=0;i<6;i++)
        {
            Num+=Math.floor(Math.random()*10);
        }
        return Num;
    }

    componentDidMount(){
        window.addEventListener('resize',()=>{
            if(this.myChart){
                const box = document.getElementById(this.chartId);
                if(box && box.clientHeight === 0){
                    return;
                }
                this.myChart.resize();
            }
        });
    }
    resize(){
        if(this.myChart){
            this.myChart.resize();
        }
    }

    fixRate(value){
        return (value*100).toFixed(2) + '%';
    }

    componentDidUpdate(){
        let _data = this.props.data;
        if(!_data){
            _data = [];
        }
        this.myChart = echarts.init(document.getElementById(this.chartId));
        const xdata = [];
        const data = _data.map(item=>{
            xdata.push(moment.unix(item.date).local().format('MM-DD'));
            let value;
            if(this.props.formatX){
                value = this.props.formatX(item);
            }else{
                value = item.value;
            }
            return {value};
        });
        const option = {
            title:{
                text:this.props.title,
                textStyle:{
                    color:'#4E4E4E',
                    fontSize:14,
                    fontWeight:'normal'
                },
                top:20
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params)=> {
                    params = params[0];
                    //百分比数据
                    let value = params.value;
                    if(this.props.kind === 'rate'){
                        value = this.fixRate(value);
                    }
                    return params.name + ' : ' + value;
                },
                axisPointer: {
                    animation: false
                }
            },
            grid:{
                top:50,
                left:60,
                bottom:20,
                right:20
            },
            xAxis: {
                type: 'category',
                data:xdata,
                boundaryGap: false,
                axisLine:{
                    lineStyle:{
                        color:'#999999'
                    }
                },
                axisLabel:{
                    color:'#515665'
                }
            },
            yAxis: {
                axisLine:{
                    lineStyle:{
                        color:'#999999'
                    }
                },
                axisLabel: {
                    color:'#515665',
                    formatter :(val)=> {
                        //百分比数据显示
                        if(this.props.kind === 'rate'){
                            return val*100 + '%';
                        }
                        return val;
                    }
                },
                splitLine:{
                    lineStyle:{
                        color:'#eee'
                    }
                },
                type: 'value'
            },
            color:'#00A5E3',
            series: [{
                data,
                type: 'line',
                smooth: true,
                lineStyle:{
                    color:'#00A5E3',
                    shadowBlur:10,
                    shadowColor:'rgba(0, 0, 0, 0.2)',
                    shadowOffsetY:6
                }
            }]
        };
        this.myChart.setOption(option,true);
    }

    render() {

        return (
            <div className={style['chart-report']}>
                <div className={style['chart-info']}>
                    {this.props.info && this.props.info.map(item=>{
                        return <div>
                            <p>{item.name}</p>
                            <span>{item.value}{item.unit||'次'}</span>
                        </div>;
                    })}
                </div>
                <div className={style['chart-box']}>
                    <div style={{height:'100%'}} id={this.chartId}></div>
                </div>
            </div>
        );
    }
}

export default ChartReport;



// WEBPACK FOOTER //
// ./src/components/ChartReport/Overview.js