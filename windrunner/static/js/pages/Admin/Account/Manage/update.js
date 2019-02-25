import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal } from 'antd';
import BaseContent from 'components/BaseContent';
import AccountForm from './AccountForm';
import {getAccountById, editAccount} from 'actions/permission';

class AccountUpdate extends React.Component {
    state = {
        selectedRowKeys: [], //账号拥有的角色ID列表
    };
    account = null;
    onSubmit = (values)=> {
        const originValues = this.account;

        originValues['roles'] = originValues['roles'].sort((a,b)=> a>b).join(',');

        if (!values['roles'] || values['roles'].length === 0) {
            values['roles'] = '';
        }else {
            values['roles'] = values['roles'].sort((a,b)=> a>b).join(',');
        }

        for (const key in originValues) {
            if (values.hasOwnProperty(key) && originValues[key] === values[key]) {
                delete values[key];
            }
        }

        editAccount(this.props.match.params.id, values).then(e=> {
            Modal.success({
                title: '账号编辑成功',
                onOk: ()=> {
                    this.props.history.push('/admin/pages/account');
                }
            });
        });
    }
    componentDidMount() {
        getAccountById(this.props.match.params.id).then(e=> {
            const formData = Object.assign({}, e.data, {roles: e.data.roles.map(ele=> ele.id)});
            this.accountForm.setFieldsValue(formData);
            this.account = Object.assign({}, e.data, {roles: e.data.roles.map(ele=> ele.id)});

        }).catch(err=> {

        });
    }

    render() {
        return (
            <BaseContent>
                <AccountForm
                    ref={ref=> this.accountForm = ref}
                    type="update"
                    onSubmit={this.onSubmit}
                />
            </BaseContent>
        );
    }
}

export default withRouter(AccountUpdate);



// WEBPACK FOOTER //
// ./src/pages/Admin/Account/Manage/update.js