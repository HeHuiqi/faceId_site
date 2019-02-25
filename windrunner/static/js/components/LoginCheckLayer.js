import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAccountInfo } from 'actions/account';
import {toUrl} from 'utils/tool.js';
import {getKF} from 'actions/other';

class LoginCheckLayer extends React.Component {

    constructor(props) {
        super(props);
        if (!this.props.account) {
            this.props.getAccountInfo(this.props.isAdmin,this.props.notMust);
        }
        this.hasLoad = false;
    }
    componentWillReceiveProps(props){
        if(!this.hasLoad && props.account && !this.props.isAdmin){
            this.hasLoad = true;
            getKF().then(res=>{
                const script = document.createElement('script');
                script.src = '//assets-cdn.kf5.com/supportbox/main.js?' + (new Date()).getDay();
                script.id = 'kf5-provide-supportBox';
                script.setAttribute('kf5-domain','megvii.kf5.com');
                script.setAttribute('charset','utf-8');
                script.addEventListener('load', ()=>{
                    window.KF5SupportBoxAPI.ready(function()
                    {
                        window.KF5SupportBoxAPI.identify({
                            'name' : 'FaceID-'+props.account.username,
                            'email': props.account.email,
                            'phone': props.account.phone
                        });
                        window.KF5SupportBoxAPI.setAgents(res.data, true);
                    });
                    window.KF5SupportBoxAPI.init();
                }, false);
                document.head.appendChild(script);
            });
        }
    }

    render() {

        if(this.props.notMust){
            return this.props.children;
        }

        if (!this.props.account) {
            return <div></div>;
        }
        if (this.props.account && !this.props.account.account_id) {
            const jump = this.props.isAdmin ? '/admin/login?next=':'/login?next=';
            toUrl(jump + encodeURIComponent(window.location.pathname));
            return <div></div>;
        }
        return this.props.children;
    }

}

function select(state) {
    return {
        account: state.account.info
    };
}


function mapDispatchToProps(dispatch) {
    return {
        getAccountInfo: bindActionCreators(getAccountInfo, dispatch)
    };
}

export default connect(select, mapDispatchToProps)(LoginCheckLayer);



// WEBPACK FOOTER //
// ./src/components/LoginCheckLayer.js