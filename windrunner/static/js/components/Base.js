import React from 'react';
import {$horus,getUrl} from 'utils/tool';

class Base extends React.Component {

    componentWillReceiveProps(nextProps) {
        const { location, history: { action } } = nextProps;
        if (location !== this.props.location && action === 'PUSH') {
            //url变化打点相关
            const newUrl = window.location.origin+getUrl(nextProps.location.pathname);
            const thisUrl = window.location.origin+getUrl(this.props.location.pathname);
            $horus.occur('page', {url:newUrl,ref:thisUrl});
        }
    }

    render() {
        return this.props.children;
    }
}
export default Base;



// WEBPACK FOOTER //
// ./src/components/Base.js