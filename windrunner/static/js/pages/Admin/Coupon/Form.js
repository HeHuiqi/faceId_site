import React from 'react';
import { Form, DatePicker, Select, Input, InputNumber, Button, Spin, Radio } from 'antd';
import Tags from 'components/Tags';
import moment from 'moment';
import style from './index.less';
import Voucher from 'components/Voucher';
import {getCouponApprovers} from 'actions/coupon';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const COUPON_TYPE_OPTIONS = [
    {lable: '满送', value: 1}
];
const TEMPlATE_OPTIONS = [
    {lable: '自定义', value: 0},
    {lable: '满10000送1000', value: 1}
];
const TEMPlATE = {
    0:{amount:null,rule:null},
    1:{amount:1000,rule:10000}
};

class CouponManage extends React.Component {

    constructor(props){
        super(props);
        this.isUp = props.type === 'update';
        this.state = {
            isTemplete:false,
            loading:false,
            approverList:[]
        };
    }
    componentDidMount(){
        if(!this.state.isTemplete){
            //获取审批人
            this.setState({loading:true});
            getCouponApprovers().then(res=>{
                this.setState({isTemplete:false,approverList:res.data,loading:false});
            });
        }
    }
    disabledStartDate = (current)=> {
        return current && current < moment().startOf('day');
    }
    disabledEndDate = (current)=> {
        let start_at = this.props.form.getFieldValue('stime');
        start_at = start_at ? start_at : moment().startOf('day');
        return current && current < start_at;
    }
    onDateChange = (start_at)=> {
        const end_at = this.props.form.getFieldValue('etime');
        if (end_at && !end_at.isAfter(start_at)) {
            this.props.form.setFieldsValue({'etime': null});
        }
    }
    onSubmit = (e)=> {
        e.preventDefault();
        this.props.form.validateFields((error, values)=> {
            if (!error) {
                //处理数据
                values.etime = values.etime.format('YYYY-MM-DD');
                values.stime = values.stime.format('YYYY-MM-DD');
                values.tags = values.tags.join(';');
                this.props.onSubmit(values);
            }
        });
    }
    onTempleteChange = (e)=>{

        if(e.target.value !== 0){
            this.setState({isTemplete:true});
            this.props.form.setFieldsValue(TEMPlATE[e.target.value]);
        }else{
            //获取审批人
            this.setState({loading:true});
            getCouponApprovers().then(res=>{
                this.props.form.setFieldsValue(TEMPlATE[e.target.value]);
                this.setState({isTemplete:false,approverList:res.data,loading:false});
            });
        }

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const FormItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {
                span: 8
            }
        };

        let formId,submitText;

        if(this.props.type === 'update'){
            formId = (
                <FormItem  {...FormItemLayout} label="ID">
                    <span>{this.props.id}</span>
                </FormItem>
            );
            submitText = '保存修改';
        }else{
            submitText = '立即申请';
            if(this.state.isTemplete){
                submitText = '立即创建';
            }
        }


        const info = this.props.info || {};

