const { h, Component } = require('preact');
const classnames = require('classnames');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');

class Controls extends BaseComponent {
    render () {
        return (
            <div className="Controls">
                <div className="ControlsInner">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

module.exports = Controls;
