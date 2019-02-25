import React from 'react';
import className from 'classnames';
import style from './BankList.less';


//title在白色card外面的类型
class BankList extends React.Component {

    state = {}

    onClick=(value)=>{
        this.setState({value});
        this.props.onClick(value);
    }

    render(){
        const bcls = className({
            [style['bank-group']]:true,
            [this.props.className]:[this.props.className]?true:false
        });
        return (
            <div className={bcls} >
                {this.props.banks.map(item=>{
                    const cls = className({
                        [style['bank-span']]:true,
                        [style['active']]:item.value === this.state.value,
                        [style[item.className]]:true
                    });
                    return <span onClick={this.onClick.bind(this,item.value)} className={cls}></span>;
                })}
            </div>
        );
    }
};

export default BankList;



// WEBPACK FOOTER //
// ./src/pages/Recharge/BankList.js