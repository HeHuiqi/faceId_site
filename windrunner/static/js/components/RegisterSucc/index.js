import React from 'react';
import { Icon, Button } from 'antd';
import style from './index.less';
import {toUrl} from 'utils/tool.js';

class RegisterSucc extends React.Component {

    onJump = ()=>{
        toUrl('/pages/api_key');
    }
    render() {
        return (
            <div className={style.main}>
                <Icon type="check-circle"/>
                <h2>注册成功</h2>
                <p>{this.props.time}s后自动跳转至用户登录页面</p>
                <Button type="primary" onClick={this.onJump}>立即跳转</Button>
            </div>
        );
    }

}

export default RegisterSucc;



// WEBPACK FOOTER //
// ./src/components/RegisterSucc/Overview.js