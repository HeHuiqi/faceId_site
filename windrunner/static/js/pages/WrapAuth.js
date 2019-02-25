import React from 'react';
//503 验证

const wrapAuth = (ComposedComponent, account, path) => class WrapComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            is503: false,
            is404: false,
            hasCheck: true
        };

    }

    render() {
        return <ComposedComponent  { ...this.props} />;
    }
};
export default wrapAuth;



// WEBPACK FOOTER //
// ./src/pages/WrapAuth.js