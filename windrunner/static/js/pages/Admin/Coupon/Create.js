import React from 'react';
import BaseContent from 'components/BaseContent';
import { withRouter } from 'react-router-dom';
import CouponForm from './Form';
import {createCoupon} from 'actions/coupon';
import {Modal} from 'antd';

class CreateCoupon extends React.Component {
    state = {

    };
    onSubmit = (params)=> {
        createCoupon(params).then((res)=>{
            if(res.data.invalid_usernames === ''){
                this.props.history.push('/admin/pages/coupon');
            }else{
                Modal.warn({
                    title:'创建成功',
                    content:'以下用户关联失败：' + res.data.invalid_usernames,
                    onOk:()=>{
                        this.props.history.push('/admin/pages/coupon');
                    }
                });
            }

        });
    }
    render() {
        return (
            <div>
                <BaseContent>
                    <CouponForm onSubmit={this.onSubmit} type="create"/>
                </BaseContent>
            </div>
        );
    }
}

export default withRouter(CreateCoupon);



// WEBPACK FOOTER //
// ./src/pages/Admin/Coupon/Create.js