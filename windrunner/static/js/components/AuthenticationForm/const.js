export const IDTYPE = { //证件类型
    0: '多证合一营业执照',
    1: '普通营业执照',
};
export const PERSON_STATUS = { //填写人身份
    0: '我是法定代表人',
    1: '我是代理人'
};
const regNumAndLetter = /^[A-Za-z0-9]+$/;
const idCard = /^([0-9a-zA-Z]{15}|[0-9a-zA-Z]{18})$/;
export const FORMITEM_OPTIONS = {
    'card_type': {
        rules: [{
            required: true,
            message: '证件类型不能为空'
        }],
        initialValue: '0'
    },
    'card_valid_forever': {
        valuePropName: 'checked'
    },
    'representative_idcard_valid_forever': {
        valuePropName: 'checked'
    },
    'agent_idcard_valid_forever': {
        valuePropName: 'checked'
    },
    'company_name': {
        validateFirst: true,
        validateTrigger: 'onChange',
        rules: [{
                required: true,
                message: '企业名称不能为空'
            },
            {
                max: '512',
                message: '企业名称不能超过512个字符'
            },
        ]
    },
    'register_address': {
        validateFirst: true,
        validateTrigger: 'onChange',
        rules: [{
                required: true,
                message: '住所(注册所在地)不能为空'
            },
            {
                max: '512',
                message: '住所不能超过512个字符'
            },
        ]
    },
    'social_credit_identifier': {
        validateFirst: true,
        validateTrigger: 'onChange',
        normalize: (value) => {
            if (value) {
                value = value + '';
                return value.toUpperCase();
            }
            return value;
        },
        rules: [{
                required: true,
                message: '统一社会信用代码不能为空'
            },
            {
                len: 18,
                message: '统一社会信用代码为18位'
            },
            {
                pattern: regNumAndLetter,
                message: '统一社会信用代码为数字或字母'
            },
        ]
    },
    'license_registration_number': {
        validateFirst: true,
        validateTrigger: 'onChange',
        rules: [{
                required: true,
                message: '营业执照注册码不能为空'
            },
            {
                len: 15,
                message: '营业执照注册码为15位'
            },
            {
                pattern: regNumAndLetter,
                message: '营业执照注册码为数字或字母'
            }
        ]
    },
    'card_valid_start': {
        rules: [{
            required: true,
            message: '有效期开始时间不能为空'
        }]
    },
    'card_valid_end': {
        rules: [{
            required: true,
            message: '有效期结束时间不能为空'
        }]
    },
    'organization_code': {
        validateFirst: true,
        validateTrigger: 'onChange',
        rules: [{
                required: true,
                message: '组织机构代码不能为空'
            },
            {
                len: 10,
                message: '组织机构代码为10位'
            },
            {
                pattern: /^[A-Za-z0-9-]+$/,
                message: '组织机构代码为数字或字母'
            }
        ]
    },
    'company_card_image': {
        rules: [{
            required: true,
            message: '请上传证件照片'
        }],
    },
    'region': {
        rules: [{
            required: true,
            message: '法定代表人归属地不能为空'
        }],
        initialValue: 'china'
    },
    'legal_representative_name': {
        validateFirst: true,
        validateTrigger: 'onChange',
        rules: [{
                required: true,
                message: '法定代表人姓名不能为空'
            },
            {
                max: 64,
                message: '法定代表人姓名超过64个字符'
            },
        ]
    },
    'representative_idcard_number': {
        validateFirst: true,
        validateTrigger: 'onChange',
        rules: [{
                required: true,
                message: '法定代表人身份证号不能为空'
            },
            {
                pattern: idCard,
                message: '法定代表人身份证号格式错误'
            }
        ]
    },
    'representative_idcard_valid_start': {
        rules: [{
            required: true,
            message: '有效期开始时间不能为空'
        }]
    },
    'representative_idcard_valid_end': {
        rules: [{
            required: true,
            message: '有效期结束时间不能为空'
        }]
    },
    'register_user_type': {
        rules: [{
            required: true,
            message: '填写人身份不能为空'
        }],
        initialValue: '0'
    },
    'representative_idcard_front': {
        rules: [{
            required: true,
            message: '请上传法人身份证人像面'
        }]
    },
    'representative_idcard_back': {
        rules: [{
            required: true,
            message: '请上传法人身份证国徽面'
        }]
    },
    'agent_idcard_front': {
        rules: [{
            required: true,
            message: '请上传代理人身份证人像面'
        }]
    },
    'agent_idcard_back': {
        rules: [{
            required: true,
            message: '请上传代理人身份证国徽面'
        }]
    },
    'agent_loa': {
        rules: [{
            required: true,
            message: '请上传授权函'
        }]
    },
    'agent_name': {
        validateFirst: true,
        validateTrigger: 'onChange',
        rules: [{
                required: true,
                message: '代理人姓名不能为空'
            },
            {
                max: 64,
                message: '代理人姓名超过64个字符'
            },
        ]
    },
    'agent_idcard_number': {
        validateFirst: true,
        validateTrigger: 'onChange',
        rules: [{
                required: true,
                message: '代理人身份证号不能为空'
            },
            {
                pattern: idCard,
                message: '代理人身份证号格式错误'
            }

        ]
    },
    'agent_idcard_valid_start': {
        rules: [{
            required: true,
            message: '有效期开始时间不能为空'
        }]
    },
    'agent_idcard_valid_end': {
        rules: [{
            required: true,
            message: '有效期结束时间不能为空'
        }]
    }
};



// WEBPACK FOOTER //
// ./src/components/AuthenticationForm/const.js