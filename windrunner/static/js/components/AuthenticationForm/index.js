import React from 'react';
import { Form, Input, Checkbox, Radio, DatePicker, Select, Col, Modal,Row } from 'antd';
import {IDTYPE, PERSON_STATUS, FORMITEM_OPTIONS} from './const';
import style from './index.less';
import { downLoad,STATUS} from 'utils/const';
import moment from 'moment';
import CardLayerInset from 'components/CardLayerInset';
import {getRealUrl} from 'utils/request';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const DATE_VALUE = [
    'card_valid_start',
    'card_valid_end',
    'representative_idcard_valid_start',
    'representative_idcard_valid_end',
    'agent_idcard_valid_start',
    'agent_idcard_valid_end'
];
const wrapWithNormalItem = function(form,options,layout,showWord) {
    return function(props) {
        const { label, name,render } = props;
        const { getFieldDecorator } = form;
        const option = options[name];
        const text = render?render(option['initialValue']):option['initialValue'];

        if(showWord){
            return (<FormItem
                    {...props}
                    {...layout}
                    label={<span className={style.required}>{label}</span>}

                >
                    {text}
                </FormItem>
            );
        }
        return(
            <FormItem
                {...props}
                {...layout}
                label={label}
            >
                {getFieldDecorator(name, option)(
                    props.children
                )}
            </FormItem>
        );
    };
};


class UploadItem extends React.Component {

    constructor(props){
        super(props);
        const { options, name } = this.props;
        const _option = { ...options[name] };
        this.oldUrl =  _option.initialValue?getRealUrl('/user/image/'+ _option.initialValue):_option.initialValue;
        this.state = {
            showImg: null,
            hidePreview: false,
            preview: this.oldUrl,
            isPreview: FileReader?true: false
        };
        this.file = null;
        const { eiditable } = this.props;
        if (eiditable){
            delete _option.initialValue;
            _option.valuePropName = 'unknow';
            _option.getValueFromEvent = (e) => {
                if(!e.target.files[0] && this.file){
                    return this.file;
                }
                return e.target.files[0];
            };
            if (this.oldUrl) {
                _option.rules = [];
            }
            _option.rules.push({
                validator:(rule, file, callback)=>{
                    //debugger;
                    file = file || this.file;
                    if(!file){
                        callback();
                        return;
                    };
                    const isLt2M = file.size / 1024 / 1024 < 1.5;
                    if (!isLt2M) {
                        callback('图片大小不可超过1.5M');
                        return;
                    }
                    callback();
                }
            });
        }
        this.option = _option;
    }

    hideModal = ()=>{
        this.setState({ showImg: null });
    }
    onClick = () =>{
        this.setState({ showImg: this.state.preview});
    }
    onDownload = ()=>{
        downLoad(this.state.preview);
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    handleChange = (e) => {
        if (!e.target.files[0]) {
            return;
        }
        this.file = e.target.files[0];
        if(this.state.isPreview){
            this.setState({ preLoading: true });
            this.getBase64(e.target.files[0], imageUrl => this.setState({
                preview: imageUrl,
                preLoading: false
            }));
        }

    }

    render(){
        const { form, eiditable, isAdmin, name } = this.props;
        const { getFieldDecorator } = form;
        let upload = <div>
            {(!this.state.hidePreview && this.state.preview) ? <img style={{ height: 50, marginRight: 10 }} alt="证件照片" src={this.state.preview} /> : null}
            <div style={{position:'relative',width:88,display:'inline-block'}}>
                <a className='ant-btn ant-btn-primary'>上传文件
                    {getFieldDecorator(name, this.option)(
                        <input className={style.inputFile}  accept="image/*" onChange={this.handleChange} type="file" />
                    )}
                </a>
            </div>
        </div>;

        if (!isAdmin){
            if (!eiditable){
                upload = <img src={this.state.preview} style={{ width: 100 }} alt="证件照片" />;
            }
        }else{
            upload = <div>
                <a onClick={this.onClick.bind(this)}><img src={this.state.preview} style={{ width: 100, marginRight: 10 }} alt="证件照片" /></a>
                <a className="ant-btn ant-btn-primary" onClick={this.onDownload.bind(this)} href={this.state.preview} download='证件照片'>
                    下载文件
                </a>
            </div>;
        }
        const layout = {
            labelCol: { style:{textAlign: 'left',marginRight:'0'},sm: { span: 9 } },
            wrapperCol: { sm: { span: 15 }},
        };

        return(
            <FormItem
                {...layout}
                label={this.props.label}
            >
                {upload}
                <Modal
                    visible={this.state.showImg}
                    footer={null}
                    onCancel={this.hideModal}
                >
                    <img src={this.state.showImg} style={{ width: '100%' }} alt="证件照片" />
                </Modal>
            </FormItem>
        );
    }
}

class RangeDate extends React.Component {
    constructor(props){
        super(props);
        const option = props.option[props.data.long] || {};
        this.state = {
            end_disable: option.initialValue || false
        };
        this._endDate = null;
    }
    onExpireDateLongChange = (e)=>{
        this.setState({ end_disable: e.target.checked});
        const {data} = this.props;
        const {setFieldsValue,getFieldValue} = this.props.form;
        if(e.target.checked){
            this._endDate = getFieldValue(data.end);
            setFieldsValue({[data.end]:null});
        }else{
            setFieldsValue({[data.end]:this._endDate});
        }
    }

