import React from 'react';
import CardLayerInset from 'components/CardLayerInset';
import style from './index.less';

class Invoice extends React.Component {

    render() {

        return(
            <div style={{marginTop:'20px'}}>
                <CardLayerInset title="发票申请说明" className={style.top}>
                    <div className={style.invoice}>
                        <div>
                            <h1>申请流程</h1>
                            <ul>
                                <li>申请发票请发送邮件到：<a href="mailto:tso-faceid-invoice@megvii.com">tso-faceid-invoice@megvii.com</a></li>
                                <li>我们收到申请后，将核对信息，确认无误后即直接进行后续流程，发票寄出时，将同时发送邮件通知用户发票已寄出。</li>
                                <li>发票申请一旦申请，原则上不能修改。如果您在发票审核过程中或者收到发票后，发现任何问题或者错误，请务必妥善保管发票并请在开票日期起30日内发送邮件到：<a href="mailto:tso-faceid-invoice@megvii.com">tso-faceid-invoice@megvii.com</a></li>
                            </ul>
                            <img style={{marginLeft:'20px',marginTop:'30px',marginBottom:'10px'}} width={721} src={require('../../image/invoice-line.png')} alt=""/>
                        </div>
                        <div>
                            <h1>订单要求：</h1>
                            <p>您可依据线上充值或购买其他服务后已完成的订单，申请开具发票，单个订单不能重复开票。</p>
                        </div>
                        <div>
                            <h1>发票数量：</h1>
                            <p>一次申请只对订单实际支付总金额开具一张整数金额的发票，鼓励多个订单合开一张发票。</p>
                        </div>
                        <div>
                            <h1>发票金额：</h1>
                            <p>单张发票金额不能超出 105998 元，如超过此数目，请拆分多次申请。开票金额不得低于 1000 元，开票金额过低无法开具发票。</p>
                        </div>
                        <div>
                            <h1>发票内容：</h1>
                            <p>发票内容无需填写，我们会为您开具技术服务费发票，税率为6%.</p>
                        </div>

                        <div>
                            <h1>申请发票请提供如下信息：</h1>
                            <ul>
                                <li>订单编号（可以多个订单合并申请）</li>
                                <li>订单总金额（以实际订单编号信息总计为准）</li>
                                <li>发票类型：二选一：增值税普通发票、增值税专用发票(只有订单总金额大于等于 10,000 元才可以开具增值税专用发票）</li>
                            </ul>
                        </div>
                        <div>
                            <h1>申请增值税普通发票需提供如下信息：</h1>
                            <ul>
                                <li>发票抬头</li>
                                <li>纳税人识别号</li>
                            </ul>
                        </div>
                        <div>
                            <h1>申请增值税专用发票需提供如下信息：</h1>
                            <ul>
                                <li>纳税人识别号（必须是您公司《税务登记证》的编号，一般为15位）</li>
                                <li>单位名称（必须是您公司营业执照上的全称）</li>
                                <li>注册地址（必须是您公司营业执照上的注册地址）</li>
                                <li>电话（请提供能与您公司保持联系的有效电话）</li>
                                <li>开户银行（必须是您公司银行开户许可证上的开户银行）</li>
                                <li>银行账号（必须是您公司开户许可证上的银行账号）</li>
                                <li>营业执照扫描件（附件形式）</li>
                                <li>组织机构代码证扫描件（附件形式）</li>
                                <li>税务登记证扫描件（附件形式）</li>
                                <li>注：营业执照、组织机构代码证和税务登记证的扫描件如果已经完成三证合一，则只需提供营业执照扫描件</li>
                            </ul>
                        </div>
                        <div>
                            <h1>邮寄信息：</h1>
                            <ul>
                                <li>收件地址</li>
                                <li>收件人姓名</li>
                                <li>收件人电话</li>
                            </ul>
                        </div>
                    </div>
                </CardLayerInset>
            </div>

        );
    }

}

export default Invoice;



// WEBPACK FOOTER //
// ./src/pages/Invoice/Overview.js