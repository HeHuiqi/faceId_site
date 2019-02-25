import React from 'react';
import className from 'classnames';
import style from './index.less';

class CardLayer extends React.Component {

    render(){
        const cls = className(style.layer,this.props.className);
        return (
            <div style={this.props.style}>
                <div className={cls} style={this.props.cardStyle}>
                    {this.props.children}
                </div>
            </div>
        );
    }
};

export default CardLayer;



// WEBPACK FOOTER //
// ./src/components/CardLayer/Overview.js