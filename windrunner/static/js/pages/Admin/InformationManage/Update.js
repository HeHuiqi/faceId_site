import React from 'react';
import { Modal} from 'antd';
import { withRouter } from 'react-router-dom';
import BaseContent from 'components/BaseContent';
import InfoForm from './InfoForm';
import {updateMessage, getMessageById} from 'actions/information';


class UpdateInformation extends React.Component {
    state = {
        loading: false,
        formData: null
    };
    componentWillMount() {
        const that = this;
        getMessageById({id: this.props.match.params.id}).then((message)=> {
            that.setState({formData: message.data});
        }).catch(()=> {

        });
    }

    onSubmit = (params) => {

        this.setState({loading: true});
        params['id'] = this.props.match.params.id;
        updateMessage(params).then((res)=> {
            const modal = Modal.success({
                title: '修改成功！',
                content: '5秒后自动跳转页面...',
            });
            setTimeout(() => {
                modal.destroy();
                this.props.history.push('/admin/pages/information');
            }, 5000);
        }).catch(()=> {

        }).then(()=> {
            this.setState({loading: false});
        });

    }

    render() {
        return (
            <BaseContent>
                <InfoForm
                    type="update"
                    loading={this.state.loading}
                    formData={this.state.formData}
                    onSubmit={this.onSubmit}/>
            </BaseContent>
        );
    }

}
export default withRouter(UpdateInformation);



// WEBPACK FOOTER //
// ./src/pages/Admin/InformationManage/Update.js