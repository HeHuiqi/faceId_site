import React from 'react';
import style from './index.less';
import classNames from 'classnames';
import {Icon} from 'antd';
class Ficon extends React.Component {

    render(){
        if(!style['icon-'+this.props.type]){
            return <Icon {...this.props} />;
        }
        const iconClass = classNames('anticon',style.icon,style['icon-'+this.props.type]);
        return (
            <i {...this.props} className={iconClass}></i>
        );
    }
};

export default Ficon;



// WEBPACK FOOTER //
// ./src/components/Ficon/Overview.js