import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Input, Form, Spin } from 'antd';
import { bindActionCreators } from 'redux';
import BaseContent from 'components/BaseContent';
import AuthenticationForm from 'components/AuthenticationForm';
import { getAuthByClientId, changeAuthStateByClientId } from 'actions/adminAuthManage';
import { setBreadcrumb } from 'actions/pageData';
import style from './index.less';
import { STATUS } from 'utils/const';
const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
    },
};

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authed: false,
            showReject:false,
            authInfo: null
        };
        this.toState = '';
    }

    componentWillMount() {
        getAuthByClientId(this.props.match.params.id).then(res=>{
            this.props.setBreadcrumb({ name: res.data.username });
            this.setState({ authInfo: res.data});
        });

    }

    onClick(toState){
        this.toState = toState;
        const { status, reject_reason } = this.state.authInfo;
        if (status === STATUS.DISMISSAL){
            Modal.warning({
                title: '驳回原因',
                content: reject_reason,
            });
            return;
        }
        if (toState === STATUS.DISMISSAL ){
            this.setState({ showReject:true});
            return;
        }
        if(toState === STATUS.PASS){
            Modal.confirm({
                title: '确认通过认证',
                // content: '',
                onOk:()=>{
                    this.refresh('accept');
                },
                onCancel() {},
            });
        }
    }
    onReject = ()=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.refresh('reject',values['reason']);
            }
        });
    }
    refresh(type,reason){
        changeAuthStateByClientId(this.props.match.params.id, type, reason).then(res => {
            const authInfo = { ...this.state.authInfo };
            authInfo.status = this.toState;
            authInfo.reject_reason = reason;
            this.setState({ authInfo, showReject:false });
        }).catch(()=>{
            this.setState({ showReject: false });
        });
    }

    onCancel = () => {
        this.setState({showReject:false});
    }

    render() {
        let status_text = '';
        let button = [];
        if (!this.state.authInfo) {
            return <Spin key={1} tip="加载中..." ><BaseContent /></Spin>;
        }
        const { status } = this.state.authInfo;
        switch (status) {
            case STATUS.TOCERTIFIED:
                status_text = '待审核（以下内容不可修改）';
                button = [
                    <Button type="primary" onClick={this.onClick.bind(this, STATUS.PASS)}>通过认证</Button>,
                    <Button type="primary" onClick={this.onClick.bind(this, STATUS.DISMISSAL)}>驳回认证</Button>
                ];
                break;
            case STATUS.PASS:
                status_text = '通过认证（以下内容不可修改）';
                break;
            case STATUS.DISMISSAL:
                status_text = '已驳回（以下内容不可修改）';
                button = [
                    <Button type="primary" onClick={this.onClick.bind(this)}>查看驳回原因</Button>
                ];
                break;
            default:
                break;
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className={style.statusBar}>
                    <div className={style.title}>状态：{status_text}</div>
                    <div className={style.button}>
                        {button}
                    </div>
                </div>
                <AuthenticationForm authInfo={this.state.authInfo} isAdmin eiditable={false}/>
                <Modal
                    title="请输入驳回原因"
                    visible={this.state.showReject}
                    okText="确定驳回"
                    onOk={this.onReject}
                    onCancel={this.onCancel}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="驳回理由"
                        >
                            {getFieldDecorator('reason', {
                                rules: [
                                    { required: true, message: '请至少输入五个字符' },
                                    { min: 5, message: '请至少输入五个字符' }
                                ],
                            })(
                                <TextArea placeholder="请至少输入五个字符" id="error" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );

    }
}
function mapDispatchToProps(dispatch) {
    return {
        setBreadcrumb: bindActionCreators(setBreadcrumb, dispatch)
    };
}
const AuthenticationWap = Form.create()(Authentication);
const AuthenticationRedux = connect(null, mapDispatchToProps)(AuthenticationWap);
export default withRouter(AuthenticationRedux);



// WEBPACK FOOTER //
// ./src/pages/Admin/ClientAuthManage/Overview.js