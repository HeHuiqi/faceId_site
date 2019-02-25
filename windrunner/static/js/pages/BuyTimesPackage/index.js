import React from 'react';
import { Button } from 'antd';
import { Row, Col,Spin,Popover } from 'antd';
import style from './index.less';
import { buyBundle,buyBundleByBalance } from 'actions/finance';
import BaseContent from 'components/BaseContent';
import { getBundleList,getBalance } from 'actions/finance';
import { withRouter } from 'react-router-dom';
import NoMenuLayer from 'components/NoMenuLayer';
import moment from 'moment';
import BankList from '../Recharge/BankList';
import {parseSearch} from 'utils/const';
import {PAY_TYPE,PAY_TYPE_INFO} from 'utils/const';
import {personal,enterprise} from 'utils/bankConst';
import { checkProblem } from 'actions/finance';
import {payMethod} from 'utils/tool';

const service_list = [{
    name: '人脸核身',
    value: 200
},{
    name: '人脸比对',
    value: 201
},{
    name: '身份证OCR',
    value: 100
}];

const service_type_list = [
    {
        name: 'SDK',
        value: 0
    },
    {
        name: 'Lite',
        value: 1
    },
    {
        name: 'SDK+Lite',
        value: 2
    }
];
const SUPPORT_PAY_TYPE = [
    'balance',PAY_TYPE.ALIPAY,PAY_TYPE.PERSONAL,PAY_TYPE.ENTERPRISE
];
const PAY_TYPE_INFO_WITH_BALANCE = {...PAY_TYPE_INFO,
    'balance':{image:require('image/recharge-balance.png'),imageDis:require('image/recharge-balance-disabled.png'),name:'余额支付'}
};

const StepNum = (props)=> {
    let _style = '';
    let text = props.text;
    if (props.nowStep < props.step){
        _style = style.stepNo;
    } else if (props.nowStep === props.step){
        _style = style.stepNow;
    }else{
        _style = style.stepPass;
        text = <img alt="" src={require('../../image/u1605.png')} />;
    }

    return <div className={_style}>
        <div className={style.stepItem}>
            <span className={style.stepNum}>{text}</span>
            <span className={style.stepText}>{props.title}</span>
        </div>
        {!props.isLast?<div className={style.line}></div>:null}
    </div>;
};

class BuyTimesPackage extends React.Component {
    constructor(props) {
        super(props);

        this.searchParams = parseSearch();
        const service = this.searchParams.service ?
            service_list.filter(e=> e.value == this.searchParams.service)[0] : service_list[0];

        this.state = {
            selectService: service,
            selectType:service_type_list[0],
            selectBundle:{
                price:0
            },
            countList:[],
            tradeNo:null,
            step:0,
            balance:0,
            canPay:false,
            loading:true,
            //切换支付方式相关
            bankId:'',
            nowPayType:PAY_TYPE.ALIPAY,
        };
    }

    componentDidMount(){
        getBalance().then(res=>{
            this.setState({balance:res.data.balance});
            this.getBundle().then((res)=> {

                const bundle = this.searchParams.bundle ?
                    res.filter(e=> e.count == this.searchParams.bundle)[0]: {price: 0};
                this.setState({
                    selectBundle: bundle,
                    canPay: bundle.price > 0
                });
            });

        });
    }

    getBundle(){
        //获取默认规格数据
        this.setState({loading:true});
        return new Promise((resolve, reject)=> {
            getBundleList({service:this.state.selectService.value,type:this.state.selectType.value}).then(res=>{
                this.setState({
                    countList:res.data,
                    loading:false
                });
                resolve(res.data);
            });
        });
    }

    onSelect = (param,value)=>{
        //初始化规格选择
        this.setState({[param]:value,selectBundle:{price:0},canPay:false},()=>{
            this.getBundle();
        });
    }

    onSelectBundle = (item)=>{
        this.setState({selectBundle:item,canPay:true});
    }

    onChoice = ()=>{
        const canPayByBalance = this.checkCanPayByBalance();
        this.setState({
            step: 1,
            nowPayType:canPayByBalance?'balance':PAY_TYPE.ALIPAY,
        });
    }

    checkCanPayByBalance = ()=>{
        return this.state.balance>=this.state.selectBundle.price;
    }

