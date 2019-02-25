import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import config from 'config';
import IndexLayer from 'components/IndexLayer';
import LoginCheckLayer from 'components/LoginCheckLayer';
import ForgetPassword from 'pages/ForgetPassword';
import ResetPasswordOld from 'pages/ResetPasswordOld';
import Login from 'pages/Login';
import LoginFacepp from 'pages/Login/indexFacepp';
import AdminLogin from 'pages/Admin/AdminLogin';
import Register from 'pages/Register';
import Recharge from 'pages/Recharge';
import BaseRouter from './BaseRouter';
import AdminBaseRouter from './AdminBaseRouter';
import InitialPage from './InitialPage';
import Notfound from './Notfound';
import SecoundVerify from './SecoundVerify';
import Base from 'components/Base';
import BuyPackage from 'pages/BuyTimesPackage';
import LoginBindPhone from 'pages/LoginBindPhone';

class IndexRouter extends React.Component{

    componentDidCatch(){
        this.setState({ hasError: true });
    }

    render() {
        const IndexLayerWithExteriorRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={props => (
                <Base {...props}>
                    <IndexLayer {...props} {...rest}>
                        <InitialPage {...props} {...rest}>
                            <Component {...props} />
                        </InitialPage>
                    </IndexLayer>
                </Base>
            )} />
        );
        const FppIndexLayerWithExteriorRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={props => (
                <Base {...props}>
                    <IndexLayer imgSrc={require('../image/login-faceapp.png')}
                                leftStyle={{float: 'right',margin: '47px 90px 72px 40px', maxWidth: 407, height: 330}}
                                rightStyle={{margin: '52px 20px 50px 70px'}} {...props} {...rest}>
                        <InitialPage {...props} {...rest}>
                            <Component {...props} />
                        </InitialPage>
                    </IndexLayer>
                </Base>
            )} />
        );
        const LoginRoute = ({ component: Component, ...rest }) => {
            return (
                <Route exact {...rest} render={props => (
                    <Base {...props}>
                        <LoginCheckLayer isAdmin={rest.isAdmin}>
                            <Component {...props} />
                        </LoginCheckLayer>
                    </Base>
                )} />
            );
        };

        const NotMustLoginRoute = ({ component: Component, ...rest }) => {
            return (
                <Route exact {...rest} render={props => (
                    <LoginCheckLayer notMust={true}>
                        <Component {...props} />
                    </LoginCheckLayer>
                )} />
            );
        };
        return(
            <Router basename={config.basename}>
                <Switch>
                    <IndexLayerWithExteriorRoute path='/forget-password' component={ForgetPassword} />
                    <IndexLayerWithExteriorRoute path='/reset-password-faceid' component={ResetPasswordOld} />
                    <IndexLayerWithExteriorRoute path='/login' component={Login}/>
                    <FppIndexLayerWithExteriorRoute path='/facepp/login' component={LoginFacepp}/>
                    <FppIndexLayerWithExteriorRoute path='/facepp/bind-phone' component={LoginBindPhone}/>
                    <IndexLayerWithExteriorRoute path='/register' component={Register} />
                    <IndexLayerWithExteriorRoute path='/verify/:token' component={SecoundVerify} />
                    <IndexLayerWithExteriorRoute path='/admin/login' component={AdminLogin} />
                    <LoginRoute path='/pages/recharge' component={Recharge} />;
                    <LoginRoute exact strict path='/pages/buy_package' component={BuyPackage} />
                    <LoginRoute path='/pages' component={BaseRouter} />;
                    <LoginRoute isAdmin path='/admin/pages' component={AdminBaseRouter} />;
                    <NotMustLoginRoute component={Notfound}/>
                    {/* <Route component={SpecialNoFound} />; */}
                </Switch>
            </Router>
        );
    }
}

export default IndexRouter;



// WEBPACK FOOTER //
// ./src/pages/IndexRouter.js