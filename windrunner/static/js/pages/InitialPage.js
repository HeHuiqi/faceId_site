import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routerConfig} from '../utils/routerConfig';
import {setPageData} from '../actions/pageData';


class InitialPage extends React.Component {

    componentWillMount() {
        this.updatePageData();
    }

    componentDidUpdate() {
        this.updatePageData();
    }

    updatePageData() {
        const {location} = this.props;
        const route = this.props.path;
        const _router = routerConfig[route] || {};
        const breadcrumb = _router.breadcrumb || [];
        const title = _router.title || '';
        const path = (location && location.pathname) || '';
        this.props.setPageData({breadcrumb, title, route, path});
        document.title = title;
    }

    render() {
        return this.props.children;
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setPageData: bindActionCreators(setPageData ,dispatch)
    };
}

export default connect(null, mapDispatchToProps)(InitialPage);



// WEBPACK FOOTER //
// ./src/pages/InitialPage.js