import React from 'react';
import { getApiKeys, getApiKey, createApiKey} from 'actions/apiKey';
import { Button, Modal,Spin } from 'antd';
import { connect } from 'react-redux';
import Clipboard from 'clipboard';
import PropTypes from 'prop-types';
import {setUserInfo} from 'actions/account';
import { bindActionCreators } from 'redux';
import ApiKeyEdit from 'components/ApiKeyEdit';
import { withRouter } from 'react-router-dom';
import Item from './Item';
import ApiKeyEmpty from './ApiKeyEmpty';
import BaseContent from 'components/BaseContent';
import style from './index.less';
import { STATUS } from 'utils/const';

class ApiKey extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            list:null,
            info:{},
            loading:true,
            modalVisible:false,
            showSecret:false
        };
        this.clipboard = null;
    }

    componentDidMount(){
        this.getAll();
    }
    getAll = ()=>{
        getApiKeys({start:0,limit:100}).then(e => {
            this.setState({ list: e.data.this_page ? e.data.this_page : [], total: e.data.total ,loading: false });
        });
    }

    componentDidUpdate() {
        if (this.clipboard){
            this.clipboard.destroy();
        }

        this.clipboard = new Clipboard('.copyButton');
        this.clipboard.on('success', (e)=>{
            this.setState({ copyCode: e.text});
            this.timeHandle = window.setTimeout(() => {
                this.setState({
                    copyCode: ''
                });
            }, 2000);
        });

    }

    onHandle(id){
        getApiKey(id).then(e=>{
            this.apiKeyEditRef.setFieldsValue({ name: e.data.name, description:e.data.description});
            this.setState({ modalVisible: true, isEdit: true,info:e.data,copyCode:'',showSecret:false });
        });
    }


    onCreate=()=>{
        //检查认证状态
        const { status } = this.props.account;
        if (status !== STATUS.PASS){
            //认证未通过
            Modal.confirm({
                title:'您还没有进行企业认证',
                content: 'API Key需进行企业认证后才能创建，认证成功后获赠100元！',
                okText: '马上认证',
                cancelText:'暂不认证',
                onOk:()=>{
                    this.context.router.history.push('/pages/auth');
                }
            });
            return;
        }
        this.apiKeyEditRef&&this.apiKeyEditRef.resetFields();
        this.setState({ modalVisible: true, isEdit: false, copyCode: ''});
    }


    onCancel=()=>{
        this.setState({ modalVisible: false, copyCode: '' });
        setTimeout(() => {
            this.setState({ info: {} });
        }, 50);
    }



    onCreateApi=()=>{
        this.apiKeyEditRef.validateFields((err, values) => {
            if (!err) {
                createApiKey(values['name'], values['description']).then(e => {
                    this.onCancel();
                    this.getAll();
                });
            }
        });
    }



    render() {
        if(this.state.list === null){
            return <Spin><BaseContent /></Spin>;
        }

        let content,boxClass;
        if( this.state.list.length !== 0){
            content = <div>
                <Button type="primary" onClick={this.onCreate} style={{marginBottom:'20px'}}>+新建API Key</Button>
                {this.state.list.map(item=>{
                    return <Item info={item} />;

                })}
            </div>;
        }else{
            boxClass = style.box;
            content = <ApiKeyEmpty><Button type="primary" onClick={this.onCreate} style={{marginBottom:'20px'}}>+新建API Key</Button></ApiKeyEmpty>;
        }


        return (

            <div  className={boxClass}>
                {content}
                <div id="copy"></div>
                <Modal
                    title={this.state.isEdit ? '查看API Key' : '创建API Key'}
                    okText="创建"
                    visible={this.state.modalVisible}
                    onOk={this.onCreateApi}
                    onCancel={this.onCancel}
                >
                    <ApiKeyEdit isCreate ref={ref=>this.apiKeyEditRef = ref }/>
                </Modal>
            </div>
        );
    }

}
ApiKey.contextTypes = {
    router: PropTypes.object
};
function select(state) {
    return {
        account: state.account.info
    };
}
function mapDispatchToProps(dispatch) {
    return {
        setUserInfo: bindActionCreators(setUserInfo, dispatch)
    };
}
export default withRouter(connect(select,mapDispatchToProps)(ApiKey));



// WEBPACK FOOTER //
// ./src/pages/ApiKey/Overview.js