import React from 'react';
import { Layout} from 'antd';
import Header from './Header';
import Footer from './Footer';


class NoMenuLayer extends React.Component {


    render() {
        return (
            <Layout style={{minHeight:'100%',minWidth:'1280px',position:'relative'}}>
                <Header useLogo noUserTab={true} style={{left:0}}/>
                <Layout style={{marginTop: 64,position:'relative',padding:'36px 30px 75px 30px'}}>
                    {this.props.children}
                </Layout>
                <Footer />
            </Layout>
        );
    }
}

export default NoMenuLayer;



// WEBPACK FOOTER //
// ./src/components/NoMenuLayer.js