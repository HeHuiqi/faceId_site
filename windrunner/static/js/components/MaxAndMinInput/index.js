import React from 'react';
import {Input} from 'antd';
const InputGroup = Input.Group;

class MaxAndMinInput extends React.Component {

    constructor(props) {
        super(props);
        const value = props.value || {};
        this.state = {
            min: value.min || '',
            max: value.max || '',
        };
    }

    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    onMinChange = (e)=>{
        this.setState({min:e.target.value});
        this.triggerChange({min:e.target.value});
    }

    onMaxChange = (e)=>{
        this.setState({max:e.target.value});
        this.triggerChange({max:e.target.value});
    }

    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    render(){
        return (
            <InputGroup compact>
                <Input style={{ width: 100, textAlign: 'center' }} onChange={this.onMinChange} placeholder="最小值" />
                <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} onChange={this.onMaxChange} placeholder="最大值" />
            </InputGroup>
        );
    }
};

export default MaxAndMinInput;




// WEBPACK FOOTER //
// ./src/components/MaxAndMinInput/Overview.js