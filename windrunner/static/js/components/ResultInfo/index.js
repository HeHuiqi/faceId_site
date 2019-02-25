import React from 'react';
import style from './index.less';
import ModalTitle from 'components/ModalTitle';

class ResultInfo extends React.Component {

    render() {
        return (
            <div>
                <ModalTitle>基本信息</ModalTitle>
                <table className={style.infoTable}>
                    {this.props.info.map(item=>{
                        return <tr>
                            <td>{item.name}</td>
                            <td>{item.value}</td>
                        </tr>;
                    })}
                </table>
                {this.props.other}
            </div>
        );
    }
}

export default ResultInfo;



// WEBPACK FOOTER //
// ./src/components/ResultInfo/Overview.js