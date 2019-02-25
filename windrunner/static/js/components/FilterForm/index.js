import React from 'react';
import style from './index.less';
import {Form,Button} from 'antd';
import Ficon from 'components/Ficon';
const FormItem = Form.Item;

class FilterForm extends React.Component {

    render(){
        let download;
        const hasExportUrl = typeof this.props.exportUrl === 'string';
        if(hasExportUrl){
            download = <a
                className={this.props.exportUrl === ''?style['disabled']:null}
                onClick={this.onExportClick}
                href={this.props.exportUrl !== ''?this.props.exportUrl:null}
                target="_black"
                style={{position:'absolute',right:'10px',top:'10px'}}>
                <Ficon style={{fontSize:'20px',verticalAlign:'middle',paddingRight:'13px'}} type="export"/><span>导出Excel</span>
            </a>;
        }
        return (
            <div className={style.form}>
                <div style={{paddingRight:hasExportUrl?110:0}}>
                    <Form {...this.props}>
                        {this.props.children}
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={this.props.disabledSubmit}
                            >
                                查询
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                {download}
            </div>
        );
    }
};

export default FilterForm;



// WEBPACK FOOTER //
// ./src/components/FilterForm/Overview.js