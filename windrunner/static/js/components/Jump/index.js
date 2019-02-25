import React from 'react';
import config from 'config';
const Jump = (props)=>{
    return (
        <a {...props} href={config.basename+props.href}>{props.children}</a>
    );
};
export default Jump;



// WEBPACK FOOTER //
// ./src/components/Jump/Overview.js