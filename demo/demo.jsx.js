define(function (require) {


    var React = require('react');
    var ButtonDemo = require('./ButtonDemo.jsx'); 


    var ListItem = React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                demo: '',
                label: 'Item',
                onClick: function () {}
            };
        },
        clickHandler: function () {
            this.props.onClick(this.props.label);
        },
        render: function () {
            var prop = {
                className: 'list-item' + (this.props.demo === this.props.label ? ' list-item-selectd' : ''),
                onClick: this.clickHandler
            };
            return <div {...prop}>{this.props.label}</div>;
        }
    });


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {
                demo: 'Button',
                title: 'FCUI v2.0.0',
                dispatch: function () {}
            };
        },
        // @override
        getInitialState: function () {
            return {
                message: ''
            };
        },
        changeDemo: function (demo) {
            if (demo === this.props.demo) return;
            this.props.dispatch('changeHash', {
                demo: demo
            });
        },
        changeMessage: function (str) {
            this.setState({message: str})
        },
        render: function () {
            return (
                <div>
                    <div className="logo">{this.props.title}</div>
                    <div className="left-container">
                        <ListItem demo={this.props.demo} label="Button" onClick={this.changeDemo}/>
                        <ListItem demo={this.props.demo} label="TextBox" onClick={this.changeDemo}/>
                        <ListItem demo={this.props.demo} label="NumberBox" onClick={this.changeDemo}/>
                        <ListItem demo={this.props.demo} label="Select" onClick={this.changeDemo}/>
                    </div>
                    <div className="right-container demo-container">
                        <div className="demo-message">{this.state.message}</div>
                        <ButtonDemo demo={this.props.demo} alert={this.changeMessage}/>
                    </div>
                    <div className="right-bottom-container"></div>
                </div>
            );
        }
    });
});
