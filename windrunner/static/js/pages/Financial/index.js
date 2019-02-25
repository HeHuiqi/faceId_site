import React from 'react';
import CardLayer from 'components/CardLayer';
import { Spin, Button,Tabs } from 'antd';
import { getBalance } from 'actions/finance';
import { connect } from 'react-redux';
import {comdify ,getUrl} from 'utils/tool.js';
import { withRouter } from 'react-router-dom';
import BaseClientConsumption from 'components/BaseClientConsumption';
import BaseClientTPFinancial from 'components/BaseClientTPFinancial';
import {getComponents,exportComponents,getPurchaseComponents,exportPurchaseComponents} from 'actions/components.js';
import style from './index.less';

const TabPane = Tabs.TabPane;
class Financial extends React.Component {
    state = {
        loading:true,
        balance:0
    }

    componentDidMount(){
        this.refreshBalance();
    }
    refreshBalance=()=>{
        getBalance().then(res=>{
            this.setState({ balance: res.data.balance,loading:false});
        }).catch(()=>{
            this.setState({ loading:false});
        });
    }
    onRecharge = ()=>{
        window.open(getUrl('/pages/recharge'));
    }

    render() {
        return (
            <div>

                <CardLayer style={{ marginBottom:20}}>
                    <Spin
                        tip="加载中"
                        spinning={this.state.loading}
                    >
                        <div style={{ display: 'inline-block',marginRight: '20',fontSize:14,lineHeight:'36px' }}>
                            <span style={{ verticalAlign: 'middle'}}>余额：</span>
                            <span style={{ color: '#00A5E3', fontSize: 36, verticalAlign: 'middle', display:'inline-block'}}>{comdify(this.state.balance)}</span>
                            <span style={{ verticalAlign: 'middle' }}>&nbsp;元</span>
                        </div>
                        <Button
                            style={{ verticalAlign: 'middle', marginLeft: 10 }}
                            type="primary"
                            onClick={this.onRecharge}
                        >充值</Button>
                    </Spin>
                </CardLayer>
                <CardLayer className={style.title_main}>
                    <Tabs>
                        <TabPane tab='账单-按量模式' key='1'>
                            <BaseClientConsumption
                                outUrl={exportComponents()}
                                getData={getComponents}
                            />
                        </TabPane>
                        <TabPane tab='账单-次数包模式' key='2'>
                            <BaseClientTPFinancial
                                outUrl={exportPurchaseComponents()}
                                getData={getPurchaseComponents}
                            />
                        </TabPane>
                    </Tabs>
                </CardLayer>
            </div>
        );
    }

}
function select(state) {
    return {
        account: state.account.info
    };
}
export default connect(select)(withRouter(Financial));



// WEBPACK FOOTER //
// ./src/pages/Financial/Overview.js