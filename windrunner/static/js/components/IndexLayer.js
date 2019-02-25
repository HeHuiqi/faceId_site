import React from 'react';
import style from './IndexLayer.less';
import IndexHeader from 'components/IndexHeader';
import Footer from './Footer';
import {oldCheckLogin} from 'actions/oldAccount';
import {checkLogin} from 'actions/account';
import {toUrl} from 'utils/tool.js';
import {Spin} from 'antd';

class IndexLayer extends React.Component {

    state = {
        notLogin:false,
        // notLogin:true
    }

    componentDidMount(){
        oldCheckLogin().then(()=>{
            window.location.href = '/pages';
        }).catch(()=>{
            return checkLogin().then(()=>{
                toUrl('/pages');
            });
        }).catch(()=>{
            this.setState({notLogin:true});
        });
    }

    render() {
        if(!this.state.notLogin){
            return <Spin><div style={{height:'500px'}}></div></Spin>;
        }
        const {leftStyle, rightStyle} = this.props;
        let { imgSrc } = this.props;
        if (!imgSrc) {
            imgSrc = require('../image/pic.png');
        }
        return(
            <div style={{height:'100%'}}>
                <IndexHeader />
                <div className={style.body}>
                    <div className={style.main}>
                        <div className={style.layer}>
                            <img className={style.pic} alt="img" src={imgSrc} style={leftStyle}/>
                            <div className={style.formLayer} style={rightStyle}>
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

export default IndexLayer;



// WEBPACK FOOTER //
// ./src/components/IndexLayer.js