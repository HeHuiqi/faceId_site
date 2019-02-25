import React from 'react';
import {Modal} from 'antd';
import BaseContent from 'components/BaseContent';
import { withRouter } from 'react-router-dom';
import CouponForm from './Form';
import {getCoupon,editCoupon} from 'actions/coupon';

class UpdateCoupon extends React.Component {
    state = {
        info:{},
        loading:true
    };

    componentDidMount(){
        //获取修改的代金券信息
        getCoupon({id:this.props.match.params.id}).then(res=>{
            this.setState({info:res.data,loading:false});
        });
    }

    onSubmit = (params)=> {
        const _params = {
            tags:params.tags,
            id:this.props.match.params.id
        };
        editCoupon(_params).then(res=>{
            Modal.success({
                title:'修改成功',
                onOk:()=>{
                    this.props.history.push('/admin/pages/coupon');
                }
            });
        });
    }

    render() {
        return (
            <div>
                <BaseContent>
                    <CouponForm
                        onSubmit={this.onSubmit}
                        type="update"
                        info={this.state.info}
                        loading={this.state.loading}
                        id={this.props.match.params.id}/>
                </BaseContent>
            </div>
        );
    }
}

export default withRouter(UpdateCoupon);



// WEBPACK FOOTER //
// ./src/pages/Admin/Coupon/Update.js