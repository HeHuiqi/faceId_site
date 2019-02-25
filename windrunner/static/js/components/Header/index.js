import React from 'react';
import style from './index.less';
import PropTypes from 'prop-types';
import { Layout, Icon, Popover, Badge } from 'antd';
import { connect } from 'react-redux';
import { logout } from 'actions/account.js';
import {toUrl} from 'utils/tool.js';
import {getDocUrl} from 'utils/tool';
import { STATUS } from 'utils/const';
import { Link } from 'react-router-dom';
import Ficon from 'components/Ficon';
import {getUrl} from 'utils/tool.js';
import { withRouter } from 'react-router-dom';
const state_text = {
    [STATUS.UNCERTIFIED]:{name:'未认证',color:'#00A5E3'},
    [STATUS.TOCERTIFIED]:{name:'待审核',color:'#FFB100'},
    [STATUS.PASS]:{name:'已认证',color:'#00B11F'},
    [STATUS.DISMISSAL]:{name:'已驳回',color:'#FB3F3F'},
    [STATUS.FACEPLUSPLUS]: {name: 'Face++', color: '#02A5E2'}
};
const { Header } = Layout;

const TopMenu = (props) => {
    let item;
    const content = <Badge dot={props.badge} offset={[8,-8]}>
        <a {...props} className={style['base-nav-name']}>
            <Ficon type={props.icon} />
            <span style={{ paddingLeft: 5 }}>{props.name}</span>
            {props.content}
        </a>
    </Badge>;
    if(props.popContent){
        item = <Popover onVisibleChange={props.popoverChange} getPopupContainer={() => document.getElementById('main-header')} content={props.popContent} title="" trigger="click">{content}</Popover>;
    }else{
        item = content;
    }
    return (
        <div style={{display:'inline-block',position:'relative'}}>
            {item}
        </div>
    );
};

export class NewHeader extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            first:props.account?props.account.is_show_tips:false,
            userArrow:'caret-right'
        };
    }
    logout = () => {
        logout().then(e=>{
            if (this.props.isAdmin){
                toUrl('/admin/login');
                return;
            }
            toUrl('/login');
        });
    }
    open(url){
        toUrl(url);
    }

    jump(url){
        this.props.history.push(url);
    }

    onStatusClick=()=>{
        if( this.props.account && this.props.account.status === STATUS.UNCERTIFIED){
            this.props.history.push('/pages/auth');
        }
    }

    onCloseFirst = ()=>{
        this.setState({first:false});
    }
    checkShowStatus = ()=>{
        const account = this.props.account || {};
        return !this.props.isAdmin && (account.status === STATUS.PASS || account.status === STATUS.TOCERTIFIED);
    }

    popoverChange=(visible)=>{
        if(!visible){
            this.setState({userArrow:'caret-right'});
        }else{
            this.setState({userArrow:'caret-down'});
        }
    }


    render() {
        const account = this.props.account || {};

        const content = <div className={style['use-menu']}>
            {this.props.isAdmin?<Link to="/admin/pages/password/update"><span>修改密码</span></Link>:<Link to="/pages/home"><span>账号信息</span></Link>}
            {this.props.isAdmin?null:<Link to="/pages/auth"><span>企业信息</span></Link>}
            <a onClick={this.logout}><span>登出</span></a>
        </div>;
        const userContent = <Icon type={this.state.userArrow} style={{fontSize:12,transform:'scale(0.7,0.7)',color:'#00A5E3'}} />;
        const HeaderStyle = {  background: '#fff', padding: 0, position: 'fixed', zIndex: 9, left: 180, right: 0, boxShadow: '0 1px 4px rgba(0,21,41,.08)' ,...this.props.style};
        let userName,statuText;

        if(account.account_id){
            userName = [<TopMenu popoverChange={this.popoverChange} popContent={content} style={{paddingRight:'10px'}} from="ficon" icon="user" name={account.username} content={userContent}/>];

            // <Popover getPopupContainer={() => document.getElementById('main-header')} content={content} title="" trigger="click">
            //     <TopMenu style={{paddingRight:'10px'}} from="ficon" icon="user" name={account.email} content={userContent}/>
            // </Popover>];
            if(!this.props.isAdmin){
                statuText = <span className={style.userStatus}  style={{background:state_text[account.status].color}}>{state_text[account.status].name}</span>;
                if(account.status === STATUS.PASS || account.status === STATUS.TOCERTIFIED){
                    userName.push(statuText);
                }else if(account.platform === 'Face++') {
                    userName.push(<span className={style.userStatus}  style={{background:state_text[account.status].color}}>{state_text[STATUS.FACEPLUSPLUS].name}</span>);
                }
            }
        }else{
            userName = <TopMenu href={getUrl('/login')} icon="user" name="登录" />;
        }

        let first;
        if(this.state.first){
            first = <div className={style.firstPop}><div className={style.popArrow}></div><div className={style.popContent}>马上进行企业认证<Icon onClick={this.onCloseFirst} type="close-circle" /></div></div>;
        }

        let userTab = <div>{userName}</div>;

        if(!this.props.noUserTab && !this.props.isAdmin){
            userTab = <div>
                {account.status === STATUS.UNCERTIFIED || account.status === STATUS.DISMISSAL?[<TopMenu onClick={this.jump.bind(this,'/pages/auth')} other={first} icon="bag" name="企业认证" />,statuText]:null}
                <TopMenu onClick={this.jump.bind(this,'/pages/sdk_download')} icon="sdk" name="SDK下载" />
                <TopMenu target="_blank" href={getDocUrl('/docs/appface.html')} icon="file-text" name="文档中心" />
                <TopMenu onClick={this.jump.bind(this,'/pages/information')} icon="mail" name="消息中心" badge={this.props.hasNewMessage || false}/>
                {userName}
            </div>;
        }


        return (
            <Header style={HeaderStyle}>
                <div style={{ paddingRight:'30px',height: '100%', textAlign: 'right',marginLeft:'30px' }} id="main-header">
                    <div style={{float:'left',fontWeight:'bold',color:'#515666',fontSize:18}}>{this.props.useLogo?<a href={getUrl('/pages')}><img style={{width:91}} src={require('../../image/logo_blue.png')} alt=""/></a>:this.props.title}</div>
                    {userTab}
                </div>
            </Header>
        );
    }
}
NewHeader.contextTypes = {
    router: PropTypes.object
};
function select(state) {
    return {
        account: state.account.info,
        title:state.pageData.title,
    };
}

export default connect(select)(withRouter(NewHeader));



// WEBPACK FOOTER //
// ./src/components/Header/Overview.js