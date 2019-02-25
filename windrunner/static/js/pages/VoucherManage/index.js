import React from 'react';
import { Tabs,Spin } from 'antd';
import style from './index.less';
import Voucher from 'components/Voucher';
import BaseContent from 'components/BaseContent';
import { getUserVouchers } from 'actions/voucherManage';
import {VOUCHER_STATUS} from 'utils/const';
const TabPane = Tabs.TabPane;

const VOUCHER_STATE_TEXT = [
    {status:VOUCHER_STATUS.canuse,name:'可使用'},
    {status:VOUCHER_STATUS.used,name:'已使用'},
    {status:VOUCHER_STATUS.overdue,name:'已过期'}
];

class VoucherManage extends React.Component {

    state = {
        voucherList : [],
        loading:true
    }

    componentDidMount(){
        getUserVouchers({limit:100,start:0,status:VOUCHER_STATUS.canuse}).then(res=>{
            this.setState({voucherList:res.data.this_page,loading:false});
        });
    }

    renderVoucher(lists){
        if(lists.length !== 0){
            const _res = [];
            lists.forEach(voucher=>{
                _res.push(<Voucher style={{marginLeft:30,marginBottom:35}} info={voucher}/>);
            });
            return _res;
        }else{
            return <div className={style.empty}><img src={require('./empty.png')} alt=""/> <p>没有代金券</p></div>;
        }
    }
    onChange = (status)=>{
        this.setState({loading:true});
        getUserVouchers({limit:100,start:0,status}).then(res=>{
            this.setState({voucherList:res.data.this_page,loading:false});
        });
    }

    render() {
        return (
            <BaseContent style={{padding:0}}>
                <Spin spinning={this.state.loading}>
                    <div className={style.voucher}>
                        <Tabs defaultActiveKey={VOUCHER_STATUS.canuse+''} onChange={this.onChange}>
                            {VOUCHER_STATE_TEXT.map(item=>{
                                return <TabPane tab={item.name} key={item.status+''}>
                                    <div>
                                        { this.renderVoucher(this.state.voucherList.filter(voucher=>{
                                            return voucher.status === item.status;
                                        }))
                                        }
                                    </div>
                                </TabPane>;
                            })}
                        </Tabs>
                    </div>
                </Spin>
            </BaseContent>
        );
    }

}

export default VoucherManage;



// WEBPACK FOOTER //
// ./src/pages/VoucherManage/index.js