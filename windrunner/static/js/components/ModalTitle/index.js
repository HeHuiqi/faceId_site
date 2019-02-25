import React from 'react';
import style from './index.less';
//title在白色card外面的类型
class ModalTitle extends React.Component {

    render(){
        return (
            <div className={style.title}><div className={style.point}></div><div className={style.content} {...this.props}>{this.props.children}</div></div>
        );
    }
};

export default ModalTitle;



// WEBPACK FOOTER //
// ./src/components/ModalTitle/Overview.js