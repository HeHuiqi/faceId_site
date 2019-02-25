import React from 'react';
import BaseContent from 'components/BaseContent';
import style from './ApiKeyEmpty.less';

//title在白色card外面的类型
class ApiKeyEmpty extends React.Component {

    render(){
        return (
            <BaseContent style={{ position: 'relative',height:'100%'}}>
                <div className={style.box}>
                    <img width='180' src={require('../../image/pic_apikey_empty.png')} alt=""/>
                    <p style={{fontSize:'16px',color:'#9c9c9c',width:'100%',textAlign:'center'}}>暂未创建API Key</p>
                    {this.props.children}
                </div>
            </BaseContent>
        );
    }
};

export default ApiKeyEmpty;



// WEBPACK FOOTER //
// ./src/pages/ApiKey/ApiKeyEmpty.js