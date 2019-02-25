import React from 'react';
import { withRouter } from 'react-router-dom';
import BaseContent from 'components/BaseContent';
import PermsForm from './PermsForm';
import {getPermissionOfRole, updateRole} from 'actions/permission';
import { Modal } from 'antd';

class PermsUpdate extends React.Component {
    state = {
        selectedFuncPerms: [],
        selectedDataPerms: []
    };
    onSubmit = (params)=> {
        if (Object.keys(params).length === 0) {
            this.props.history.push('/admin/pages/perms');
            return;
        }
        const originValues = Object.assign({}, this.role, {permissions: ''});
        for (const key in originValues) {
            if (params.hasOwnProperty(key) && params[key] === originValues[key]) {
                delete params[key];
            }
        }

        updateRole(this.props.match.params.id, params).then(e=> {
            Modal.success({
                title: '角色编辑成功',
                onOk: ()=> {
                    this.props.history.push('/admin/pages/perms');
                }
            });
        });
    }

    componentWillMount() {
        getPermissionOfRole(this.props.match.params.id).then(res=> {
            const data = res.data,
                selectedFuncPerms = data.permissions.filter(ele=> ele.perm_type === 0).map(perm=> perm.id),
                selectedDataPerms = data.permissions.filter(ele=> ele.perm_type === 1).map(perm=> perm.id);

            const role = {
                name: data.name,
                description: data.description,
                func_perms: selectedFuncPerms,
                data_perms: selectedDataPerms
            };
            this.role = {
                name: data.name,
                description: data.description
            };
            this.setState({selectedFuncPerms, selectedDataPerms});
            this.permsForm.setFieldsValue(role);

        }).catch(err=> {

        });
    }
    render() {
        return (
            <BaseContent>
                <PermsForm
                    history={this.props.history}
                    ref={ref=> this.permsForm = ref}
                    onSubmit={this.onSubmit}
                    selectedFuncPerms={this.state.selectedFuncPerms}
                    selectedDataPerms={this.state.selectedDataPerms}
                />
            </BaseContent>
        );
    }
}
export default withRouter(PermsUpdate);



// WEBPACK FOOTER //
// ./src/pages/Admin/Perms/Manage/update.js