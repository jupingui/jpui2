define(function (require) {


    var React = require('react');
    var util = require('jpui/core/util');
    var Form = require('jpui/Form.jsx');
    var Schedule = require('jpui/Schedule.jsx');


    // 以下所有组件都能在Form中使用
    var order = [
        'TextBox', 'NumberBox', 'CheckBox', 'Radio', 'Select', 'TextArea', 'SearchBox', 'DropDownCalendar',
        'Slider', 'Region', 'Pager', 'Calendar', 'RangeCalendar', 'Wizard', 'DropDownRegion', 'Tab', 'Table'
    ];
    var components = {
        textbox: require('jpui/TextBox.jsx'),
        numberbox: require('jpui/NumberBox.jsx'),
        checkbox: require('jpui/CheckBox.jsx'),
        radio: require('jpui/Radio.jsx'),
        select: require('jpui/Select.jsx'),
        textarea: require('jpui/TextArea.jsx'),
        searchbox: require('jpui/SearchBox.jsx'),
        dropdowncalendar: require('jpui/DropDownCalendar.jsx'),
        slider: require('jpui/Slider.jsx'),
        region: require('jpui/Region.jsx'),
        pager: require('jpui/Pager.jsx'),
        calendar: require('jpui/Calendar.jsx'),
        rangecalendar: require('jpui/RangeCalendar.jsx'),
        wizard: require('jpui/Wizard.jsx'),
        dropdownregion: require('jpui/DropDownRegion.jsx'),
        tab: require('jpui/Tab.jsx'),
        table: require('jpui/Table.jsx')
    };
    var defaultFormValue = {
        textbox: 'textbox',
        numberbox: 12,
        checkbox: false,
        radio: '2',
        select: 'option3',
        textarea: 'textarea',
        searchbox: 'searchbox',
        dropdowncalendar: util.dateFormat(new Date(), 'YYYY-MM-DD'),
        slider: 50,
        region: '147,153',
        pager: 3,
        calendar: util.dateFormat(new Date(), 'YYYY-MM-DD'),
        rangecalendar: '',
        wizard: '2',
        dropdownregion: '1',
        tab: 'option3',
        table: JSON.stringify({
            sortField: 'value',
            sortType: 'asc',
            selected: [0, 2]
        })
    };
    var defaultDatasource = [
        {label: 'option1', value: 'option1'},
        {label: 'option2', value: 'option2'},
        {label: 'option3', value: 'option3'},
        {label: 'option4', value: 'option4'},
        {label: 'option5', value: 'option5'}
    ];
    var defaultProps = {
        table: {
            flags: {
                sortEnable: true,
                showHeader: true,
                showSummary: false,
                showSelector: true
            },
            datasource: defaultDatasource,
            fieldConfig: [
                {
                    label: 'label',
                    field: 'label',
                    width: 100
                },
                {
                    label: 'value',
                    field: 'value',
                    width: 100
                }
            ]
        },
        tab: {datasource: defaultDatasource},
        select: {datasource: defaultDatasource},
        textarea: {width: 200, height: 60},
        slider: {width: 200, step: 0.1, min: 0, max: 100},
        region:{style: {border: '1px solid black'}},
        calendar:{style: {border: '1px solid black'}},
        pager: {min: 1, max: 10},
        wizard: {datasource: ['第一步', '第二步', '第三步', '第四步']},
        dropdownregion: {type: 'single'}
    };
    

    return React.createClass({
        getDefaultProps: function () {
            return {};
        },
        getInitialState: function () {
            return defaultFormValue;
        },
        onFormFieldChange: function (data) {
            var obj = {};
            obj[data.field] = data.dataset[data.field];
            delete data.targetCompontent;
            this.props.alert(JSON.stringify(data));
            this.setState(obj);
        },
        render: function () {
            return (
                <div>
                    <h3>Test Form Field [{order.length}]</h3>
                    <hr/>
                    <Schedule/>
                    <Form onFieldChange={this.onFormFieldChange}>
                        <table><tbody>{inputsFactory(this.state)}</tbody></table>
                    </Form>
                </div>
            );
        }
    });


    function inputsFactory(state) {
        var doms = [];
        var tdStyle = {width: 100, textAlign: 'right', height: 35};
        for (var i = 0; i < order.length; i++) {
            var key = order[i];
            var lKey = key.toLowerCase();
            var Component = components[lKey];
            if (lKey === 'radio') {
                doms.push(
                    <tr key={lKey}>
                        <td style={tdStyle}>{key + ':'}</td>
                        <td style={{lineHeight: '30px'}}>
                            <Component value="1"  checked={state.radio + '' === '1'} name="radio" label="op1"/>
                            <Component value="2" checked={state.radio + '' === '2'} name="radio" label="op2"/>
                            <Component value="3" checked={state.radio + '' === '3'} name="radio" label="op3"/>
                            <Component value="4" checked={state.radio + '' === '4'} name="radio" label="op4"/>
                        </td>
                    </tr>
                );
                continue;
            }
            var props = {};
            props.name = lKey;
            props[lKey === 'checkbox'? 'checked' : 'value'] = state[lKey];
            doms.push(
                <tr key={lKey}>
                    <td style={tdStyle}>{key + ':'}</td>
                    <td style={{lineHeight: '30px'}}><Component {...props} {...defaultProps[lKey]}/></td>
                </tr>
            );
        }
        return doms;
    }


});
