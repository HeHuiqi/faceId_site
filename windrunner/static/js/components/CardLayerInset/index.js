import React from 'react';
import style from './index.less';
import className from 'classnames';

//title在白色card内部的布局
class CardLayerInset extends React.Component {

    render(){
        const cls = className(style.authFrom,this.props.className);
        return (
            <div className={cls}>
                <div className={style.titleBox}>
                    <div className={style.title}>{this.props.title}</div>
                    {this.props.titleContent}
                </div>
                <div className={style.content}>
                    {this.props.children}
                </div>
            </div>
        );
    }
};

export default CardLayerInset;



// WEBPACK FOOTER //
// ./src/components/CardLayerInset/Overview.js