    onPay = ()=>{
        //基本参数
        let params = {
            service: this.state.selectService.value,
            count:this.state.selectBundle.count
        };
        let payFun;
        //如果为余额付款
        if(this.state.nowPayType === 'balance'){
            params.type = this.state.selectType.value;
            payFun = buyBundleByBalance;
        }else{
            const _params = {
                service_type:this.state.selectType.value,
                pay_type:this.state.nowPayType
            };
            if(this.checkZhongjin()){
                params.bank_id = this.state.bankId;
            }
            //其他方式
            params = {...params,..._params};
            payFun = buyBundle;
        }
        this.setState({loading:true});
        payFun(params).then((res)=>{
            this.setState({loading:false});
            //根据不同情况跳转
            //余额支付直接跳转到资源包管理页面
            const type = this.state.nowPayType;
            if(this.state.nowPayType === 'balance'){
                this.props.history.push('/pages/resource_package_manage');
            }else{
                payMethod(type,res.data.thirdparty_pay_params);
                const _state = { tradeNo: res.data.trade_no, createAt: moment.unix(res.data.created_at).local().format('YYYY/MM/DD HH:mm:ss'),step:2};
                this.setState(_state);
            }
        }).catch(e=>{
            this.setState({loading:false});
        });
    }

    renderStepOne=()=>{
        return (
            <Col>
                <Row>
                    <div className={style.title} style={{width:98}}>产品：</div>
                    <div className={style.money}>
                        <Row>
                            {service_list.map(item => {
                                return <a
                                    className={this.state.selectService === item ? style.selectMoney : null}
                                    onClick={this.onSelect.bind(this,'selectService',item)}>{item.name}</a>;
                            })}
                        </Row>
                    </div>
                </Row>
                <Row>
                    <div className={style.title} style={{width:98}}>类型：</div>
                    <div className={style.money}>
                        <Row>
                            {service_type_list.map(item => {
                                return <a
                                    className={this.state.selectType === item ? style.selectMoney : null}
                                    onClick={this.onSelect.bind(this,'selectType',item)}>{item.name}</a>;
                            })}
                        </Row>
                    </div>
                </Row>
                <Row>
                    <div className={style.title} style={{width:98}}>有效期：</div>
                    <div className={style.title} style={{paddingLeft:11}}>3年</div>
                </Row>
                <Row>
                    <div className={style.title} style={{width:98}}>规格：</div>
                    <div className={style.money}>
                        <Row>
                            {this.state.countList.map(item => {
                                return <a
                                    className={this.state.selectBundle === item ? style.selectMoney : null}
                                    onClick={this.onSelectBundle.bind(this,item)}>{item.count}次</a>;
                            })}
                        </Row>
                    </div>
                </Row>
                <Row className={style.moneyReview} style={{ textAlign: 'right',lineHeight:'37px'}}>
                    <Row type="flex" justify="end">
                        <Col span={3}><span className={style.moneyLabel}>配置费用：</span></Col><Col span={4}><span className={style.moneyReal}>¥{this.state.selectBundle.price}</span></Col>
                    </Row>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right',marginTop:30 }}>
                        <Button className={style.subButton} onClick={this.onChoice} disabled={!this.state.canPay} type="primary">选择支付方式</Button>
                    </Col>
                </Row>
            </Col>
        );
    }

    onBankSelect = (value)=>{
        this.setState({bankId:value});
    }

    changePayType = (type)=>{
        this.setState({nowPayType:type,bankId:''});
    }

    checkZhongjin = ()=>{
        const type = this.state.nowPayType;
        if(type === PAY_TYPE.PERSONAL || type === PAY_TYPE.ENTERPRISE){
            return true;
        }
        return false;
    }

    checkCanPay = ()=>{
        if(this.checkZhongjin() && this.state.bankId === ''){
            return false;
        }
        if(this.state.nowPayType === null){
            return false;
        }
        return true;
    }

