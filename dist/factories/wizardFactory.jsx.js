
define(function (require) {

    var React = require('react');

    return {
        produceItems: function produceItems(me) {
            if (!(me.props.datasource instanceof Array) || !me.props.datasource.length) return '';
            var doms = [];
            var value = me.___getValue___();
            value = isNaN(value) ? 0 : value * 1;
            for (var i = 0; i < me.props.datasource.length; i++) {
                var props = {
                    key: i,
                    className: 'jpui-wizard-item',
                    onClick: me.onClick,
                    'data-ui-cmd': i,
                    style: {
                        width: parseFloat(100 / me.props.datasource.length).toFixed(2) + '%',
                        zIndex: me.props.datasource.length - i
                    }
                };
                if (me.props.disabled) {
                    props.className += ' jpui-wizard-item-disabled';
                } else if (i < value + 1) {
                    props.className += ' jpui-wizard-item-active' + (i === value - 1 ? ' jpui-wizard-item-pre' : '');
                } else {
                    props.className += ' jpui-wizard-item-normal';
                }
                if (value === i) {
                    props.className += ' jpui-wizard-item-current';
                }
                doms.push(React.createElement(
                    'div',
                    props,
                    React.createElement(
                        'span',
                        { 'data-ui-cmd': i },
                        me.props.datasource[i]
                    ),
                    React.createElement('div', { 'data-ui-cmd': i, className: 'jpui-wizard-arrow-bg' }),
                    React.createElement(
                        'div',
                        { 'data-ui-cmd': i, className: 'jpui-wizard-arrow' },
                        React.createElement(
                            'span',
                            { 'data-ui-cmd': i },
                            i + 1
                        )
                    )
                ));
            }
            return doms;
        }
    };
});