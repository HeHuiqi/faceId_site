import React from 'react';
import {Link} from 'react-router-dom';
import style from './index.less';
import LoginForm from './Loginform';
import { login } from 'actions/accountMiddle';

class Login extends React.Component {
    config = {
        key: 'faceid',
        field_username_placeholder: '请输入用户名',
        field_password_placeholder: '请输入6-20位密码',
        field_username_required_msg: '请输入用户名',
        field_password_required_msg: '请输入密码',
        submit_button_text: '登录',
        link_to: true
    };

    render() {
        return (
            <div>
                <LoginForm
                    ref={ref => this.faceIDForm = ref}
                    config={this.config}
                    title="欢迎使用 FaceID 服务"
                    link={<div className={style.link}><span>其他方式登录：</span><Link to="/facepp/login">Face++账号</Link></div>}
                    doLogin={login}/>
            </div>
        );
    }

}

export default Login;



// WEBPACK FOOTER //
// ./src/pages/Login/Overview.js