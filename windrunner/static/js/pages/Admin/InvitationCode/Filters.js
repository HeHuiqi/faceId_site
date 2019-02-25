import React from 'react';
import { Form, Select, Input, Button } from 'antd';
import {SERVICE_OPTIONS, SERVICE_TYPE_OPTIONS} from 'utils/const';

const FormItem = Form.Item;
const Option = Select.Option;


class TableFilters extends React.Component {

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
        let searchDis = true;
        if(getFieldValue('q')){
            searchDis = false;
        }
        let service_id_default = SERVICE_OPTIONS[0].value;
        let service_type_default = SERVICE_TYPE_OPTIONS[0].value;

        if (this.props.match.params.serviceID) {
            const serviceID = this.props.match.params.serviceID.split('-');
            if (serviceID.length === 2) {
                service_id_default = serviceID[0];
                service_type_default = serviceID[1];
            }
        }

        return (
            <div style={{marginBottom: 10}}>
                <Form layout="inline" onSubmit={this.onSubmit}>

                    <FormItem label="用户名">
                        {getFieldDecorator('q', {
                            initialValue: this.props.match.params.username
                        })(
                            <Input placeholder="请输入用户名" />
                        )}
                    </FormItem>

                    <FormItem label="产品">
                        {getFieldDecorator('service_id', {
                            initialValue: service_id_default
                        })(
                            <Select style={{width: 120}}>
                                {SERVICE_OPTIONS.map((option, index)=> {
                                    return <Option key={index} value={option.value}>{option.label}</Option>;
                                })}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem label="类型">
                        {getFieldDecorator('service_type', {
                            initialValue: service_type_default
                        })(
                            <Select style={{width: 100}}>
                                {SERVICE_TYPE_OPTIONS.map((option, index)=> {
                                    return <Option key={index} value={option.value}>{option.label}</Option>;
                                })}
                            </Select>
                        )}
                    </FormItem>

                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={searchDis}>查询</Button>
                    </FormItem>
                    <FormItem style={{position: 'absolute', right: 0}}>
                        <Button type="primary" ghost onClick={e=> this.props.history.push('/admin/pages/invitation-code/create')}>新建邀请码</Button>
                    </FormItem>
                </Form>

            </div>
        );
    }
}
const TableFiltersForm = Form.create({})(TableFilters);
export default TableFiltersForm;



// WEBPACK FOOTER //
// ./src/pages/Admin/InvitationCode/Filters.js