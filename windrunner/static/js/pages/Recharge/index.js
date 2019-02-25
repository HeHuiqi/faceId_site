import React from 'react';
import { Input, Button } from 'antd';
import { connect } from 'react-redux';
import { Row, Col,Popover,Spin } from 'antd';
import style from './index.less';
import { pay } from 'actions/finance';
import moment from 'moment';
import BaseContent from 'components/BaseContent';
import OffLineInfo from 'components/OffLineInfo';
import {PAY_TYPE,PAY_TYPE_INFO} from 'utils/const';
import { checkProblem } from 'actions/finance';
import { withRouter } from 'react-router-dom';
import NoMenuLayer from 'components/NoMenuLayer';
import BankList from './BankList';
import {payMethod} from 'utils/tool';
import { getUserCanUseVouchers } from 'actions/voucherManage';
import classname from 'classnames';
import {personal,enterprise} from 'utils/bankConst';

const moneyReg=/^([1-9][0-9]*)$/;
const money = [100,1000,5000,10000,100000];



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

class Recharge extends React.Component {

    state = {
        select:null,
        customMoney:0,
        tradeNo:null,
        createAt:'',
        step:0,
        moneyError:'',
        canPay:false,
        nowPayType:null,
        isShowOffLine:false,
        bankId:'',
        vouchers:[],
        voucher:null,
        loadingVoucher:true
    }

    componentDidMount(){
        //获取代金券数据
        getUserCanUseVouchers().then(res=>{
            this.setState({vouchers:res.data.this_page,loadingVoucher:false});
        });

    }

    onSelect = (money)=>{
        const _state = { select: money, customMoney: money,moneyError:'',voucher:null};
        if(money === 'custom'){
            _state.customMoney = 0;
            _state.canPay = false;
        }else{
            _state.canPay = true;
        }
        this.setState(_state);
    }
    onMoneyChange = (e)=>{
        //判断输入金额
        let value = e.target.value;
        let error = '',canPay = true;
        if(!value || value === ''){
            error = '';
            value = 0;
            canPay = false;
        }else if(value.match(moneyReg) == null){
            error = '转入金额数值必须为正整数';
            value = 0;
            canPay = false;
        }else if(parseFloat(value) === 0){
            error = '转入金额数值必须为正整数';
            value = 0;
            canPay = false;
        }else if(value > 9999999){
            error = '单次充值金额不可大于9999999元';
            value = 0;
            canPay = false;
        }else{
            error = '';
        }
        value = parseInt(value,10);
        this.setState({ customMoney: value,moneyError:error,canPay,voucher:null});
    }
    onChoice = ()=>{
        this.setState({ step: 1 });
    }

    onPay = ()=>{
        const type = this.state.nowPayType;
        const params = { amount: this.state.customMoney, type};
        if(this.checkZhongjin()){
            params.bank_id = this.state.bankId;
        }
        if(this.state.voucher){
            params.vouchers_id = this.state.voucher.id;
        }
        pay(params).then((res)=>{
            const _state = { tradeNo: res.data.trade_no, createAt: moment.unix(res.data.created_at).local().format('YYYY/MM/DD HH:mm:ss'),step:2};
            payMethod(type,res.data.thirdparty_pay_params);
            if(type === PAY_TYPE.OFFLINE){
                _state.isShowOffLine = true;
            }
            this.setState(_state);
        });
    }

    onSelectVoucher(voucher){
        if(this.state.customMoney<voucher.rule){
            return;
        }
        if(voucher !== this.state.voucher){
            this.setState({voucher});
        }else{
            this.setState({voucher:null});
        }

    }

