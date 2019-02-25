import React from 'react';
import { Table, Input } from 'antd';
const Search = Input.Search;

class WrappedTable extends React.Component{

    constructor(props){
        super(props);
        //处理默认值
        this.state = {
            current:1,
            loading:false,
            pageSize:10,
            filters:null,
            sorter: props.sorter || {}  //sorter:{order,field}
        };
    }

    onChange = (pagination, filters, sorter, isReset)=>{
        //数据
        filters = filters || this.state.filters;
        sorter = sorter || this.state.sorter;
        pagination = pagination || { current:this.state.current};
        const current = pagination.current || 1;
        const pageSize = pagination.pageSize || 10;
        //分页
        let params = {
            start: (current-1) * pageSize,
            limit: pageSize
        };
        //排序
        if (sorter.field){
            params = { ...params,
                order: sorter.field,
                asc: sorter.order === 'descend'?0:1
            };
        }
        //关键词
        if (!isReset && this.state.keyWord && this.state.keyWord!==''){
            params['q'] = this.state.keyWord;
        }
        if (isReset){
            this.setState({ keyWord: '' });
        }

        const onSubmit = this.props.onSubmit;
        this.setState({ loading: true });
        const promise = onSubmit(params,filters);
        if(promise instanceof Promise){
            return promise.then(()=>{
                //设置分页和排序,pageSize
                const _state = { loading: false,pageSize,filters};
                if (pagination){
                    _state.current = pagination.current;
                }
                if (sorter){
                    _state.sorter = { field: sorter.field, order: sorter.order };
                }

                this.setState(_state);
            });
        }else{
            return Promise.resolve();
        }

    }

    change(params, keyWord = null){
        //处理参数
        let _params = {current:1},sorter;
        if(typeof params === 'number'){
            //参数为数字，为页数
            _params = {
                current:params
            };
        }else if(typeof params === 'object'){
            //参数为对象，解析，支持参数为{"start":20,"limit":10,"sorter":{order,field}}
            const current = params.current;
            const start = params.start || 0;
            const pageSize = params.limit || 10;
            sorter = params.sorter || null;
            _params = {
                current:current?current:start/pageSize +1,
                pageSize
            };

        }
        this.onChange(_params, null, sorter);
    }
    refresh(){
        this.onChange({ current:this.state.current }, null, null);
    }

    resetChange(){
        this.onChange({ current:1}, null, null,true);
    }

    onSearch = (text)=>{
        this.onChange({ current: 1 },null, null, null);
    }

    onkeyWordChange = (event)=>{
        this.setState({ keyWord: event.target.value});
    }

    showTotle = (total, range)=>{
        let totalPages = parseInt(total/this.state.pageSize,10);
        if(total%this.state.pageSize >0){
            totalPages++;
        }
        return <div style={{fontSize:'12px',float:'left'}}>共 {total} 条记录 第{this.state.current}／{totalPages}页</div>;
    }

    render(){
        //绑定排序
        const columns = this.props.columns.map(item=>{
            if (item.sorter){
                if (item.key === this.state.sorter.field){
                    item.sortOrder = this.state.sorter.order;
                }else{
                    item.sortOrder = false;
                }
            }
            return item;
        });
        let searchInput;
        if(this.props.showSearch){
            searchInput =<Search
                style={{width:300}}
                placeholder="搜索"
                value={this.state.keyWord}
                onSearch={this.onSearch}
                onChange={this.onkeyWordChange}
                enterButton
            />;
        }

        return(
            <div>
                {searchInput}
                <Table
                    {...this.props}
                    pagination={{style:{width:'100%',textAlign:'right'},showTotal:this.showTotle,showQuickJumper:true,current: this.state.current, total:this.props.total,pageSize:this.state.pageSize,showSizeChanger:true}}
                    loading={this.state.loading}
                    columns={columns}
                    onChange={this.onChange}
                    filters={this.state.filters}
                />
            </div>
        );
    }


}

export default WrappedTable;



// WEBPACK FOOTER //
// ./src/components/Table.js