    disabledEndDate=(endValue)=>{
        const startValue = this.props.form.getFieldValue(this.props.data.start);
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.clone().endOf('day') <= startValue.clone().endOf('day');
    }

    disabledStartDate = (startValue)=>{
        const endValue = this.props.form.getFieldValue(this.props.data.end);
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }


    render(){
        const {formItemLayout, eiditable, data, option,title,form } = this.props;
        const { start, end, long } = data;
        const {getFieldDecorator} = form;
        const endOption = option[end];
        if(eiditable){
            return(
                <FormItem
                    label={<span className={style.required}>{title}</span>}
                    {...formItemLayout}>
                    {option[start].initialValue}&nbsp;&nbsp;至&nbsp;&nbsp;{this.state.end_disable?'长期':endOption.initialValue}
                </FormItem>
            );
        }



        endOption.rules = [{
            validator: (rule, value, callback) => {
                if (!value && !this.state.end_disable) {
                    callback('有效期结束时间不能为空');
                }
                callback();
            }
        }];

        const endPick = <DatePicker
            style={{width:'100%'}}
            disabled={this.state.end_disable}
            disabledDate={this.disabledEndDate} />;
        let endPickDom = getFieldDecorator(end, endOption)(endPick);
        if(this.state.end_disable){
            endPickDom = endPick;
        }
        return (
            <FormItem
                label={<span className={style.required}>{title}</span>}
                {...formItemLayout}>
                <Row>
                    <Col span={11}>
                        <FormItem>
                            {getFieldDecorator(start, option[start])(
                                <DatePicker
                                    style={{width:'100%'}}
                                    disabledDate={this.disabledStartDate} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                            -
                        </span>
                    </Col>
                    <Col span={11}>
                        <FormItem>
                            {endPickDom}
                        </FormItem>
                    </Col>
                    <div style={{position:'absolute',width:'80px',right:'-80px'}}>
                        {getFieldDecorator(long, option[long])(
                            <Checkbox style={{ float: 'right' }}
                                      disabled={eiditable}
                                      onChange={this.onExpireDateLongChange}>长期</Checkbox>
                        )}
                    </div>
                </Row>
            </FormItem>
        );
    }
}

const InlineLayout = {
    labelCol: { style: {width: '150px',marginRight:'30px'},sm: { span: 4 } },
    wrapperCol: {  style: {display: 'inline-block',width:'600px'},sm: { span: 16 }},
};
const editEmpty = ['company_card_image', 'representative_idcard_front', 'representative_idcard_back', 'agent_idcard_front', 'agent_idcard_back', 'agent_loa'];
const alwaysEmpty = ['card_valid_forever','representative_idcard_valid_forever','agent_idcard_valid_forever'];
class AuthenticationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authInfo: props.authInfo, //验证信息
            eiditable: props.eiditable,
            options: FORMITEM_OPTIONS,
            lisenceFileList: [],
            idcardFrontFileList: [],
            idcardBackFileList: []
        };
        const {form} = this.props;
        this.NormalItem = wrapWithNormalItem(form,this.state.options,InlineLayout,!this.state.eiditable);
    }
    componentDidMount(){
        if(this.state.eiditable && this.props.authInfo.status === STATUS.DISMISSAL){
            this.props.form.validateFields(err=>{
                this.props.onFininsh(!err);
            });
        }
    }

    componentDidUpdate(){
        const error = this.props.form.getFieldsError();
        const value = this.props.form.getFieldsValue();
        const _err = Object.keys(error).filter((item)=>{
            if(typeof error[item] !== 'undefined'){
                return true;
            }
            return false;
        });
        const _valueEmpty = Object.keys(error).filter((item)=>{
            if(typeof value[item] === 'undefined' || value[item] === null){
                //特殊处理有效期长期问题
                const timeEnd = {
                    card_valid_end:'card_valid_forever',
                    representative_idcard_valid_end:'representative_idcard_valid_forever',
                    agent_idcard_valid_end:'agent_idcard_valid_forever',
                };
                if(timeEnd[item] && value[timeEnd[item]]){
                    return false;
                }
                if(alwaysEmpty.includes(item)){
                    return false;
                }
                //特殊处理编辑状态的图片上传
                if(this.props.authInfo.status === STATUS.DISMISSAL && editEmpty.includes(item)){
                    return false;
                }
                return true;
            }
            return false;
        });

        this.props.onFininsh && this.props.onFininsh(_err.length === 0 && _valueEmpty.length === 0);

    }

