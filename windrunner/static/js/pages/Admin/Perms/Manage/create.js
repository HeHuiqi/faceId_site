import React from 'react';
import { withRouter } from 'react-router-dom';
import BaseContent from 'components/BaseContent';
import PermsForm from './PermsForm';
import { createRole } from 'actions/permission';
import { Modal } from 'antd';


class PermsCreate extends React.Component {
    onSubmit = (params)=> {

        createRole(params).then(e=> {
            Modal.success({
                title: '创建角色成功',
                onOk: ()=> {
                    this.props.history.push('/admin/pages/perms');
                }
            });
        });
    }
    render() {
        return (
            <BaseContent>
                <PermsForm
                    history={this.props.history}
                    onSubmit={this.onSubmit}/>
            </BaseContent>
        );
    }
}
export default withRouter(PermsCreate);



// WEBPACK FOOTER //
// ./src/pages/Admin/Perms/Manage/create.js