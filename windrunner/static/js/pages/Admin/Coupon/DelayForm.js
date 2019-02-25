
import React from 'react';
import {Modal, DatePicker, Form } from 'antd';
import style from './index.less';
import moment from 'moment';

const FormItem = Form.Item;


class Delay extends React.Component {

    onOk = ()=> {
        this.props.form.validateFields((err, values)=> {
            if (!err) {
                const params = {
                    stime:values['start_at'].format('YYYY-MM-DD'),
                    etime:values['end_at'].format('YYYY-MM-DD')
                };
                this.props.onDelay(params);
            }
        });
    }

    disabledStartDate = (current)=> {
        return current && current < moment().startOf('day');
    }

    disabledEndDate = (current)=> {
        let start_date = this.props.form.getFieldValue('start_at');
        start_date = start_date ? start_date : moment().startOf('day');
        return current && current < start_date;
    }
    onDateChange = (start_date)=> {
        const end_date = this.props.form.getFieldValue('end_at');
        if (end_date && !end_date.isAfter(start_date)) {
            this.props.form.setFieldsValue({'end_at': null});
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const FormItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {
                span: 8
            }
        };
        return (
            <Modal
                visible={this.props.visible}
                onCancel={this.props.hideModal}
                destroyOnClose={true}
                onOk={this.onOk}
                title={<div>批量延期<span className={style.extra}>{this.props.count}个代金券有效期修改</span></div>}>
                <Form>
                    <FormItem label="生效时间" {...FormItemLayout}>
                        {getFieldDecorator('start_at', {
                            rules: [{required: true, message: '生效时间不能为空'}]
                        })(
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder="请选择时间"
                                disabledDate={this.disabledStartDate}
                                onChange={this.onDateChange}
                                style={{width: 180}}
                            />
                        )}
                    </FormItem>
                    <FormItem label="到期时间" {...FormItemLayout}>
                        {getFieldDecorator('end_at', {
                            rules: [{required: true, message: '到期时间不能为空'}]
                        })(
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder="请选择时间"
                                disabledDate={this.disabledEndDate}
                                style={{width: 180}}
                            />
                        )}
                    </FormItem>

                </Form>
            </Modal>
        );
    }
}
const DelayForm =  Form.create({})(Delay);
export default DelayForm;



// WEBPACK FOOTER //
// ./src/pages/Admin/Coupon/DelayForm.js