    componentWillMount() {
        const {authInfo} = this.props;
        let isUniformLisence = 0,//证件类型是否为多证合一营业执照
            isLegal = 0;//填写人为法定代表人
        const {options} = this.state;

        if (authInfo && authInfo.status !== STATUS.UNCERTIFIED) {
            // 设置initialValue
            Object.keys(options).forEach((key)=> {
                if(authInfo[key]){
                    if (DATE_VALUE.includes(key)){
                        options[key]['initialValue'] = this.state.eiditable?moment(authInfo[key]):authInfo[key];
                    }else{
                        options[key]['initialValue'] = authInfo[key] + '';
                    }
                }
            });
            if (authInfo.card_type){
                isUniformLisence = authInfo.card_type;
            }
            if (authInfo.register_user_type){
                isLegal = authInfo.register_user_type;
            }
        }
        this.setState({options, isUniformLisence, isLegal});
    }


    onRadioChange = (type,e)=> {
        let { isLegal, isUniformLisence } = this.state;
        const value = parseInt(e.target.value, 10);
        switch (type) {
            case 'card_type':
                isUniformLisence = value;
                break;
            case 'register_user_type':
                isLegal = value;
                break;
            default:
                break;
        }
        this.setState({isUniformLisence, isLegal});

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(null,{ force:true},(err, values) => {
            if (!err){
                const params = {};
                Object.keys(values).forEach(item => {
                    if (moment.isMoment(values[item])) {
                        params[item] = values[item].format('YYYY-MM-DD');
                    } else if (typeof values[item] !== 'undefined' && values[item]!== null){
                        if (typeof values[item] === 'boolean'){
                            params[item] = values[item]?1:0;
                        }else{
                            params[item] = values[item];
                        }

                    }
                });
                this.props.submit(params);
            }
        });
    }

    getForm(){
        return this.props.form;
    }

    beforeUpload(key, file) {
        return false;
    }
    onRemoveFile(key, file){
        const fileList = this.state[key];
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        this.setState({[key] :newFileList});
    }

