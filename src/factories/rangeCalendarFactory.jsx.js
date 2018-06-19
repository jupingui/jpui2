
define(function (require) {

    var React = require('react');

    var Calendar = require('../Calendar.jsx');
    var Button = require('../Button.jsx');

    var tools = require('../core/calendarTools');
    var util = require('../core/util');
    var language = require('../core/language').rangeCalendar;


    return {
        layerContentFactory: function (me) {
            var tpl = 'YYYY-MM-DD';
            var min = tools.str2date(me.props.min) || tools.str2date('0-1-1');
            var max = tools.str2date(me.props.max) || tools.str2date('9999-12-31');
            if (tools.compareDate(min, max) === 1) { // min > max
                var tmp = min;
                min = max;
                max = tmp;
            }
            var c1Prop = {
                ref: 'c1',
                className: 'left-calendar',
                min: util.dateFormat(min, tpl),
                value: me.state.value1,
                max: util.dateFormat(me.state.value2, tpl),
                onChange: me.onCalendarChange1
            };
            var c2Prop = {
                ref: 'c2',
                className: 'right-calendar',
                min: util.dateFormat(me.state.value1, tpl),
                value: me.state.value2,
                max: util.dateFormat(max, tpl),
                onChange: me.onCalendarChange2
            };
            var enterButtonProp = {
                ref: 'enterButton',
                disabled: typeof me.state.rangeValidationResult === 'string'
                    && me.state.rangeValidationResult.length > 0,
                label: language.enter,
                skin: 'important',
                onClick: me.onEnterButtonClick
            };
            var shorts = this.shortCutFactory(me);
            return (
                <div className="jpui-range-calendar">
                    {shorts.length ? <div className="fast-operation-bar">{shorts}</div> : null}
                    <div className="resuit-display-bar">
                        <div>{language.startTime + me.state.value1}</div>
                        <div>{language.endTime + me.state.value2}</div>
                    </div>
                    <Calendar {...c1Prop}/>
                    <Calendar {...c2Prop}/>
                    <div className="button-bar">
                        <Button {...enterButtonProp}/>
                        <Button ref="cancelButton" label={language.cancel} onClick={me.onCancelButtonClick}/>
                        <span style={{position: 'relative', top: 0}}>{me.state.rangeValidationResult}</span>
                    </div>
                </div>
            );
        },
        shortCutFactory: function (me) {
            var shortCut = me.props.shortCut;
            if (!(shortCut instanceof Array) || shortCut.length === 0) return '';
            var doms = [];
            for (var i = 0; i < shortCut.length; i++) {
                var dataRange = shortCut[i].getValues();
                var selected = util.dateFormat(dataRange.value1, 'YYYY-MM-DD') === me.state.value1
                    && util.dateFormat(dataRange.value2, 'YYYY-MM-DD') === me.state.value2;
                var props = {
                    className: selected ? 'selected-region' : '',
                    key: 'shortcut-' + i,
                    'data-ui-cmd': i,
                    onClick: me.onShortCutClick
                };
                doms.push(<div {...props}>{shortCut[i].label}</div>);
            }
            return doms;
        }
    }
});

