/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

class TextInput extends BaseComponent {
  constructor (props) {
    super(props);
  }

  handleChange = e => {
    this.props.onTextUpdate(e.target.value);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.handleCancel();
  }

  render () {
    const classes = classnames({
      'TextInput': true,
    });
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        <div className="wrapper">
          <form onSubmit={this.handleSubmit}>
          <input autoFocus
                 ref={ c => { this.textInput = c } }
                 onChange={this.handleChange}
                 type="text"
                 placeholder="Start typing..."
          />
          </form>
        </div>
      </div>
    );
  }
}

module.exports = TextInput;
