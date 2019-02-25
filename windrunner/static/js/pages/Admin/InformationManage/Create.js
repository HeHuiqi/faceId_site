import React from 'react';
import { Modal} from 'antd';
import { withRouter } from 'react-router-dom';
import BaseContent from 'components/BaseContent';
import InfoForm from './InfoForm';
import {createMessage, sendMessage} from 'actions/information';



class CreateInformation extends React.Component {
    state = {
        loading: false,
    };
    onSubmit = (params) => {

        this.setState({loading: true});
        const that = this;
        function backToMessageList() {
            const modal = Modal.success({
                title: '发送成功！',
                content: '5秒后自动跳转页面...',
                onOk() {
                    that.props.history.push('/admin/pages/information');
                    clearTimeout(timer);
                }
            });

            const timer = setTimeout(() => {
                modal.destroy();
                that.props.history.push('/admin/pages/information');
            }, 5000);
        }
        if (params && params.content_type === 'dx') {
            sendMessage(params).then(()=> {
                backToMessageList();
            }).catch(()=> {

            }).then(()=> {
                that.setState({loading: false});
            });
        }else {
            createMessage(params).then((res)=> {
                backToMessageList();
            }).catch(()=> {

            }).then(()=> {
                that.setState({loading: false});
            });
        }

    }
    render() {
        return (

            <BaseContent>
                <InfoForm
                    type="create"
                    loading={this.state.loading}
                    onSubmit={this.onSubmit}/>
            </BaseContent>
        );
    }

}

export default withRouter(CreateInformation);



// WEBPACK FOOTER //
// ./src/pages/Admin/InformationManage/Create.js