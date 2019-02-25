import React from 'react';
import { Spin } from 'antd';
import style from './index.less';

const OneCard = (props)=>{
    const num = props.num;
    let content;
    if(num === null || typeof num === 'undefined'){
        content = <Spin />;
    }else if(num === '无'){
        content = <div>-</div>;
    }else{
        const style = {};
        if(props.color){
            style.color = props.color;
        }
        content = <div style={style}>{num}<span style={{position:'relative'}}>{props.unit}</span></div>;
    }

    return(<li style={{width:props.width}}>
        <h2>{props.title}{props.children}</h2>
        {content}
    </li>);
};

class CardBox extends React.Component {

    render(){
        const width = 100/this.props.cards.length + '%';
        return (
            <ul className={style['card-box']}>
                {this.props.cards.map(item=>{
                    let _children = null;
                    if(item.children){
                        _children = item.children;
                        delete item.children;
                    }
                    return <OneCard width={width} {...item} >{_children}</OneCard>;
                })}
            </ul>
        );
    }
};

export default CardBox;



// WEBPACK FOOTER //
// ./src/components/CardBox/Overview.js