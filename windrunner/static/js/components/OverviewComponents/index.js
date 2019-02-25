import React from 'react';
import style from './BaseOverview.less';
import { Modal,Button,Tabs } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CardLayer from 'components/CardLayer';
// import CardLayerInset from 'components/CardLayerInset';
import OverViewStep from 'components/OverViewStep';
import { withRouter } from 'react-router-dom';
import {getDocUrl} from 'utils/tool';
import DownLoadSdk from 'components/DownLoadSdk';
import DownLoadDemo from 'components/DownLoadDemo';
import jump from 'jump.js';
const TabPane = Tabs.TabPane;

const ProductInfo = (props)=>{
    const {partTwo,partThree,partFour} = props.info;
    const jump = (url)=>{
        props.history.push(url);
    };
    const open = (url)=>{
        window.open(url);
    };
    return(
        <div className={style['big-box']}>
            <div className={style['sub-box']}>
                <h1>业务架构</h1>
                <div className={style.yewu}>
                    <img style={{width:'426px'}} src={partTwo.img} alt=""/>
                    <ul className={style.middle}>
                        {partTwo.liArray.map(item=>{
                            return item;
                        })}
                    </ul>
                </div>
            </div>
            <div className={style['sub-box']}>
                <h1>接入流程</h1>
                <div style={{marginTop:10}} className="fast">
                    {partThree.mustCert?<p>接入本产品需要先完成<Button style={{marginLeft:9}} size="small" type="primary" onClick={jump.bind(this,'/pages/auth')}>企业认证</Button></p>:null}
                    <div className={style.content}>
                        <div className={style.progress}>
                            <OverViewStep onClick={jump.bind(this,'/pages/api_key')} title="新建API Key" type="add_api_key"/>
                            {partThree.serviceId?<DownLoadSdk productId={partThree.serviceId}>
                                <OverViewStep title="下载SDK" type="sdk"/>
                            </DownLoadSdk>:null}
                            <OverViewStep onClick={open.bind(this,getDocUrl(partThree.sdkDocUrl))} title="本地集成" type="bendilianjie"/>
                            <OverViewStep isLast title="接入成功" type="complete" />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1>计费规则</h1>
                <div>
                    本服务按次计费，每次{partFour.money}元，具体扣费规则请查看<a target='_black' style={{textDecoration:'underline'}} href={getDocUrl(partFour.moenyDoc)}> 计费规则文档</a>
                </div>
            </div>
        </div>
    );
};

export class BaseOverview extends React.Component {

    constructor(props){
        super(props);
        this.state={
            visible:false,
            isShowVideo:false
        };
    }

    scrollToAnchor = (anchorName) => {
        jump('.fast',{
            duration: 500
        });
    }


    handleCancel = ()=>{
        this.setState({visible:false});
    }

    jump = (url)=>{
        this.props.history.push(url);
    }
    open = (url)=>{
        window.open(url);
    }

    toggleDemoVideo = ()=>{
        this.setState({isShowVideo:!this.state.isShowVideo});
    }

    render() {
        const {infos,top} = this.props;
        if(!infos){
            return null;
        }
        const {partOne} = top;

        return (
            <div className={style.overview}>
                <CardLayer className={style.title_main}>
                    <div className={style.title}>
                        <div style={{width:555}}>
                            <h1>{partOne.title}</h1>
                            <p>{partOne.content}</p>
                            <ul>
                                <li>接入简单</li>
                                <li>识别精度高</li>
                                <li>用户体验好</li>
                            </ul>
                            <Button size='small' onClick={this.scrollToAnchor} className={style.title_a} >快速接入</Button>
                            <Button size='small' className={style.title_a} target='_black' href={getDocUrl(partOne.docUrl)}>接入文档</Button>
                            <Button size='small' className={style.title_a} onClick={this.toggleDemoVideo}>Demo演示</Button>
                            <DownLoadDemo tabs={partOne.tabs}>
                                <Button size='small' className={style.title_a}>Demo下载</Button>
                            </DownLoadDemo>
                            <Button size='small' className={style.title_a} onClick={()=> this.props.history.push(`/pages/buy_package?service=${partOne.service}&bundle=${partOne.bundle}`)}>购买资源包</Button>
                        </div>
                        <img style={{width:'440px',marginLeft:30}} src={partOne.img} alt=""/>
                    </div>
                </CardLayer>
                <CardLayer className={style.title_main}>
                    <Tabs defaultActiveKey="0">
                        {this.props.infos.map((item,key)=>{
                            return <TabPane tab={item.name} key={key+''}><ProductInfo history={this.props.history} info={item}/></TabPane>;
                        })}
                    </Tabs>
                </CardLayer>
                <Modal
                    title=""
                    wrapClassName={style.videoBox}
                    visible={this.state.isShowVideo}
                    footer={null}
                    onCancel={this.toggleDemoVideo}
                    destroyOnClose={true}
                    width={360}
                >
                    <video controls width="360" height="622" autoplay="autoplay">
                        <track kind="captions"/>
                        <source src={partOne.videoDemo} type="video/mp4" />
                    </video>
                </Modal>
            </div>
        );
    }

}
BaseOverview.contextTypes = {
    router: PropTypes.object
};

function select(state) {
    return {
        account: state.account.info
    };
}
export default connect(select)(withRouter(BaseOverview));



// WEBPACK FOOTER //
// ./src/components/OverviewComponents/TabOverview.js