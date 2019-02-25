import React from 'react';
import { Button } from 'antd';

export default class CutDownButton extends React.Component{
    state = {
        hasSend: false,
        second: 60
    }

    componentWillMount(){
        if(this.props.start){
            this.countDown();
        }
    }

    onClick = ()=>{
        this.props.onClick(()=>{
            this.countDown();
        });
    }

    countDown = () => {
        if (this.state.second === 0) {
            this.setState({ hasSend: false, second: 60 });
            return;
        }
        this.setState({ second: this.state.second - 1, hasSend: true });
        setTimeout(() => {
            this.countDown();
        }, 1000);
    }


    render(){
        let style = { width: '40%', height: '40px', float: 'right' };
        style = { ...style, ...this.props.style};
        return (
            <Button type="primary" onClick={this.onClick} disabled={this.state.hasSend} style={style}>{this.state.hasSend ? this.state.second + 's后重试' : this.props.text}</Button>
        );
    }

};



// WEBPACK FOOTER //
// ./src/components/CutDownButton/Overview.js