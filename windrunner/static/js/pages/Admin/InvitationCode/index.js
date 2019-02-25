import React from 'react';
import { withRouter } from 'react-router-dom';
import BaseContent from 'components/BaseContent';
import FilterForm from './Filters';
import Table from 'components/Table';
import moment from 'moment';
import {getInvitationCode} from 'actions/invitationCode';
import { SERVICE_TYPE_OPTIONS, getServiceText} from 'utils/const';

class InvitationCode extends React.Component {
    state = {
        list: []
    };
    columns = [{
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        fixed: 'left',
        width: 200
    },{
        title: '产品',
        dataIndex: 'service_id',
        key: 'service_id',
        render: (text)=> {
            return getServiceText(text);
        }
    },{
        title: '类型',
        dataIndex: 'service_type',
        key: 'service_type',
        render: (text)=> {
            return SERVICE_TYPE_OPTIONS.filter(e=> e.value == text)[0].label;
        }
    },{
        title: '邀请码',
        dataIndex: 'code',
        key: 'code',
        render: (text)=> {
            return <span style={{color: '#00A5E3', fontWeight: 600}}>{text}</span>;
        }
    },{
        title: '到期时间',
        dataIndex: 'expire_time',
        key: 'expire_time',
        render: (text, record, index) => {
            return moment.unix(text).local().format('YYYY/MM/DD HH:mm:ss');
        }
    },{
        title: '剩余次数（次）',
        dataIndex: 'call_count',
        key: 'call_count'
    }];


    onSearch = (filters)=> {

        this.filterParams = filters;
        this.table.change(1);
    }

    onStart = (tableParams, filters)=> {
        tableParams = tableParams || {};
        let _params = { ...tableParams };
        if(filters && filters.status){
            _params.status = filters.status;
        }
        if(this.filterParams){
            _params = {..._params,...this.filterParams};
        }
        return getInvitationCode(_params).then(e => {
            this.setState({
                list: e.data.this_page,
                total: e.data.total
            });
        }).catch(e=> {
            this.setState({
                list: [],
                total: 0
            });
        });

    }
    componentDidMount() {
        if (this.props.match.params.username) {
            this.filterParams = this.filter.getFieldsValue();
            this.table.change(1);
        }
    }

    render() {

        return (
            <BaseContent>
                <FilterForm
                    history={this.props.history}
                    onSearch={this.onSearch}
                    ref={ref=> this.filter = ref}
                    match={this.props.match}/>
                <Table
                    rowKey='id'
                    dataSource={this.state.list}
                    columns={this.columns}
                    onSubmit={this.onStart}
                    total={this.state.total}
                    ref={ref => this.table = ref}
                />
            </BaseContent>
        );
    }
}

export default withRouter(InvitationCode);



// WEBPACK FOOTER //
// ./src/pages/Admin/InvitationCode/Overview.js