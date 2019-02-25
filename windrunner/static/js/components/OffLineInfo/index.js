import React from 'react';
import style from './index.less';
import ModalTitle from 'components/ModalTitle';
import { Modal, Button } from 'antd';

//title在白色card外面的类型
class OffLineInfo extends React.Component {

    render(){
        return (
            <Modal
                title="转账汇款"
                visible={this.props.visible}
                footer={[<Button onClick={this.props.onCancel}>关闭</Button>]}
                onCancel={this.props.onCancel}
                maskClosable={false}
            >
                <ModalTitle>请将款项汇入以下银行账户</ModalTitle>
                <table className={style.offlineTable}>
                    <tr>
                        <td>开户行</td>
                        <td>招商银行北京海淀支行</td>
                    </tr>
                    <tr>
                        <td>户名</td>
                        <td>北京旷视科技有限公司</td>
                    </tr>
                    <tr>
                        <td>账号</td>
                        <td>9990 1917 7210 402</td>
                    </tr>
                    <tr>
                        <td>款项</td>
                        <td>{this.props.info.amount}元</td>
                    </tr>
                </table>
                <p style={{color:'#FB3F3F',marginBottom:0,marginTop:10}}>请务必在转账时提供用户名和订单编号，以便将汇款与您的订单进行关联。</p>
                <p style={{color:'#FB3F3F',marginBottom:10}}>转账完成后请发邮件给tso-faceid-invoice@megvii.com。</p>
                <table className={style.offlineTable} style={{marginTop:0}}>
                    <tr>
                        <td>用户名</td>
                        <td>{this.props.info.username}</td>
                    </tr>
                    <tr>
                        <td>订单编号</td>
                        <td>{this.props.info.tradeNo}</td>
                    </tr>
                </table>
                <div style={{marginTop:'9px'}}>
                    <ModalTitle>注意事项</ModalTitle>
                    <div  className={style.offlineTips}>
                        <p>1. 不同银行的“备注”命名不同，最好是将所有的可填写备注的地方都填写上。</p>
                        <p>2. 线下转账请确保一次转账对应一个订单的金额，请勿多转账或少转账。</p>
                        <p>3. 转账后会在 1-3 个工作日内确认支付，如果紧急请选择其他支付方式。</p>
                        <p>4. 您可以在“充值记录”随时查看本页中的内容。</p>
                    </div>
                </div>
            </Modal>
        );
    }
};

export default OffLineInfo;



// WEBPACK FOOTER //
// ./src/components/OffLineInfo/Overview.js