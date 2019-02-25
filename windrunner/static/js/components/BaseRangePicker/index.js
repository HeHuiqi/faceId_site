import React from 'react';
import { DatePicker } from 'antd';
import {RANGE_TIME_INCLUED_TODAY,RANGE_TIME_UNINCLUED_TODAY} from 'utils/const';
import {disabledDateAfterNow} from 'utils/tool';
const { RangePicker } = DatePicker;
class BaseRangePicker extends React.Component {

    constructor(props){
        super(props);
        let _defaultValue = RANGE_TIME_UNINCLUED_TODAY;
        if(props.incluedToday){
            _defaultValue = RANGE_TIME_INCLUED_TODAY;
        }
        this.state = {
            selectTime : this.props.defaultValue?this.props.defaultValue:_defaultValue
        };
    }

    changeSelectTime(times){
        this.setState({selectTime:times});
    }

    timeChange = (e)=>{
        if(e.length === 0) {
            return;
        }
        this.props.onChange && this.props.onChange(e);
        this.setState({selectTime:e});
    }

    getSelectTime(){
        return this.state.selectTime;
    }
    render(){
        let _disabledDate = (current) => disabledDateAfterNow(current);
        if(this.props.incluedToday){
            _disabledDate = (current) => disabledDateAfterNow(current,true);
        }
        return (
            <RangePicker
                style={{width:280}}
                allowClear={false}
                onChange={this.timeChange}
                value={this.state.selectTime}
                disabledDate={_disabledDate}/>
        );
    }
}
export default BaseRangePicker;



// WEBPACK FOOTER //
// ./src/components/BaseRangePicker/Overview.js