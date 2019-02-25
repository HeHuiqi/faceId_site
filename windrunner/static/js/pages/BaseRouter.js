import React from 'react';
import {
    Switch,
    Redirect,
    Route
} from 'react-router-dom';
import BaseLayer from 'components/BaseLayer';
import ApiKey from 'pages/ApiKey';
import Home from 'pages/Home';
import Authentication from 'pages/Authentication';
import WrapAuth from './WrapAuth';
import InitialPage from './InitialPage';
import Financial from 'pages/Financial';
import Order from 'pages/Order';
import Index from 'pages/Index';
import Invoice from 'pages/Invoice';
import ScResult from 'pages/ProductSc/Result';
import ScStatistics from 'pages/ProductSc/Statistics';
import ScOverview from 'pages/ProductSc/Overview';
import IdCardOverview from 'pages/ProductIdCard/Overview';
import IdCardStatistics from 'pages/ProductIdCard/Statistics';
import IdCardResult from 'pages/ProductIdCard/Result';
import UcOverview from 'pages/ProductUc/Overview';
import UcStatistics from 'pages/ProductUc/Statistics';
import UcResult from 'pages/ProductUc/Result';
import SDKDownload from 'pages/SDKDownload';
import Information from 'pages/Information';
import VoucherManage from 'pages/VoucherManage';
import TimesPackageConsumption from 'pages/TimesPackageConsumption';
import TimesPackageManage from 'pages/TimesPackageManage';


//导航菜单
const menus = [
    { name: '概览', url:'/pages/index',icon:'home'},
    { name: '人脸核身', key:'auth',icon:'renlianheshen',isSubMenu:true,
        sub:[
            { name: '产品概述', url: '/pages/sc_overview'},
            { name: '数据概览', url: '/pages/sc_statistics'},
            { name: '结果查询', url: '/pages/sc_result'}
        ]
    },
    { name: '人脸比对', key:'unsource_auth',icon:'renlianbidui',isSubMenu:true,
        sub:[
            { name: '产品概述', url: '/pages/uc_overview'},
            { name: '数据概览', url: '/pages/uc_statistics'},
            { name: '结果查询', url: '/pages/uc_result'}
        ]
    },
    { name: '身份证识别', key:'ocr',icon:'shenfenzhengshibie',isSubMenu:true,
        sub:[
            { name: '产品概述', url: '/pages/idcard_overview'},
            { name: '数据概览', url: '/pages/idcard_statistics'},
            { name: '结果查询', url: '/pages/idcard_result'}
        ]
    },
    { name: 'API Key管理', url:'/pages/api_key',icon:'apikey'},
    { name: '财务中心', key:'financial',isSubMenu:true,icon:'pay-circle-o',
        sub:[
            { name: '账户余额', url: '/pages/financial'},
            { name: '充值记录', url: '/pages/order'},
            { name: '代金券管理', url: '/pages/voucher_manage'},
            { name: '资源包管理', url: '/pages/resource_package_manage'},
            { name: '发票申请', url: '/pages/invoice'}
        ]
    }
];
class BaseRouter extends React.Component {

    constructor(props) {
        super(props);
        this.path = '';
        this.ComponentCatch = [];
    }

    // componentDidCatch(){
    //     debugger;
    // }

    shouldComponentUpdate(nextProps,nextState){
        if(nextProps === this.props && nextState === this.state){
            return false;
        }
        return true;
    }

    componentWillReceiveProps(nextProps) {
        const { location, history: { action } } = nextProps;
        if (location !== this.props.location && action === 'PUSH') {
            window.scrollTo(0, 0);
        }
    }

    render() {
        const PageRoute = ({ component: Component, ...rest }) => {
            this.path = rest.path;
            const props = this.props;
            const path =  this.path;
            let WrapAuthComponent;
            if (this.ComponentCatch[path]){
                WrapAuthComponent = this.ComponentCatch[path];
            }else{
                WrapAuthComponent = WrapAuth(Component, props.account, path);
                this.ComponentCatch[path] = WrapAuthComponent;
            }

            return (
                <Route {...rest} render={()=> {
                    return <InitialPage {...props} path={this.path}><WrapAuthComponent /></InitialPage>;
                }} />
            );
        };

        return (
            <BaseLayer menus={menus}>
                <Switch>
                    <PageRoute exact path='/pages/index' component={Index} />
                    <PageRoute exact path='/pages/api_key' component={ApiKey} />
                    <PageRoute exact strict path='/pages/auth' component={Authentication} />
                    <PageRoute exact strict path='/pages/financial' component={Financial} />
                    <PageRoute exact strict path='/pages/home' component={Home} />
                    <PageRoute exact strict path='/pages/order' component={Order} />
                    <PageRoute exact strict path='/pages/invoice' component={Invoice} />
                    <PageRoute exact strict path='/pages/sc_result' component={ScResult} />
                    <PageRoute exact strict path='/pages/sc_statistics' component={ScStatistics} />
                    <PageRoute exact strict path='/pages/sc_overview' component={ScOverview} />
                    <PageRoute exact strict path='/pages/idcard_overview' component={IdCardOverview} />
                    <PageRoute exact strict path='/pages/idcard_statistics' component={IdCardStatistics} />
                    <PageRoute exact strict path='/pages/idcard_result' component={IdCardResult} />
                    <PageRoute exact strict path='/pages/uc_overview' component={UcOverview} />
                    <PageRoute exact strict path='/pages/uc_statistics' component={UcStatistics} />
                    <PageRoute exact strict path='/pages/uc_result' component={UcResult} />
                    <PageRoute exact strict path='/pages/sdk_download' component={SDKDownload} />
                    <PageRoute exact strict path='/pages/information' component={Information} />
                    <PageRoute exact strict path='/pages/voucher_manage' component={VoucherManage} />
                    <PageRoute exact strict path='/pages/resource_package_manage' component={TimesPackageManage} />
                    <PageRoute exact strict path='/pages/resource_package_consumption/:id' component={TimesPackageConsumption} />
                    <Redirect from='/pages' to='/pages/index' />
                </Switch>
            </BaseLayer>

        );
    }

}

export default BaseRouter;



// WEBPACK FOOTER //
// ./src/pages/BaseRouter.js