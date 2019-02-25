import React from 'react';
import {getUrl} from 'utils/tool';
import './index.less';


//title在白色card内部的布局
class IndexHeader extends React.Component {

    isShowMenu = false;

    showMenu() {
        if(!this.isShowMenu){
            this.isShowMenu = true;
            document.body.className = 'menu-show';
            document.querySelector('.indexLayer-nav').style.transform = 'translate3d(0,0,0)';
        }else{
            this.isShowMenu = false;
            document.body.className = '';
            document.querySelector('.indexLayer-nav').style.transform = 'translate3d(100%,0,0)';
        }

    }
    render(){
        return (
            <div id="header" className="header">
                <div className="header-container indexLayer-header" style={this.props.isStatus ? { background: '#171717' } : {}}>
                    <a href="/" className="logo">
                        <img className="logo_pc" src={require('../../image/logo.svg')} />
                        <img className="logo_mobile" src={require('../../image/logo_no_word.svg')} />
                    </a>
                    <div className="mobile-header-bar">
                        <div className="menu-btn" onClick={this.showMenu.bind(this)}><i></i><i></i><i></i><i></i></div>
                    </div>
                    <ul className="indexLayer-nav indexLayer-nav-mobile">
                        <li><a href="/" className="">产品</a></li>
                        <li><a href="/customers" className="false">案例</a></li>
                        <li><a href="/technology" className="false">技术</a></li>
                        <li className="document"><a href="/pages/documents" className={this.props.active === 'document'?'active':'false'}>文档</a></li>
                        <li><a href="/customization/contact-us" className={this.props.active === 'contact-us'?'active':'false'}>联系我们</a></li>
                        <li><a href={getUrl('/pages')} className={!this.props.active ? 'active' : 'console'}>控制台</a></li>
                        <li class="chenge-language"><a href="https://global.faceid.com">中文/EN<span></span></a></li>
                    </ul>
                </div>
            </div>
        );
    }
};

export default IndexHeader;






// WEBPACK FOOTER //
// ./src/components/IndexHeader/Overview.js