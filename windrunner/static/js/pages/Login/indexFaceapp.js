import React from 'react';
import {Link} from 'react-router-dom';
import style from './index.less';
import LoginForm from './Loginform';
import { facePlusPlusLogin} from 'actions/account';

class Login extends React.Component {
    config = {
        key: 'face++',
        field_username_placeholder: '请输入Face++账户名',
        field_password_placeholder: '请输入6-20位Face++登录密码',
        field_username_required_msg: '请输入Face++账户名',
        field_password_required_msg: '请输入Face++登录密码',
        submit_button_text: '确认授权',
        link_to: false
    };
    render() {
        return (
            <div>
                <LoginForm
                    ref={ref=> this.faceIDPlusPlusForm = ref}
                    type="facepp"
                    config={this.config}
                    title="欢迎使用Face++账号登录"
                    link={<div className={style.link}><span>返回 </span><Link to="/login">FaceID登录</Link></div>}
                    doLogin={facePlusPlusLogin}/>
            </div>
        );
    }

}

export default Login;



// WEBPACK FOOTER //
// ./src/pages/Login/indexFacepp.js