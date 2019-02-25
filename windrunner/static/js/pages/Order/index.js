import React from 'react';
import History from './History';
import { connect } from 'react-redux';
import BaseContent from 'components/BaseContent';
import { checkProblem } from 'actions/finance';


class Order extends React.Component {



    onFailPay=(tradeNo)=>{
        checkProblem(tradeNo);
    }

    render() {
        return (
            <BaseContent>
                <History
                    autoSearch={true}
                    refreshBalance={this.refreshBalance}
                    onFailPay={this.onFailPay}/>
            </BaseContent>
        );
    }

}
function select(state) {
    return {
        account: state.account.info
    };
}
export default connect(select)(Order);



// WEBPACK FOOTER //
// ./src/pages/Order/Overview.js