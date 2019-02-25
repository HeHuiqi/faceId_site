import React from 'react';
import { connect } from 'react-redux';
import { getRealUrl} from 'utils/request.js';
import CardLayerInset from 'components/CardLayerInset';
import style from './ProtocolsModal.less';
import { downLoad} from 'utils/const';

class ProtocolsModal extends React.Component {

    onDownload(){
        downLoad(getRealUrl('/user/conf/url/loa'));
    }

    render() {
        const send = <span className={style.send}><img src={require('./send.png')} alt=""/>认证就送100元！</span>;
        return (
            <CardLayerInset title='认证须知' titleContent={send}>
                <div className={style.content}>
                    <div>
                        <h3>完成企业认证需要准备以下材料：</h3>
                        <ul>
                            <li>• 普通营业执照或者多证合一营业执照</li>
                            <li>• 组织机构代码证（多证合一的该项不需要）</li>
                            <li>• 法人身份证（正面、反面）</li>
                        </ul>
                    </div>
                    <div>
                        <h3>如您是代理人，代理操作企业认证，还需要以下材料：</h3>
                        <ul>
                            <li>• 代理人身份证（正面、反面）</li>
                            <li>• 公司授权函<a target="_black" href={getRealUrl('/user/conf/url/loa')} onClick={this.onDownload.bind(this)} download='授权函'>示例下载</a>(请下载打印，填写并盖章，然后上传照片或扫描件)</li>
                        </ul>
                    </div>
                </div>
            </CardLayerInset>

        );
    }
}

export default connect()(ProtocolsModal);



// WEBPACK FOOTER //
// ./src/components/AuthenticationForm/ProtocolsModal.js