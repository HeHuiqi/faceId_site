import React from 'react';
import { Form, DatePicker, Select, Input, Button } from 'antd';
import style from './index.less';
import {STATUS_OPTIONS} from './const';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const TIME_FIELDS = [
    {lable: '全部时间', value: '0'},
    {lable: '创建时间', value: '1'},
    {lable: '生效时间', value: '2'},
    {lable: '到期时间', value: '3'},
    {lable: '更新时间', value: '4'}
];


class TableFilters extends React.Component {
    state = {

    };
    onSubmit = (e)=> {
        e.preventDefault();
        this.props.form.validateFields((error, values)=> {
            if (!error) {
                Object.keys(values).forEach(key=>{
                    if(typeof values[key] === 'undefined'){
                        delete values[key];
                    }
                });
                this.props.onSearch(values);
            }
        });
    }
    render() {
        const { getFieldDecorator,getFieldValue } = this.props.form;
        let time,searchDis = false;
        if(getFieldValue('time_type') !== '0' && getFieldValue('time_type')){
            time = <FormItem >
                {getFieldDecorator('time', {
                    // rules: [{ type: 'array', required: true, message: '请选择时间' }]
                })(
                    <RangePicker />
                )}
            </FormItem>;
            const timeArray = getFieldValue('time');
            if(!timeArray){
                searchDis = true;
            }
        }
        return (
            <div style={{marginBottom: 10}}>
                <Form layout="inline" onSubmit={this.onSubmit}>
                    <FormItem>
                        {getFieldDecorator('status', {
                            initialValue: STATUS_OPTIONS[0].value
                        })(
                            <Select style={{width: 100}}>
                                {STATUS_OPTIONS.map((option, index)=> {
                                    return <Option key={index} value={option.value}>{option.lable}</Option>;
                                })}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem>
                        {getFieldDecorator('time_type', {
                            initialValue: TIME_FIELDS[0].value
                        })(
                            <Select style={{width: 100}}>
                                {TIME_FIELDS.map((option, index)=> {
                                    return <Option key={index} value={option.value}>{option.lable}</Option>;
                                })}
                            </Select>
                        )}
                    </FormItem>

                    {time}

                    <FormItem >
                        {getFieldDecorator('q', {

                        })(
                            <Input placeholder="关键词查询id与用户" />
                        )}
                    </FormItem>
                    <FormItem >
                        {getFieldDecorator('tags', {

                        })(
                            <Input style={{width:'250px'}} placeholder="关键词查询tag用英文分号分隔" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={searchDis}>查询</Button>
                    </FormItem>
                    <FormItem className={style.create}>
                        <Button type="primary" ghost onClick={e=> this.props.history.push('/admin/pages/coupon/create')}>新建代金券</Button>
                    </FormItem>
                </Form>

            </div>
        );
    }
}
const TableFiltersForm = Form.create({})(TableFilters);
export default TableFiltersForm;



// WEBPACK FOOTER //
// ./src/pages/Admin/Coupon/Filters.js