    render() {

        const {options, isUniformLisence, isLegal} =  this.state;
        const NormalItem = this.NormalItem;
        return (
            <Form onSubmit={this.handleSubmit}>
                <CardLayerInset title='企业信息'>
                    <NormalItem
                        name="card_type"
                        label="证件类型"
                        render={(text)=>IDTYPE[text]}
                    >
                        <RadioGroup onChange={this.onRadioChange.bind(this, 'card_type')}>
                            {Object.keys(IDTYPE).map(element => {
                                return <Radio value={element}>{IDTYPE[element]}</Radio>;
                            })}
                        </RadioGroup>
                    </NormalItem>

                    <NormalItem
                        label="企业名称"
                        name="company_name"
                    >
                        <Input placeholder="与营业执照保持一致"/>
                    </NormalItem>
                    <NormalItem
                        label="注册所在地"
                        name="register_address"
                    >
                        <Input placeholder="与营业执照保持一致"/>
                    </NormalItem>

                    {
                        isUniformLisence === 0 ?
                            <NormalItem
                                key={4}
                                label="统一社会信用代码"
                                name="social_credit_identifier"
                            >
                                <Input placeholder="如：00000000001234"/>
                            </NormalItem> :
                            <NormalItem
                                key={5}
                                label="营业执照注册码"
                                name="license_registration_number"
                            >
                                <Input placeholder="如：00000000001234"/>
                            </NormalItem>
                    }
                    <RangeDate
                        title="有效期"
                        form={this.props.form}
                        formItemLayout={InlineLayout}
                        eiditable={!this.state.eiditable}
                        option={options}
                        data={
                            {
                                start: 'card_valid_start',
                                end: 'card_valid_end',
                                long: 'card_valid_forever'
                            }
                        }

                    />
                    {
                        isUniformLisence===0 ? null :
                            <NormalItem
                                label="组织机构代码"
                                name="organization_code"
                            >
                                <Input placeholder="如：7765XXXX-2" />
                            </NormalItem>
                    }
                    <FormItem
                        {...InlineLayout}
                        label={<span className={style.required}>上传证件照片</span>}
                    >
                        <UploadItem
                            formItemLayout = {InlineLayout}
                            name="company_card_image"
                            form={this.props.form}
                            isAdmin={this.props.isAdmin}
                            eiditable={this.state.eiditable}
                            options={options}
                        />
                    </FormItem>
                </CardLayerInset>
                <CardLayerInset title='法定代表人信息'>
                    <NormalItem
                        label="法定代表人归属地"
                        name="region"
                        render={()=>'中国大陆'}
                    >
                        <Select disabled={!this.state.eiditable}>
                            <Option value="china">中国大陆</Option>
                        </Select>
                    </NormalItem>
                    <NormalItem
                        label="法定代表人姓名"
                        name="legal_representative_name"
                    >
                        <Input placeholder=""/>
                    </NormalItem>
                    <NormalItem
                        label="身份证号"
                        name="representative_idcard_number"
                    >
                        <Input placeholder=""/>
                    </NormalItem>
                    <RangeDate
                        title="身份证有效期"
                        form={this.props.form}
                        formItemLayout={InlineLayout}
                        eiditable={!this.state.eiditable}
                        option={options}
                        data={
                            {
                                start: 'representative_idcard_valid_start',
                                end:'representative_idcard_valid_end',
                                long:'representative_idcard_valid_forever'
                            }
                        }

                    />
                    <NormalItem
                        label="填写人身份"
                        name="register_user_type"
                        render={(text)=>PERSON_STATUS[text]}
                    >
                        <RadioGroup disabled={!this.state.eiditable} onChange={this.onRadioChange.bind(this, 'register_user_type')}>
                            {Object.keys(PERSON_STATUS).map((key)=> {
                                return <Radio value={key}> {PERSON_STATUS[key]} </Radio>;
                            })}
                        </RadioGroup>
                    </NormalItem>
                    <FormItem
                        {...InlineLayout}
                        label={<span className={style.required}>法定代表人身份证</span>}
                    >
                        <Col span={12}>
                            <UploadItem
                                label="身份证人像面"
                                name="representative_idcard_front"
                                form={this.props.form}
                                eiditable={this.state.eiditable}
                                isAdmin={this.props.isAdmin}
                                options={options}
                            />
                        </Col>
                        <Col span={12}>
                            <UploadItem
                                label="身份证国徽面"
                                name="representative_idcard_back"
                                form={this.props.form}
                                eiditable={this.state.eiditable}
                                isAdmin={this.props.isAdmin}
                                options={options}
                            />
                        </Col>
                    </FormItem>
                </CardLayerInset>
                {
                    isLegal === 0 ? null :
                        <CardLayerInset title='代理人信息'>

                            <NormalItem
                                label="代理人姓名"
                                name="agent_name"
                            >
                                <Input />
                            </NormalItem>
                            <NormalItem
                                label="身份证号"
                                name="agent_idcard_number"
                            >
                                <Input />
                            </NormalItem>
                            <RangeDate
                                title="身份证有效期"
                                form={this.props.form}
                                formItemLayout={InlineLayout}
                                eiditable={!this.state.eiditable}
                                option={options}
                                data={
                                    {
                                        start: 'agent_idcard_valid_start',
                                        end: 'agent_idcard_valid_end',
                                        long: 'agent_idcard_valid_forever'
                                    }
                                }

                            />
                            <FormItem
                                {...InlineLayout}
                                label={<span className={style.required}>代理人人身份证</span>}
                            >
                                <Col span={12}>
                                    <UploadItem
                                        label="身份证人像面"
                                        name="agent_idcard_front"
                                        form={this.props.form}
                                        eiditable={this.state.eiditable}
                                        isAdmin={this.props.isAdmin}
                                        options={options}
                                    />
                                </Col>
                                <Col span={12}>
                                    <UploadItem
                                        label="身份证国徽面"
                                        name="agent_idcard_back"
                                        form={this.props.form}
                                        eiditable={this.state.eiditable}
                                        isAdmin={this.props.isAdmin}
                                        options={options}
                                    />
                                </Col>
                            </FormItem>
                            <FormItem
                                {...InlineLayout}
                                label={<span className={style.required}>上传授权函</span>}
                            >
                                <UploadItem
                                    formItemLayout = {InlineLayout}
                                    name="agent_loa"
                                    form={this.props.form}
                                    isAdmin={this.props.isAdmin}
                                    eiditable={this.state.eiditable}
                                    options={options}
                                />
                            </FormItem>
                        </CardLayerInset>
                }
                {this.props.children}
            </Form>
        );
    }
}
const WrappedAuthenticationForm = Form.create({
    // onFieldsChange:(props, fields)=>{
    //     debugger;
    // }
})(AuthenticationForm);

export default WrappedAuthenticationForm;



// WEBPACK FOOTER //
// ./src/components/AuthenticationForm/Overview.js