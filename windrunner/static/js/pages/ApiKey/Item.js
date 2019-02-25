import React from 'react';
import { Button, Popover,Modal,Checkbox,Spin } from 'antd';
import Ficon from 'components/Ficon';
import style from './Item.less';
import { getApiKey,toggleApiKey,editApiKey} from 'actions/apiKey';
import ApiKeyEdit from 'components/ApiKeyEdit';
import moment from 'moment';
import Clipboard from 'clipboard';

const STATUS_MAPS = {
    0:{
        statusText:'已停用',
        statusColor:'#F85959',
        buttonText:'启用',
        buttonType:'primary'
    },
    1:{
        statusText:'已启用',
        statusColor:'#23b0e5',
        buttonText:'停用',
        buttonType:'danger'
    }
};

class Item extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            info:props.info,
            secret:null,
            copySecret:''
        };
    }

    onToggle=()=>{
        //loading按钮
        if (this.state.info.status === 1){
            this.setState({showWarning:true});
            return;
        }
        this.toggleApi();
    }

    toggleApi =()=>{
        this.setState({ loadingType: 'toggle',loading:true });
        const info = this.state.info;
        toggleApiKey(info.id, info.status === 1 ? 'disable' : 'enable').then(e => {
            info.status = info.status === 1 ? 0 : 1;
            //刷新当前table
            this.setState({ info,loading:false });
            this.cancalWaring();
        }).catch(()=>{
            this.setState({ loading:false});
            this.cancalWaring();
        });
    }

    onChange = (e)=>{
        this.setState({makeSure:e.target.checked});
    }
    cancalWaring = ()=>{
        this.setState({showWarning:false,makeSure:false});
    }

    showEdit = ()=>{
        this.setState({ loading:true });
        getApiKey(this.state.info.id).then(e=>{
            this.setState({ info:e.data,loading:false,showEdit:true });
        }).catch(()=>{
            this.setState({ loading:false});
        });
    }

    onEditApi=()=>{
        this.setState({ loading:true });
        this.apiKeyEditRef.validateFields((err, values) => {
            if (!err) {
                editApiKey(this.state.info.id, values['name'], values['description']).then(e => {
                    //刷新当前table
                    const _info = {...this.state.info};
                    _info.name = values['name'];
                    _info.description = values['description'];
                    this.cancalWaringEdit();
                    Modal.success({
                        title:'修改成功'
                    });
                    this.setState({ info:_info,loading:false });
                }).catch(()=>{
                    this.cancalWaringEdit();
                    this.setState({ loading:false });
                });
            }
        });
    }
    cancalWaringEdit=()=>{
        this.setState({showEdit:false});
    }

    getSecret = ()=>{
        if(this.state.secret === null){
            return getApiKey(this.state.info.id).then(e=>{
                this.setState({ loading:false});
                return e.data.api_secret;
            }).catch(()=>{
                this.setState({ loading:false});
            });
        }else{
            return Promise.resolve(this.state.secret);
        }
    }

    showSecret = ()=>{
        this.timeHandleSecret && window.clearTimeout(this.timeHandleSecret);
        this.setState({ copySecret: ''});
        const promise = this.getSecret();
        promise.then(text=>{
            this.setState({secret:text,isShowSecret:true});
        });
    }
    copyKey = ()=>{
        const clipboard = new Clipboard('#copy', {
            // 点击copy按钮，直接通过text直接返回复印的内容
            text:()=> {
                return this.state.info.api_key;
            }
        });
        this.timeHandle && window.clearTimeout(this.timeHandle);
        clipboard.on('success', (e)=>{
            clipboard.destroy();
            this.setState({ copyCode: e.text});
            this.timeHandle = window.setTimeout(() => {
                this.setState({
                    copyCode: '',
                });
            }, 2000);
        });
        document.getElementById('copy').click();
    }

    copySecret = (isModal)=>{
        const promise = this.getSecret();
        if(promise !== null){
            promise.then(text=>{
                const clipboard = new Clipboard('#copy', {
                    // 点击copy按钮，直接通过text直接返回复印的内容
                    text() {
                        return text;
                    }
                });
                clipboard.on('success', (e)=>{
                    clipboard.destroy();
                    this.setState({ secret:e.text,copySecret: e.text,isModal});
                    this.timeHandleSecret = window.setTimeout(() => {
                        this.setState({
                            copySecret: ''
                        });
                    }, 2000);
                });
                document.getElementById('copy').click();
            });
        }
    }

    onHideSecret = ()=>{
        this.timeHandleSecret && window.clearTimeout(this.timeHandleSecret);
        this.setState({isShowSecret:false,copySecret:''});
    }

    render(){
        const {info} = this.state;
        let ToLongName;
        if(info.name.length>30){
            ToLongName = info.name.substr(0,30)+'...';
        }else{
            ToLongName = info.name;
        }
        return (
            <div className={style.item}>
                <Spin
                    spinning={this.state.loading}
                >
                    <div className={style.statusBar}>
                        <span className={style.name}>{info.name}</span>
                        <Ficon style={{marginLeft:'10px',cursor:'pointer'}} type="f-edit" onClick={this.showEdit}/>
                        <span style={{fontWeight:'bold',marginLeft:'30px',color:STATUS_MAPS[info.status].statusColor}}>{STATUS_MAPS[info.status].statusText}</span>
                    </div>

                    <div className={style.content}>
                        <div className={style.box+' '+style.box1}>
                            <div className={style.main}>
                                <span>{info.api_key}</span>
                                <Popover visible={info.api_key === this.state.copyCode } content="已复制">
                                    <Ficon onClick={this.copyKey} ref={ref=>this.copyDom = ref} className={style.copyButton +' copyButton'} type="copy" />
                                </Popover>
                            </div>
                            <span className={style.tips}>API Key</span>
                        </div>
                        <div className={style.box+' '+style.box2}>
                            <div className={style.main}>
                                <span>********</span>
                                <Popover visible={this.state.copySecret !== '' && !this.state.isModal} content="已复制">
                                    <Ficon  onClick={this.copySecret.bind(this,false)} className={style.copyButton +' copyButton'} type="copy" />
                                </Popover>
                                <Ficon className={style.eye} onClick={this.showSecret} type="eye-o" />
                            </div>
                            <span className={style.tips}>API Secret</span>
                        </div>
                        <div className={style.box+' '+style.box2}>
                            <div className={style.main}>
                                <span>{moment.unix(info.created_at).local().format('YYYY/MM/DD')}</span>
                            </div>
                            <span className={style.tips}>创建时间</span>
                        </div>
                        <div className={style.button}>
                            <Button onClick={this.onToggle} type={STATUS_MAPS[info.status].buttonType}>{STATUS_MAPS[info.status].buttonText}</Button>
                        </div>

                    </div>
                </Spin>
                <Modal
                    title="停用API Key"
                    footer={[<Button onClick={this.cancalWaring}>取消</Button>,<Button onClick={this.toggleApi} style={{marginLeft:'20px'}} type="primary" disabled={!this.state.makeSure}>确定</Button>]}
                    destroyOnClose={true}
                    visible={this.state.showWarning}
                    onCancel={this.cancalWaring}
                >
                    <div className={style.warningBox}>
                        <div className={style.warning}>
                            <Ficon className={style.warningIcon} type="exclamation-circle" />
                            <div className={style.warningMain}>
                                <span>您将停用API Key {info.name}，停用后，使用该API Key的服务，将不可用，您可以在需要的时候再次启用该API Key。</span>
                                <div><Checkbox onChange={this.onChange}><span style={{fontSize:14}}>确定停用 {ToLongName}</span></Checkbox></div>
                            </div>

                        </div>
                    </div>
                </Modal>


                <Modal
                    title='编辑API Key'
                    okText="保存"
                    visible={this.state.showEdit}
                    onOk={this.onEditApi}
                    onCancel={this.cancalWaringEdit}
                    destroyOnClose={true}
                >
                    <ApiKeyEdit info={info} ref={ref=>this.apiKeyEditRef = ref }/>
                </Modal>
                <Modal
                    title='API Secret'
                    okText="确定"
                    visible={this.state.isShowSecret}
                    footer={<Button onClick={this.onHideSecret} type="primary">确定</Button>}
                    onCancel={this.onHideSecret}
                    destroyOnClose={true}
                >
                    <span>{this.state.secret}</span>
                    <Popover getPopupContainer={() => document.getElementById('modalCopy')} visible={this.state.copySecret !=='' && this.state.isModal} content="已复制">
                        <Ficon id='modalCopy' onClick={this.copySecret.bind(this,true)} className={style.copyButton +' copyButton'} data-clipboard-text={this.state.secret} type="copy" />
                    </Popover>
                </Modal>
            </div>
        );
    }
};

export default Item;



// WEBPACK FOOTER //
// ./src/pages/ApiKey/Item.js