import React from 'react';
import { withRouter } from 'react-router-dom';
import BaseContent from 'components/BaseContent';
import AccountForm from './AccountForm';
import {createAccount} from 'actions/permission';
import { Modal } from 'antd';

class AccountCreate extends React.Component {
    state = {

    };
    onSubmit = (values)=> {
        if (!values['roles'] || values['roles'].length === 0) {
            delete values['roles'];
        }else {
            values['roles'] = values['roles'].sort((a,b)=> a>b).join(',');
        }

        createAccount(values).then(e=> {
            Modal.success({
                title: '账号创建成功',
                onOk: ()=> {
                    this.props.history.push('/admin/pages/account');
                }
            });
        }).catch(e=> {

        });
    }

    render() {
        return (
            <BaseContent>
                <AccountForm
                    onSubmit={this.onSubmit}
                />
            </BaseContent>
        );
    }
}

export default withRouter(AccountCreate);



// WEBPACK FOOTER //
// ./src/pages/Admin/Account/Manage/create.js