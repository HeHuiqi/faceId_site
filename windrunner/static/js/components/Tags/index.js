import React from 'react';
import {Tag, Input, Tooltip, Icon} from 'antd';
import PropTypes from 'prop-types';
import style from './index.less';

class Tags extends React.Component {
    state = {
        tags: this.props.values || [],
        inputVisible: false,
        inputValue: ''
    }
    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState({tags:value});
        }
    }
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.props.onChange(tags);
        this.setState({ tags });
    }
    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }
    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }

        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
        this.props.onChange(tags);
    }

    render() {
        const {tags, inputVisible, inputValue} = this.state;
        return (
            <div className={this.props.border ? style.border: ''}>
                {tags.map((tag, index)=> {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible && (
                    <Input
                        ref={input => this.input = input}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                    >
                        <Icon type="plus" /> 标签
                    </Tag>
                )}
            </div>
        );
    }
}
Tags.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    multiple: PropTypes.bool
};
export default Tags;



// WEBPACK FOOTER //
// ./src/components/Tags/Overview.js