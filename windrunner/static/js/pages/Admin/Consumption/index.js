import React from 'react';
import Table from 'components/Table';
import BaseContent from 'components/BaseContent';
import { getAuthClient,getUserStatistics,exportStatistics ,getBusiness} from 'actions/adminClients';
import { Spin,Form,Select } from 'antd';
import Fform from 'components/FilterForm';
import {withRouter} from 'react-router-dom';
import BaseRangePicker from 'components/BaseRangePicker';
import style from './style.less';
import MaxAndMinInput from 'components/MaxAndMinInput';
const FormItem = Form.Item;
const Option = Select.Option;


class Consumption extends React.Component {

    state = {
        loading:false,
        userList:[],
        list: [],
        type:'company_name',
        exportUrl:''
    }
    selectUser = 'all';
    columns = [{
        title: '企业名称',
        dataIndex: 'company_name',
        key: 'company_name'
    }, {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
    },{
        title: '真实消耗（元）',
        dataIndex: 'real_consumption',
        key: 'real_consumption',
        sorter: true
    }, {
        title: '总消耗（元）',
        dataIndex: 'total_consumption',
        key: 'total_consumption',
        sorter: true
    },{
        title: '商务',
        dataIndex: 'business',
        key: 'business',
        filterMultiple:false
    }];

    componentDidMount() {
        //获取全部认证用户
        Promise.all([getBusiness(),getAuthClient()]).then(res=>{
            //处理数据
            const _data = res[0].data.map(item=>{
                return { text: item.username, value:item.id };
            });
            this.columns.forEach(item=>{
                if(item.key === 'business'){
                    item.filters = _data;
                }
            });
            this.setState({userList:res[1].data});
            this.handleSubmit();
        });

    }

    onStart = (tableParams,filters) => {
        tableParams = tableParams || {};
        let _params = { ...tableParams };
        if(this.filterParams){
            _params = {..._params,...this.filterParams};
        }
        if(filters && filters.business){
            _params.business_list = filters.business.join(',');
        }
        this.setState({exportUrl:exportStatistics(_params)});
        return getUserStatistics(_params).then(e => {
            this.setState({ list: e.data.this_page ? e.data.this_page : [], total: e.data.total });
        });
    }

    onRow = (record)=>{
        return {
            onClick: () => {
                const selectTime = this.rangePicker.getSelectTime();
                const params = {
                    id:record.account_id,
                    start_date:selectTime[0].format('YYYY-MM-DD'),
                    end_date:selectTime[1].format('YYYY-MM-DD'),
                    username:record.username,
                    unit:'day'
                };

                this.props.history.push('/admin/pages/consumption/'+JSON.stringify(params));
            },
        };
    }
    onUserChange = (e)=>{
        this.selectUser = e;
    }

    handleSubmit = (e) => {
        if(e){
            e.preventDefault();
        }
        if(!this.rangePicker){
            return;
        }
        this.props.form.validateFields((err, values)=>{
            if(err){
                return;
            }
            const selectTime = this.rangePicker.getSelectTime();
            this.filterParams = {
                start_date:selectTime[0].format('YYYY-MM-DD'),
                end_date:selectTime[1].format('YYYY-MM-DD'),
            };
            if(this.selectUser!=='all'){
                this.filterParams.user_id = this.selectUser;
            }
            const formValues = this.props.form.getFieldsValue();
            Object.keys(formValues).forEach(item=>{
                if(formValues[item] === ''){
                    delete formValues[item];
                }
            });
            if(formValues.consume.min !== ''){
                this.filterParams.min_consume = formValues.consume.min;
            }
            if(formValues.consume.max !== ''){
                this.filterParams.max_consume = formValues.consume.max;
            }
            delete formValues.consume;
            this.filterParams = {...this.filterParams,...formValues};
            this.table.change(1);
        });
    }
    onTypeChange = (value)=>{
        this.setState({type:value});
    }

    render() {
        let filter;
        const { getFieldDecorator } = this.props.form;
        if(this.state.type === 'company_name'){
            filter = <FormItem
                label="企业名称"
            >
                <Select
                    defaultValue='all'
                    style={{ width: 120 }}
                    onChange={this.onUserChange}
                    showSearch
                    optionFilterProp="children"
                >
                    <Option value='all'>全部</Option>
                    {this.state.userList.map(item=>{
                        return <Option value={item.account_id}>{item.company_name}</Option>;
                    })}
                </Select>
            </FormItem>;
        }else{
            filter = <FormItem
                label="用户名"
            >
                <Select
                    defaultValue='all'
                    style={{ width: 120 }}
                    onChange={this.onUserChange}
                    showSearch
                    optionFilterProp="children"
                >
                    <Option value='all'>全部</Option>
                    {this.state.userList.map(item=>{
                        return <Option value={item.account_id}>{item.username}</Option>;
                    })}
                </Select>
            </FormItem>;
        }


        return (
            <BaseContent>
                <Spin
                    spinning={this.state.loading}
                    tip="提交中"
                >
                    <Fform exportUrl={this.state.exportUrl} layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem
                            label="检索方法"
                        >
                            <Select
                                defaultValue={this.state.type}
                                style={{ width: 120 }}
                                onChange={this.onTypeChange}
                            >
                                <Option value='company_name'>企业名称</Option>
                                <Option value='username'>用户名</Option>
                            </Select>
                        </FormItem>
                        {filter}
                        <FormItem
                            label="时间"
                        >
                            <BaseRangePicker ref={(ref)=>this.rangePicker=ref}/>
                        </FormItem>
                        <FormItem
                            label="总消耗范围"
                        >
                            {getFieldDecorator('consume',{
                                initialValue:{min:'',max:''},
                                rules:[
                                    {validator:(rule, value, callback)=>{
                                            if((value.min !== '' && value.max ==='')){
                                                callback('请填写最大值');
                                            }else if((value.min==='' && value.max!=='')){
                                                callback('请填写最小值');
                                            }else{
                                                callback();
                                            }
                                        }}
                                ]
                            })(
                                <MaxAndMinInput />
                            )}
                        </FormItem>
                    </Fform>
                    <Table
                        className={style.table}
                        style={{ marginTop: 20 }}
                        dataSource={this.state.list}
                        columns={this.columns}
                        onSubmit={this.onStart}
                        total={this.state.total}
                        ref={ref => this.table = ref}
                        onRow={this.onRow}
                    />
                </Spin>
            </BaseContent>
        );
    }

}
const WrappedApp = Form.create()(Consumption);
export default withRouter(WrappedApp);




// WEBPACK FOOTER //
// ./src/pages/Admin/Consumption/Overview.js