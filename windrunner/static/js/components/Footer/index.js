import React from 'react';

class Footer extends React.Component {

    render(){
        return <div style={{position: 'absolute',bottom: 0,textAlign:'center',left:0,right:0,fontSize:12,paddingBottom:5}}>
            <p style={{color:'#999',width: '100%'}}>© 2012-2019 北京旷视科技有限公司 版权所有 | 京ICP备12036813 号-11</p>
            <a style={{color:'#939393'}} rel="noopener noreferrer" target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802025957">
                <img src={require('image/record.png')}/>&nbsp;
                <span>京公网安备 11010802025957号</span>
            </a>
        </div>;

    }
};

export default Footer;



// WEBPACK FOOTER //
// ./src/components/Footer/Overview.js