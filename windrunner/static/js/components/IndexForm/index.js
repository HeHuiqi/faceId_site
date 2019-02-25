import React from 'react';
import { Form } from 'antd';
import style from './index.less';
import {Icon} from 'antd';
class IndexForm extends React.Component{

    render(){
        return(
            <div>
                <Icon style={{opacity:0,overflow:'hidden',width:0,height:0}} type="copy" />
                <h1 className={style['title']}>{this.props.title}</h1>
                <Form onSubmit={this.props.onSubmit} className={style['form']} style={this.props.formStyle}>
                    {this.props.children}
                </Form>
            </div>
        );
    }


}

export default IndexForm;



// WEBPACK FOOTER //
// ./src/components/IndexForm/Overview.js