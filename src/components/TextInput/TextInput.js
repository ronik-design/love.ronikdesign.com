/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

class TextInput extends BaseComponent {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    this.input.value = "";

    // for some reason a timeout is necessary for the focus to work
    setTimeout(() => { this.input.focus(); }, 50);
  }

  handleKeyUp = e => {
    if (e.keyCode === 27) {
      this.props.handleClose();
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.handleClose();
    this.props.onTextUpdate(this.input.value);
  }

  render () {
    const classes = classnames({
      'TextInput': true,
    });
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        <div className="wrapper">
          <form onSubmit={this.handleSubmit}>
          <input ref={c => { this.input = c; }}
                 type="text"
                 placeholder="Start typing..."
                 onKeyUp={this.handleKeyUp}
          />
          </form>
        </div>
      </div>
    );
  }
}

module.exports = TextInput;
