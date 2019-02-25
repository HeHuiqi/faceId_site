import React from 'react';
import BaseContent from 'components/BaseContent';
import {Tree, Popover, Spin} from  'antd';
import {getAllPermission, getAccountsOfPermission} from 'actions/permission';
import style from './index.less';

const TreeNode = Tree.TreeNode;
const PERMSTYPE = [{id: 'funcPerms', name: '功能权限'}, {id:'dataPerms', name: '数据权限'}];
class PermsOverview extends React.Component {
    state = {
        funcPerms: [],
        dataPerms: [],
        accounts: [],
        loading: false
    };

    selectTreeNode = (selectedKeys)=> {

        if (selectedKeys.length > 0) {
            const role_id = selectedKeys[0];
            getAccountsOfPermission(role_id).then(e=> {

                this.setState({accounts: e.data});
            }).catch(e=> {
                this.setState({accounts: []});
            });

        }
    }

    async componentWillMount() {
        const params = {start: 0, limit: 10000};
        this.setState({loading: true});
        await getAllPermission(params).then(res=> {
            const pageData = res.data.this_page;

            this.setState({
                funcPerms: pageData.filter(e=> e.perm_type === 0),
                dataPerms: pageData.filter(e=> e.perm_type === 1)
            });
        });
        this.setState({loading: false});
    }
    renderPermsTrees = ()=> {
        return PERMSTYPE.map((type)=> {
            const perms = this.state[type.id];
            if (perms.length <= 0) {
                return null;
            }
            return (
                <Spin spinning={this.state.loading}>
                    <div className={style.title}>
                        {type.name}
                    </div>
                    <Tree onSelect={this.selectTreeNode}>
                        {perms.map(ele=> {
                            const title = (
                                <Popover placement="right"
                                         title={<div className={style.popover}>权限已经授予以下账号</div>}
                                         content={<div className={style.popoveritem}>{this.state.accounts.map(username=> username).join('  ')}</div>}
                                         trigger="click"
                                >
                                    <div>{ele.display_name + '：'+ ele.account_cnt + '人'}</div>
                                </Popover>
                            );
                            return <TreeNode
                                disableCheckbox={false}
                                title={title}
                                key={ele.id}
                                dataRef={ele}
                                isLeaf={true}/>;
                        })}
                    </Tree>
                </Spin>
            );
        });
    }

    render() {
        return (
            <BaseContent>
                <p className={style.overviewTitle}>
                    目前各权限点的授权情况如下（数字代表授权账号个数）。
                </p>
                {this.renderPermsTrees()}

            </BaseContent>
        );
    }
}
export default PermsOverview;


// WEBPACK FOOTER //
// ./src/pages/Admin/Perms/view.js