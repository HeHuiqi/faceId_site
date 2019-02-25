import React from 'react';
import BaseContent from 'components/BaseContent';
import Table from 'components/Table';
import moment from 'moment';
import {getMessages} from 'actions/information';

import { withRouter } from 'react-router-dom';

class Information extends React.Component {

    state = {
        list: []
    }
    columns = [{
        title: '全部消息',
        dataIndex: 'message_content',
        key: 'message_content',
        width: 400,
        render:(text,record,index)=>{
            return record.message_content;
        }
    },
        {
            title: '时间',
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'right',
            width: 200,
            fixed: 'right',
            render:(text,record,index)=>{
                return moment.unix(record.date).local().format('YYYY/MM/DD HH:mm:ss');
            },
            sorter: true
        }];

    onStart = (tableParams)=> {
        tableParams = tableParams || {};
        return getMessages(tableParams).then(e => {
            this.setState({ list: e.data.this_page ? e.data.this_page : [], total: e.data.total });
        });

    }

    componentDidMount() {
        this.table.change(1);
    }
    render() {
        return (
            <BaseContent style={{marginTop: 20}}>
                <Table
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


export default withRouter(Information);



// WEBPACK FOOTER //
// ./src/pages/Information/Overview.js