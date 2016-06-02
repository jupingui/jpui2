/**
 * @file 文本域组件
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2
 */
define(function (require) {


    var React = require('react');
    var InputWidget = require('./mixins/InputWidget');
    var InputWidgetStreem = require('./mixins/InputWidgetStreem');
    var cTools = require('./core/componentTools');


    return React.createClass({
        // @override
        mixins: [InputWidget, InputWidgetStreem],
        // @override
        getDefaultProps: function () {
            return {
                skin: '',
                className: '',
                style: {},
                disabled: false,
                placeholder: '',
                valueTemplate: ''
            };
        },
        // @override
        getInitialState: function () {
            return {};
        },
        focus: function () {
            this.refs.inputbox.focus();
        },
        render: function () {
            var value = this.___getValue___();
            value = value === undefined || value == null ? '' : (value + '');
            var width = cTools.getValueFromPropsAndStyle(this.props, 'width', 400);
            var height = cTools.getValueFromPropsAndStyle(this.props, 'height', 300);
            width = isNaN(width) ? 400 : +width;
            height = isNaN(height) ? 300 : +height;
            var containerProp = cTools.containerBaseProps('textarea', this, {
                style: {
                    width: width,
                    height: height
                }
            })
            var inputProp = {
                ref: 'inputbox',
                disabled: this.props.disabled,
                spellCheck: false,
                // 其实不应该这样写，可是textarea的padding和border会导致整体尺寸变大
                style: {
                    width: width - 22,
                    height: height - 22
                },
                onCompositionStart: this.___onCompositionStart___,
                onCompositionEnd: this.___onCompositionEnd___,
                onKeyUp: this.___onKeyUp___,
                onPaste: this.___onPaste___
            };
            // 由于IE和Chrome下placeholder表现不一致，所以自己做。IE下得到焦点后，placeholder会消失，chrome不会。
            var labelProp = {
                style: {
                    visibility: value && value.length ? 'hidden' : 'visible'
                }
            };
            return (
                <div {...containerProp}>
                    <div {...labelProp}>{this.props.placeholder}</div>
                    <textarea {...inputProp}/>
                </div>
            );
        }
    });
});
