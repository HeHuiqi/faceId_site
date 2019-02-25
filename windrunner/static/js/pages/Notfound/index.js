import React from 'react';
import BaseContent from 'components/BaseContent';
import style from './index.less';
import {Button,Layout} from 'antd';
import NoMenuLayer from 'components/NoMenuLayer';
import {toUrl} from 'utils/tool.js';

class Notfound extends React.Component {
    jump = ()=>{
        toUrl('/pages');
    }
    render(){
        return (
            <NoMenuLayer>
                <Layout style={{position: 'relative'}}>
                    <div className={style.box}>
                        <BaseContent style={{ position: 'relative',height:'100%'}}>
                            <div className={style.main}>
                                <img width='180' src={require('../../image/pic_404.png')} alt=""/>
                                <p style={{fontSize:'16px',color:'#9c9c9c',width:'100%',textAlign:'center'}}>抱歉，您访问的页面不存在</p>
                                <Button type="primary" onClick={this.jump}>返回首页</Button>
                            </div>
                        </BaseContent>
                    </div>
                </Layout>
            </NoMenuLayer>
        );
    }
};

export default Notfound;



// WEBPACK FOOTER //
// ./src/pages/Notfound/Overview.js