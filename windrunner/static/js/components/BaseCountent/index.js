import React from 'react';

class BaseContent extends React.Component {

    render(){
        const style = {
            padding: 20, background: '#fff',minHeight: 530,borderRadius: 4,boxShadow:'0px 2px 4px rgba(204, 204, 204, 1)',
            ...this.props.style
        };
        delete this.props.style;
        return (
            <div {...this.props} style={style}>
                {this.props.children}
            </div>
        );
    }
};

export default BaseContent;



// WEBPACK FOOTER //
// ./src/components/BaseContent/Overview.js