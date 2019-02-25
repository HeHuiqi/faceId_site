import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {Breadcrumb} from 'antd';
import style from './Breadcrumbs.less';
import pathToRegexp from 'path-to-regexp';

class Breadcrumbs extends React.Component {
    constructor(props) {
        super(props);
        this.routes = [];
    }

    setRoutes() {
        let params = this.parseParams();
        params = {...params, ...this.props.bc_params};
        let routes = [];
        if(Array.isArray(this.props.breadcrumb) && this.props.breadcrumb.length > 0) {
            routes = this.props.breadcrumb.map((item)=> {
                let name, path;
                try{
                    const toPathName = pathToRegexp.compile(item[0]);
                    name = decodeURI(toPathName(params));
                }catch(e){
                    name = item[0];
                }
                if(item[1]){
                    try{
                        const toPathName = pathToRegexp.compile(item[1]);
                        path = unescape(toPathName(params));
                    }catch(e){
                        path = item[1];
                    }
                }
                return {path, name};
            });
        }
        this.routes = routes;
    }
    parseParams(){
        const route = this.props.route;
        if(!route){
            return {};
        }
        const path = this.props.path;
        const keyWords = [];
        const re = pathToRegexp(route, keyWords);
        const res = re.exec(path);
        const params = {};
        keyWords.forEach((item,key)=>{
            if (res){
                params[item.name] = res[key + 1];
            }
        });

        return params;
    }


    itemRender(route, params, routes, paths) {
        const last = routes.indexOf(route) === routes.length - 1;
        return last ? <span>{route.name}</span> : <Link to={route.path}>{route.name}</Link>;
    }

    render() {
        this.setRoutes();
        if(this.routes.length === 0){
            return <div></div>;
        }
        return <div className={style.header}>
            <Breadcrumb className={style.breadcrumb}
                        routes={this.routes}
                        itemRender={this.itemRender.bind(this)}>
            </Breadcrumb>
        </div>;
    }

}
function select(state) {
    return {
        breadcrumb: state.pageData.breadcrumb,
        route: state.pageData.route,
        path: state.pageData.path,
        bc_params: state.pageData.bc_params
    };
}

export default connect(select)(Breadcrumbs);



// WEBPACK FOOTER //
// ./src/components/Breadcrumbs.js