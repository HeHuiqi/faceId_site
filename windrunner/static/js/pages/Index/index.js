import React from 'react';
import Overview from './overview.js';
import { connect } from 'react-redux';

class Index extends React.Component {

    render() {
        return <Overview account={this.props.account}/>;
    }

}
function select(state) {
    return {
        account: state.account.info
    };
}

export default connect(select)(Index);



// WEBPACK FOOTER //
// ./src/pages/Index/Overview.js