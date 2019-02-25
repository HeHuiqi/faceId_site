import React from 'react';
import {
    Switch,
    Redirect,
    Route
} from 'react-router-dom';
import BaseLayer from 'components/BaseLayer';
import AdminClientManage from 'pages/Admin/AdminClientManage';
import ClientAuthManage from 'pages/Admin/ClientAuthManage';
import Consumption from 'pages/Admin/Consumption';
import TranApproval from 'pages/Admin/TranApproval';
import ClientConsumption from 'pages/Admin/ClientConsumption';
import InformationManage from 'pages/Admin/InformationManage';
import InformationCreate from 'pages/Admin/InformationManage/Create';
import InformationUpdate from 'pages/Admin/InformationManage/Update';
import Coupon from 'pages/Admin/Coupon';
import CreateCoupon from 'pages/Admin/Coupon/Create';
import UpdateCoupon from 'pages/Admin/Coupon/Update';
import InvitationCode from 'pages/Admin/InvitationCode';
import InvitationCodeCreate from 'pages/Admin/InvitationCode/Manage/Create';
import Account from 'pages/Admin/Account/index';
import AccountCreate from 'pages/Admin/Account/Manage/create';
import AccountUpdate from 'pages/Admin/Account/Manage/update';
import Perms from 'pages/Admin/Perms/index';
import PermsCreate from 'pages/Admin/Perms/Manage/create';
import PermsUpdate from 'pages/Admin/Perms/Manage/update';
import PermsAccredit from 'pages/Admin/Perms/Manage/accredit';
import PermsView from 'pages/Admin/Perms/view';
import UpdatePassword from 'pages/Admin/ResetPassword';
import WrapAuth from './WrapAuth';
import InitialPage from './InitialPage';

//导航菜单
const menus = [
    { name: '用户管理', url: '/admin/pages/client' },
    { name: '用量', url: '/admin/pages/consumption' },
    { name: '订单管理', url: '/admin/pages/tran_approval' },
    { name: '消息管理', url: '/admin/pages/information' },
    { name: '代金券管理', url: '/admin/pages/coupon' },
    { name: '邀请码管理', url: '/admin/pages/invitation-code' },
    { name: '账号管理', key:'permission',icon:'',isSubMenu:true,
        sub:[
            { name: '账号管理', url: '/admin/pages/account'},
            { name: '角色管理', url: '/admin/pages/perms'},
            { name: '授权概览', url: '/admin/pages/perms/view'}
        ]
    },
];
class BaseRouter extends React.Component {

    constructor(props) {
        super(props);
        this.path = '';
        this.ComponentCatch = [];
    }
    componentWillReceiveProps(nextProps) {
        const { location, history: { action } } = nextProps;
        if (location !== this.props.location && action === 'PUSH') {
            window.scrollTo(0, 0);
        }

    }
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps === this.props && nextState === this.state){
            return false;
        }
        return true;
    }


    render() {
        const PageRoute = ({ component: Component, ...rest }) => {
            this.path = rest.path;
            const props = this.props;
            const path = this.path;
            let WrapAuthComponent;
            if (this.ComponentCatch[path]) {
                WrapAuthComponent = this.ComponentCatch[path];
            } else {
                WrapAuthComponent = WrapAuth(Component, props.account, path);
                this.ComponentCatch[path] = WrapAuthComponent;
            }

            return (
                <Route {...rest} render={() => {
                    return <InitialPage {...props} path={this.path}><WrapAuthComponent /></InitialPage>;
                }} />
            );
        };
        return (
            <BaseLayer isAdmin={true} menus={menus}>
                <Switch>
                    <PageRoute exact path='/admin/pages/client' component={AdminClientManage} />
                    <PageRoute exact path='/admin/pages/client/:id' component={ClientAuthManage} />
                    <PageRoute exact path='/admin/pages/consumption' component={Consumption} />
                    <PageRoute exact path='/admin/pages/consumption/:data' component={ClientConsumption} />
                    <PageRoute exact path='/admin/pages/tran_approval' component={TranApproval} />
                    <PageRoute exact path='/admin/pages/information' component={InformationManage} />
                    <PageRoute exact path='/admin/pages/information/create' component={InformationCreate} />
                    <PageRoute exact path='/admin/pages/information/update/:id' component={InformationUpdate} />
                    <PageRoute exact path='/admin/pages/coupon' component={Coupon} />
                    <PageRoute exact path='/admin/pages/coupon/create' component={CreateCoupon} />
                    <PageRoute exact path='/admin/pages/coupon/update/:id' component={UpdateCoupon} />
                    <PageRoute exact path='/admin/pages/invitation-code' component={InvitationCode} />
                    <PageRoute exact path='/admin/pages/:username/:serviceID/invitation-code' component={InvitationCode} />
                    <PageRoute exact path='/admin/pages/invitation-code/create' component={InvitationCodeCreate} />
                    <PageRoute exact path='/admin/pages/perms' component={Perms} />
                    <PageRoute exact path='/admin/pages/perms/create' component={PermsCreate} />
                    <PageRoute exact path='/admin/pages/perms/update/:id' component={PermsUpdate} />
                    <PageRoute exact path='/admin/pages/perms/accredit/:id' component={PermsAccredit} />
                    <PageRoute exact path='/admin/pages/perms/view' component={PermsView} />
                    <PageRoute exact path='/admin/pages/account' component={Account} />
                    <PageRoute exact path='/admin/pages/account/create' component={AccountCreate} />
                    <PageRoute exact path='/admin/pages/account/update/:id' component={AccountUpdate} />
                    <PageRoute exact path='/admin/pages/password/update' component={UpdatePassword}/>
                    <Redirect from='/admin/pages' to='/admin/pages/client' />
                </Switch>
            </BaseLayer>

        );
    }

}

export default BaseRouter;



// WEBPACK FOOTER //
// ./src/pages/AdminBaseRouter.js