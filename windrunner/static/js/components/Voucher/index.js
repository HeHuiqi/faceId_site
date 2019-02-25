import React from 'react';
import style from './index.less';
import classname from 'classnames';
import {VOUCHER_STATUS} from 'utils/const';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

class Voucher extends React.Component {


    onUse = ()=>{
        if(this.props.info.status === VOUCHER_STATUS.canuse){
            this.props.history.push('/pages/recharge');
        }
    }

    render() {
        const {info} = this.props;
        const _cls = classname({
            [style.voucher]:true,
            [style.used]:info.status === VOUCHER_STATUS.used,
            [style.overdue]:info.status === VOUCHER_STATUS.overdue
        });

        let range = '';
        if(info.stime && info.etime){
            let stime = info.stime;
            let etime = info.etime;
            if(!moment.isMoment(stime)){
                stime = moment.unix(stime);
                etime = moment.unix(etime);
            }
            range = stime.format('YYYY/MM/DD') +' - '+ etime.format('YYYY/MM/DD');
        }

        return (
            <div className={_cls} style={this.props.style}>
                <div className={style.back}><a onClick={this.onUse}>立即使用</a></div>
                <div className={style.content}>
                    <h1>¥<span>{info.amount}</span>{info.expiring===1?<img src={require('./expiring.png')}/>:null}</h1>
                    <p>使用规则：满{info.rule}可使用</p>
                    <p>有效期：{range}</p>
                    <p>券编号：{info.id}</p>
                </div>
            </div>
        );
    }
}

export default withRouter(Voucher);



// WEBPACK FOOTER //
// ./src/components/Voucher/Overview.js