export const routerConfig = {
    '/login': {
        title: '登录-FaceID自助接入服务'
    },
    '/register': {
        title: '注册-FaceID自助接入服务'
    },
    '/reset-password': {
        title: '重置密码-FaceID自助接入服务'
    },
    '/forget-password': {
        title: '找回密码-FaceID自助接入服务'
    },
    '/pages': {
        title: '概览'
    },
    '/pages/index': {
        title: '概览'
    },
    '/pages/api_key/:id': {
        title: '查看API Key',
        breadcrumb: [
            ['概览', '/pages'],
            // ['API Key管理', '/pages/api_key'],
            ['API Key管理', ':path'],
            ['查看API Key']
        ]
    },
    '/pages/auth': {
        title: '企业信息',
        breadcrumb: [
            ['概览', '/pages'],
            ['企业信息']
        ]
    },
    '/pages/api_key': {
        title: 'API Key管理',
        breadcrumb: [
            ['概览', '/pages'],
            ['API Key管理']
        ]
    },
    '/pages/financial': {
        title: '账户余额',
        breadcrumb: [
            ['概览', '/pages'],
            ['账户余额']
        ]
    },
    '/pages/sc_overview': {
        title: '人脸核身-产品概述',
    },
    '/pages/sc_statistics': {
        title: '人脸核身-数据概览',
    },
    '/pages/home': {
        title: '账号信息',
        breadcrumb: [
            ['概览', '/pages'],
            ['账号信息']
        ]
    },
    '/pages/order': {
        title: '充值记录',
        breadcrumb: [
            ['概览', '/pages'],
            ['充值记录']
        ]
    },
    '/pages/sc_result': {
        title: '人脸核身-结果查询',
        breadcrumb: [
            ['概览', '/pages'],
            ['结果查询'],
        ]
    },
    '/pages/invoice': {
        title: '发票申请'
    },
    '/pages/idcard_overview': {
        title: '身份证识别-产品概述'
    },
    '/pages/idcard_statistics': {
        title: '身份证识别-数据概览'
    },
    '/pages/idcard_result': {
        title: '身份证识别-结果查询',
        breadcrumb: [
            ['概览', '/pages'],
            ['结果查询'],
        ]
    },
    '/pages/uc_overview': {
        title: '人脸比对-产品概述'
    },
    '/pages/uc_statistics': {
        title: '人脸比对-数据概览'
    },
    '/pages/uc_result': {
        title: '人脸比对-结果查询',
        breadcrumb: [
            ['概览', '/pages'],
            ['结果查询'],
        ]
    },
    '/pages/sdk_download': {
        title: 'SDK下载'
    },
    '/pages/information': {
        title: '消息中心'
    },
    '/pages/voucher_manage': {
        title: '代金券管理',
        breadcrumb: [
            ['概览', '/pages'],
            ['代金券管理'],
        ]
    },
    '/pages/resource_package_manage': {
        title: '资源包管理',
        breadcrumb: [
            ['概览', '/pages'],
            ['资源包管理'],
        ]
    },
    '/pages/resource_package_consumption/:id': {
        title: '用量详情',
        breadcrumb: [
            ['概览', '/pages'],
            ['资源包管理', '/pages/resource_package_manage'],
            ['用量详情'],
        ]
    },
    '/admin/pages/consumption': {
        title: '用量',
        breadcrumb: [
            ['用量']
        ]
    },
    '/admin/pages/consumption/:data': {
        title: '用量',
        breadcrumb: [
            ['用量', '/admin/pages/consumption'],
            [':name']
        ]
    },
    '/admin/pages/client': {
        title: '用户管理',
        breadcrumb: [
            ['用户管理']
        ]
    },
    '/admin/pages/client/:id': {
        title: '用户管理',
        breadcrumb: [
            ['用户管理', '/admin/pages/client'],
            ['详情']
        ]
    },
    '/admin/pages/tran_approval': {
        title: '订单管理',
        breadcrumb: [
            ['订单管理']
        ]
    },
    '/admin/pages/information': {
        title: '消息管理'
    },
    '/admin/pages/information/create': {
        title: '新建消息',
        breadcrumb: [
            ['消息管理', '/admin/pages/information'],
            ['新建消息']
        ]

    },
    '/admin/pages/information/update/:id': {
        title: '修改消息',
        breadcrumb: [
            ['消息管理', '/admin/pages/information'],
            ['修改消息']
        ]

    },
    '/admin/pages/coupon': {
        title: '代金券管理'
    },
    '/admin/pages/coupon/create': {
        title: '创建代金券',
        breadcrumb: [
            ['代金券管理', '/admin/pages/coupon'],
            ['创建代金券']
        ]
    },
    '/admin/pages/coupon/update/:id': {
        title: '编辑代金券',
        breadcrumb: [
            ['代金券管理', '/admin/pages/coupon'],
            ['编辑代金券']
        ]
    },
    '/admin/pages/invitation-code': {
        title: '邀请码管理',
        breadcrumb: [
            ['邀请码管理']
        ]
    },
    '/admin/pages/:username/:serviceID/invitation-code': {
        title: '邀请码管理',
        breadcrumb: [
            ['邀请码管理']
        ]
    },
    '/admin/pages/invitation-code/create': {
        title: '邀请码管理',
        breadcrumb: [
            ['邀请码管理', '/admin/pages/invitation-code'],
            ['创建邀请码']
        ]
    },
    '/admin/pages/account': {
        title: '账号管理',
        breadcrumb: [
            ['账号管理']
        ]
    },
    '/admin/pages/account/create': {
        title: '创建账号',
        breadcrumb: [
            ['账号管理', '/admin/pages/account'],
            ['创建账号']
        ]
    },
    '/admin/pages/account/update/:id': {
        title: '编辑账号',
        breadcrumb: [
            ['账号管理', '/admin/pages/account'],
            ['编辑账号']
        ]
    },
    '/admin/pages/perms': {
        title: '角色管理',
        breadcrumb: [
            ['角色管理']
        ]
    },
    '/admin/pages/perms/create': {
        title: '角色管理',
        breadcrumb: [
            ['角色管理', '/admin/pages/perms'],
            ['创建角色']
        ]
    },
    '/admin/pages/perms/update/:id': {
        title: '角色管理',
        breadcrumb: [
            ['角色管理', '/admin/pages/perms'],
            ['编辑角色']
        ]
    },
    '/admin/pages/perms/accredit/:id': {
        title: '角色管理',
        breadcrumb: [
            ['角色管理', '/admin/pages/perms'],
            ['管理成员']
        ]
    },
    '/admin/pages/perms/view': {
        title: '授权概览',
        breadcrumb: [
            ['授权概览']
        ]
    },
    '/admin/pages/password/update': {
        title: '修改密码',
        breadcrumb: [

        ]
    }
};



// WEBPACK FOOTER //
// ./src/utils/routerConfig.js