        return (
            <div>
                <Spin spinning={!!this.props.loading || this.state.loading}>
                    <Form layout="horizontal" onSubmit={this.onSubmit}>
                        {formId}
                        <FormItem {...FormItemLayout} label="类型" colon={true}>
                            {getFieldDecorator('vouchers_type', {
                                initialValue: COUPON_TYPE_OPTIONS[0].value,
                                rules: [{required: true, message: '类型不能为空'}]
                            })(
                                <Select style={{width: 100}} disabled={this.isUp}>
                                    {COUPON_TYPE_OPTIONS.map((option, index)=> {
                                        return <Option key={index} value={option.value}>{option.lable}</Option>;
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...FormItemLayout} label="模版" colon={true}>
                            {getFieldDecorator('template', {
                                initialValue: TEMPlATE_OPTIONS[0].value
                            })(
                                <RadioGroup onChange={this.onTempleteChange} disabled={this.isUp}>
                                    {TEMPlATE_OPTIONS.map((option, index)=> {
                                        return <Radio key={index} value={option.value}>{option.lable}</Radio>;
                                    })}
                                </RadioGroup>
                            )}
                        </FormItem>

                        <FormItem {...FormItemLayout} label="面额" >
                            {getFieldDecorator('amount', {
                                initialValue: info.amount,
                                rules: [
                                    {required: true, message: '面额不能为空'},
                                    {validator:(rule, value, callback)=>{
                                            if(value>100000000){
                                                callback('面额不能超过100000000');
                                                return;
                                            }
                                            callback();
                                        }}
                                ]
                            })(
                                <InputNumber min={0} disabled={this.isUp || this.state.isTemplete}/>
                            )}
                            <span style={{marginLeft: 10}}>元</span>
                        </FormItem>

                        <FormItem {...FormItemLayout} label="生效时间">
                            {getFieldDecorator('stime', {
                                initialValue: info.stime?moment.unix(info.stime):null,
                                rules: [{required: true, message: '生效时间不能为空'}]
                            })(
                                <DatePicker
                                    disabled={this.isUp}
                                    style={{width: 180}}
                                    disabledDate={this.disabledStartDate}
                                    onChange={this.onDateChange}
                                    format="YYYY-MM-DD"/>
                            )}
                        </FormItem>

                        <FormItem {...FormItemLayout} label="到期时间">
                            {getFieldDecorator('etime', {
                                initialValue: info.etime?moment.unix(info.etime):null,
                                rules: [{required: true, message: '到期时间不能为空'}]
                            })(
                                <DatePicker
                                    disabled={this.isUp}
                                    style={{width: 180}}
                                    disabledDate={this.disabledEndDate}
                                    format="YYYY-MM-DD"/>
                            )}
                        </FormItem>

                        <FormItem {...FormItemLayout} label="使用规则">
                            <span style={{marginRight: 10}}>满</span>
                            {getFieldDecorator('rule', {
                                initialValue: info.rule,
                                rules: [
                                    {required: true, message: '使用规则不能为空'},
                                    {validator:(rule, value, callback)=>{
                                            if(value>100000000){
                                                callback('面额不能超过100000000');
                                                return;
                                            }
                                            callback();
                                        }}
                                ]
                            })(
                                <InputNumber min={0} disabled={this.isUp  || this.state.isTemplete}/>
                            )}
                            <span style={{marginLeft: 10}}>元  可使用</span>
                        </FormItem>

                        <FormItem {...FormItemLayout} label="关联帐号">
                            {getFieldDecorator('user_list', {
                                initialValue: info.user_list,
                                rules: [{required: true, message: '关联帐号不能为空'}]
                            })(
                                <Input.TextArea disabled={this.isUp} placeholder="请输入用户名(多个用户请用英文分号;隔开)" rows={4}/>
                            )}
                        </FormItem>
                        <FormItem {...FormItemLayout} label="标签">
                            {getFieldDecorator('tags', {
                                initialValue: info.tags?info.tags.split(';'):[],
                                rules: [
                                    {required: true, message: '标签不能为空'},
                                    {validator:(rule, value, callback)=>{
                                            let isMax = false;
                                            value.forEach(item=>{
                                                if(item.length>30){
                                                    isMax = true;
                                                }
                                            });
                                            if(isMax){
                                                callback('单个tags不能大于30个字符');
                                                return;
                                            }
                                            callback();
                                        }}
                                ]
                            })(
                                <Tags border={true}/>
                            )}
                        </FormItem>

                        <FormItem wrapperCol={{offset: 2}}>
                            <Button type="primary" htmlType="submit">{submitText}</Button>
                        </FormItem>
                        {(!this.state.isTemplete && !this.isUp)?<FormItem {...FormItemLayout} label="审批人" colon={true}>
                            {this.state.approverList.join(',')}
                        </FormItem>:null}

                    </Form>
                    <div className={style.preview}>
                        <div style={{marginBottom: 20,lineHeight:'40px'}}>预览样式</div>
                        <Voucher info={{
                            amount:this.props.form.getFieldValue('amount'),
                            rule:this.props.form.getFieldValue('rule'),
                            stime:this.props.form.getFieldValue('stime'),
                            etime:this.props.form.getFieldValue('etime'),
                            id:this.props.id?this.props.id:'[样例]123456'
                        }}/>
                    </div>
                </Spin>
            </div>
        );
    }
}
const CouponManageForm = Form.create({})(CouponManage);
export default CouponManageForm;



// WEBPACK FOOTER //
// ./src/pages/Admin/Coupon/Form.js