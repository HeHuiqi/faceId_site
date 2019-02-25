import {
    Modal
} from 'antd';
const formError = (err, form, autoModal = true) => {
    if (err.code === 999) {
        const errObj = err.msg;
        const errValue = {};
        Object.keys(errObj).forEach(item => {
            errValue[item] = {
                value: form.getFieldValue(item),
                errors: [new Error(errObj[item].join(','))]
            };
        });
        form.setFields(errValue);
    } else {
        if (autoModal) {
            Modal.error({
                title: '错误',
                content: err.msg
            });
        }
    }
};

export default formError;



// WEBPACK FOOTER //
// ./src/utils/formError.js