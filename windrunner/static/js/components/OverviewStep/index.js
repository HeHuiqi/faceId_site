import React from 'react';
import classNames from 'classnames';
import style from './index.less';
import Ficon from 'components/Ficon';

const StepNum = (props)=> {
    const cls = classNames({
        [style.item]:true,
        [style.last]:props.isLast
    });

    return <div className={cls}>
        <div onClick={props.onClick} className={style.pointer}>
            <span><Ficon type={props.type}/></span>
            <a>{props.title}</a>
            {props.other}
        </div>
        {!props.isLast?<div className={style.line}></div>:null}
    </div>;
};

export default StepNum;



// WEBPACK FOOTER //
// ./src/components/OverViewStep/Overview.js