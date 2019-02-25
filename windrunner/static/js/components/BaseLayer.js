import React from 'react';
import style from './BaseLayer.less';
import PropTypes from 'prop-types';
import { Layout, Menu, Modal, Button} from 'antd';
import Ficon from 'components/Ficon';
import Breadcrumbs from './Breadcrumbs';
import Header from './Header';
import Footer from './Footer';
import Jump from 'components/Jump';
import {getNewMessage} from 'actions/information';

const { Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const httpUrl = /^http/;

class BaseLayer extends React.Component {

    state = {
        collapsed: false,
        hasNewMessage: false,
        messageList: []
    };

    onViewMessage = ()=> {
        // TODO:调用接口设置消息已读
        this.setState({hasNewMessage: false});
        this.context.router.history.push('/pages/information');
    }
    onCloseMessageBox = ()=> {
        this.setState({hasNewMessage: false});
    }


    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    onMenuClick = (item) => {
        if(!httpUrl.test(item.key)){
            this.context.router.history.push(item.key);
            this.setState({ defaultMenu: item.key });
            // toUrl(item.key);
        }else{
            window.open(item.key);
        }
    }
    onOpenChange = (item)=>{
        this.setState({ defaultMenuSub: item });
    }

    componentDidUpdate(){
        const route = this.context.router.route;
        const pathname = route.location.pathname;
        if (this.state.defaultMenu !== pathname){
            const defaultSub = this.getParents(pathname);
            this.setState({ defaultMenu: pathname, defaultMenuSub: defaultSub});
        }
    }

    getParents(pathname){
        const defaultSub = [];
        this.props.menus.forEach(element => {
            if (element.isSubMenu) {
                element.sub.forEach(sub => {
                    if (sub.url ===pathname) {
                        defaultSub.push(element.key);
                    }
                });
            }
        });
        return defaultSub;
    }
    componentWillMount(){
        const route = this.context.router.route;
        const pathname = route.location.pathname;
        if (!this.props.isAdmin) {
            getNewMessage().then((res)=> {
                const data = res && res.data;
                this.setState({
                    hasNewMessage: data.new_message_number > 0,
                    messageList: data.msg
                });
            });
        }
        this.setState({
            defaultMenu: pathname,
            defaultMenuSub: this.getParents(pathname)
        });

    }
    renderMessageModel() {
        if (this.props.isAdmin) {
            return;
        }
        return  (
            <Modal
                wrapClassName={style.messageBox}
                visible={this.state.hasNewMessage}
                maskClosable={false}
                onOk={this.onViewMessage}
                onCancel={this.onCloseMessageBox}
                footer= {null}
            >
                <div className={style.messageIcon}>
                    <img src={require('../image/information.png')}/>
                </div>
                <h1 className={style.title}>您有<span>{this.state.messageList.length}</span>条未读信息</h1>
                <ul className={style.messages}>
                    {this.state.messageList.map((item, index)=> {
                        if (index<=2) {
                            return <li className={style.item} key={index}>{item}</li>;
                        }
                        if (index === 3) {
                            return <li className={style.overflow}>......</li>;
                        }
                        return null;
                    })}
                </ul>
                <div className={style.footer}><Button type="primary" onClick={this.onViewMessage}>立即查看</Button></div>
            </Modal>
        );
    }

    render() {
        return (
            <Layout style={{minHeight:'100%',minWidth:'1280px'}}>
                <Sider
                    width={180}
                    style={{ overflow: 'auto', height: '100%', position: 'fixed', left: 0,zIndex:2,background:'#282830' }}
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}>
                    <div className={style.logo} >
                        <Jump href={this.props.isAdmin?'/admin/pages':'/pages'}>
                            <img src={require('../image/logo.svg')} alt="" />
                        </Jump>
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        openKeys={this.state.defaultMenuSub}
                        selectedKeys={[this.state.defaultMenu]}
                        onOpenChange={this.onOpenChange}
                        onClick={this.onMenuClick}>
                        {this.props.menus.map(item=>{
                            if(item.isSubMenu){
                                return <SubMenu key={item.key} title={<span><Ficon style={{marginRight:'7px',fontSize:'16px'}}  type={item.icon} /><span>{item.name}</span></span>}>
                                    {item.sub.map(sub=>{
                                        return <Menu.Item key={sub.url}><div>{sub.name}</div></Menu.Item>;
                                    })}
                                </SubMenu>;
                            }
                            return <Menu.Item key={item.url}>
                                <Ficon style={{marginRight:'7px',fontSize:'16px'}} type={item.icon} />
                                <span>{item.name}</span>
                            </Menu.Item>;
                        })}

                    </Menu>
                </Sider>
                <Header isAdmin={this.props.isAdmin} hasNewMessage={this.state.hasNewMessage}/>
                <Layout style={{ marginLeft: 180, marginTop: 64,position:'relative',paddingBottom:75}}>
                    <Breadcrumbs location={this.props.location} />
                    <Content style={{ margin: '0 30px',position:'relative' }}>
                        {this.props.children}
                    </Content>
                    <Footer />
                    {this.renderMessageModel()}
                </Layout>
            </Layout>
        );
    }
}
BaseLayer.contextTypes = {
    router: PropTypes.object
};

export default BaseLayer;



// WEBPACK FOOTER //
// ./src/components/BaseLayer.js