    renderStepTwo=()=>{
        let banks;
        if(this.state.nowPayType === PAY_TYPE.PERSONAL){
            banks = <BankList onClick={this.onBankSelect} key={1} banks={personal} className={style.personal}/>;
        }else if( this.state.nowPayType === PAY_TYPE.ENTERPRISE){
            banks = <BankList onClick={this.onBankSelect} key={2} banks={enterprise} className={style.enterprise}/>;
        }
        const canUseBalance = this.checkCanPayByBalance();

        return(

            <div>
                <Row>
                    <div className={style.info}><span className={style.info_title}>订单信息</span><span>产品：{this.state.selectService.name} | 类型：{this.state.selectType.name} | 有效期：3年 | 规格：{this.state.selectBundle.count}次</span> <span className={style.sureMoney}>¥{this.state.selectBundle.price}</span></div>
                </Row>
                <Row style={{margin:'10px 0'}}>
                    <div className={style.title} style={{width:98}}>支付方式：</div>
                    <div className={style.payType}>
                        {SUPPORT_PAY_TYPE.map(key=>{
                            const item = PAY_TYPE_INFO_WITH_BALANCE[key];
                            const _buttonType = <a className={this.state.nowPayType === key?style.payTypeSelect:null} onClick={this.changePayType.bind(this,key)}><img src={item.image} alt="" /></a>;
                            if(key==='balance'){
                                if(!canUseBalance){
                                    return <Popover content={'账户余额不足'} trigger="hover"><a><img src={item.imageDis} alt="" /></a></Popover>;
                                }
                            }else{
                                if(this.state.selectBundle.price<item.min){
                                    return <Popover content={'低于'+item.min+'元不能使用'+item.name} trigger="hover"><a><img src={item.imageDis} alt="" /></a></Popover>;
                                }
                            }
                            return _buttonType;
                        })}
                    </div>
                    {banks}
                </Row>
                <Row style={{borderTop: '1px dashed #DDDDDD'}}>
                    <Col span={24} style={{ textAlign: 'right',marginTop:30 }}>
                        <span style={{color:'#666666',fontSize:'14',fontWeight:600,paddingRight:10}}>总计费用</span>
                        <span style={{color:'#00A5E3',fontSize:'24px',fontWeight:600,paddingRight:13,verticalAlign:'sub'}}>¥{this.state.selectBundle.price}</span>
                        <Button className={style.subButton} disabled={!this.checkCanPay()} onClick={this.onPay} type="primary">确认支付</Button>
                    </Col>
                </Row>
            </div>
        );
    }


    onFailPay=()=>{
        return checkProblem(this.state.tradeNo).then();
    }

    renderStepThree=()=>{
        return(
            <div>
                <Row>
                    <div className={style.title}>订单编号：{this.state.tradeNo}</div>
                </Row>
                <Row>
                    <div className={style.title}>实付额：<span className={style.showMoney}>{this.state.selectBundle.price}</span>元</div>
                </Row>
                <Row>
                    <div className={style.title}>支付方式：{PAY_TYPE_INFO[this.state.nowPayType].name}</div>
                </Row>
                <Row>
                    <div className={style.title}>支付时间：{this.state.createAt}</div>
                </Row>
                <Row style={{ textAlign: 'center', marginTop: 50 }}>
                    <div className={style.button_group}>
                        <Button onClick={this.onOk} type="primary">支付成功</Button>
                        <Button onClick={this.onFailPay}>支付遇到问题</Button>
                    </div>
                </Row>
            </div>
        );
    }

    onOk=()=>{
        this.props.history.push('/pages/order');
    }

    render() {
        const htmlCatch = [this.renderStepOne, this.renderStepTwo, this.renderStepThree];
        const html = htmlCatch[this.state.step]();

        return (
            <NoMenuLayer>
                <BaseContent style={{width:'1000px',margin:'0 auto',minHeight:'500px'}}>
                    <Spin spinning={this.state.loading}>
                        <div style={{width:'812px',margin:'0 auto'}}>
                            <div className={style.step}>
                                <StepNum nowStep={this.state.step} step={0} text="1" title="选择资源包" />
                                <StepNum nowStep={this.state.step} step={1} text="2" title="选择支付方式" />
                                <StepNum nowStep={this.state.step} step={2} text="3" title="完成支付" isLast/>
                            </div>

                            {html}
                        </div>
                    </Spin>
                </BaseContent>
            </NoMenuLayer>

        );
    }

}
export default withRouter(BuyTimesPackage);



// WEBPACK FOOTER //
// ./src/pages/BuyTimesPackage/Overview.js