    renderStepOne=()=>{
        return (
            <Col>
                <Row>
                    <div className={style.title} style={{width:98}}>设置充值金额：</div>
                    <div className={style.money}>
                        <Row>
                            {money.map(item => {
                                return <a className={this.state.select === item ? style.selectMoney : null} onClick={this.onSelect.bind(this, item)}>{item}元</a>;
                            })}
                        </Row>
                        <Row>
                            <a className={this.state.select === 'custom' ? style.selectMoney : null} onClick={this.onSelect.bind(this, 'custom')}>自定义</a>
                            {this.state.select === 'custom' ? <div className={this.state.moneyError !== ''?'has-error':''}><Input placeholder="请输入金额" min={0} onChange={this.onMoneyChange} style={{ width: 200,margin:10 }} />元
                                {this.state.moneyError !== ''?<span className={style.money_error}>{this.state.moneyError}</span>:null}
                            </div> : null}
                        </Row>
                    </div>
                </Row>
                <Row className={style.border}>
                    <div className={style.title} style={{width:98}}>使用代金券：</div>
                    <Col className={style.vouchersBox} span={21}>
                        <Row>
                            {this.state.vouchers.length ===0 ? <div className={style.noVoucher} >没有代金券</div>:this.state.vouchers.map(item => {
                                const _cls = classname({
                                    [style.vouchers]:true,
                                    [style.voucherChecked]:this.state.voucher === item,
                                    [style.voucherDisabled]:this.state.customMoney < item.rule
                                });
                                return (
                                    <div className={_cls} onClick={this.onSelectVoucher.bind(this, item)}>
                                        <h1><span >¥</span>{item.amount}{item.expiring === 1?<i>即将到期</i>:null}</h1>
                                        <p>满{item.rule}可用</p>
                                        <p>有效期至{moment.unix(item.etime).format('YYYY/MM/DD')}</p>
                                    </div>
                                );
                            })}
                        </Row>
                    </Col>
                </Row>
                <Row className={style.moneyReview} style={{ textAlign: 'right',lineHeight:'37px'}}>
                    <Row type="flex" justify="end">
                        <Col span={3}><span className={style.moneyLabel}>实付额：</span></Col><Col span={4}><span className={style.moneyReal}>¥{this.state.customMoney}</span></Col>
                    </Row>
                    <Row type="flex" justify="end">
                        <Col span={3}><span className={style.moneyLabel}>到账金额：</span></Col><Col span={4}><span className={style.moneyLabel}>¥{this.state.customMoney+(this.state.voucher?this.state.voucher.amount:0)}</span></Col>
                    </Row>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right',marginTop:30 }}>
                        <Button onClick={this.onChoice} disabled={!this.state.canPay} type="primary">选择支付方式</Button>
                    </Col>
                </Row>
            </Col>
        );
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

    onBankSelect = (value)=>{
        this.setState({bankId:value});
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

        return(

            <div>
                <Row>
                    <div className={style.title}>充值金额：<span className={style.showMoney}>{this.state.customMoney}</span>元</div>
                </Row>
                <Row style={{marginTop:'30px'}}>
                    <div className={style.title}>请选择支付方式：</div>
                    <div className={style.payType}>
                        {Object.keys(PAY_TYPE).map(key=>{
                            const item = PAY_TYPE_INFO[PAY_TYPE[key]];
                            const _buttonType = <a className={this.state.nowPayType === PAY_TYPE[key]?style.payTypeSelect:null} onClick={this.changePayType.bind(this,PAY_TYPE[key])}><img src={item.image} alt="" /></a>;
                            if(this.state.customMoney<item.min){
                                return <Popover content={'低于'+item.min+'元不能使用'+item.name} trigger="hover"><a><img src={item.imageDis} alt="" /></a></Popover>;
                            }
                            return _buttonType;
                        })}
                    </div>
                    {banks}
                </Row>
                <Row style={{ textAlign: 'center', marginTop: 50 }}>
                    <Button disabled={!this.checkCanPay()} onClick={this.onPay} type="primary">支付</Button>
                </Row>
            </div>
        );
    }
    onOk=()=>{
        this.props.history.push('/pages/order');
    }

    renderStepThree=()=>{
        return(
            <div>
                <Row>
                    <div className={style.title}>订单编号：{this.state.tradeNo}</div>
                </Row>
                <Row>
                    <div className={style.title}>实付额：<span className={style.showMoney}>{this.state.customMoney}</span>元</div>
                </Row>
                <Row>
                    <div className={style.title}>支付方式：{PAY_TYPE_INFO[this.state.nowPayType].name}</div>
                </Row>
                <Row>
                    <div className={style.title}>支付时间：{this.state.createAt}</div>
                </Row>
                <Row style={{ textAlign: 'center', marginTop: 50 }}>
                    <div className={style.button_group}>
                        <Button onClick={this.onOk} type="primary">{this.state.nowPayType === PAY_TYPE.OFFLINE?'确认':'支付成功'}</Button>
                        {this.state.nowPayType === PAY_TYPE.OFFLINE?null:<Button onClick={this.onFailPay}>支付遇到问题</Button>}
                    </div>
                </Row>
            </div>
        );
    }

    onFailPay=()=>{
        return checkProblem(this.state.tradeNo).then();
    }
    onProblem = ()=>{
        checkProblem(this.state.tradeNo).then(()=>{
            this.onCancelOffLine();
        });
    }

    onCancel = ()=>{
        if(this.state.step < 2){
            this.props.onCancel();
        }else{
            this.props.onOk();
        }
    }
    onCancelOffLine = ()=>{
        this.setState({isShowOffLine:false});
    }

    render() {
        const htmlCatch = [this.renderStepOne, this.renderStepTwo, this.renderStepThree];
        const html = htmlCatch[this.state.step]();

        return (
            <NoMenuLayer>
                <BaseContent style={{width:'1000px',margin:'0 auto',minHeight:'500px'}}>
                    <Spin spinning={this.state.loadingVoucher}>
                        <div style={{width:'812px',margin:'0 auto'}}>
                            <div className={style.step}>
                                <StepNum nowStep={this.state.step} step={0} text="1" title="设置充值额度" />
                                <StepNum nowStep={this.state.step} step={1} text="2" title="选择支付方式" />
                                <StepNum nowStep={this.state.step} step={2} text="3" title="完成支付" isLast/>
                            </div>

                            {html}
                            <OffLineInfo
                                visible={this.state.isShowOffLine}
                                onCancel={this.onCancelOffLine}
                                onProblem = {this.onProblem}
                                info = {{amount:this.state.customMoney,username:this.props.account.username,tradeNo:this.state.tradeNo}}
                            />
                        </div>
                    </Spin>
                </BaseContent>
            </NoMenuLayer>

        );
    }

}
function select(state) {
    return {
        account: state.account.info
    };
}
export default connect(select)(withRouter(Recharge));



// WEBPACK FOOTER //
// ./src/pages/Recharge/index.js