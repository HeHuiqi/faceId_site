import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BaseClientConsumption from 'components/BaseClientConsumption';
import CardLayerInset from 'components/CardLayerInset';
import { setBreadcrumb } from 'actions/pageData';
import { withRouter } from 'react-router-dom';
import { getStatisticsById,exportStatisticsById } from 'actions/adminClients';
import moment from 'moment';

class Consumption extends React.Component {


    componentDidMount() {
        const params = JSON.parse(this.props.match.params.data);
        this.props.setBreadcrumb({ name: params.username });
    }

    render() {
        const params = JSON.parse(this.props.match.params.data);
        const getData = getStatisticsById(params.id);
        return (
            <CardLayerInset title="消费统计">
                <BaseClientConsumption
                    admin
                    outUrl={exportStatisticsById(params.id)}
                    rangeTime={[moment(params.start_date),moment(params.end_date)]}
                    getData={getData}
                />
            </CardLayerInset>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return {
        setBreadcrumb: bindActionCreators(setBreadcrumb, dispatch)
    };
}
const ConsumptionRedux = connect(null, mapDispatchToProps)(Consumption);
export default withRouter(ConsumptionRedux);



// WEBPACK FOOTER //
// ./src/pages/Admin/ClientConsumption/Overview.js