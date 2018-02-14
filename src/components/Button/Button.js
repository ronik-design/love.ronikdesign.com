/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const Icon = require('../../components/Icon/Icon');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

class Button extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  animateIn (opt = {}) {
    return Promise.all([
      animate.fromTo(this.container, 0, {
        autoAlpha: 0
      }, {
        ...opt,
        autoAlpha: 1
      })
    ]);
  }

  animateOut (opt = {}) {
    return Promise.all([
      animate.to(this.container, 0, {
        ...opt,
        autoAlpha: 0
      })
    ]);
  }

  render () {
    const {icon, expandable, expanded, extraClasses} = this.props;
    const classes = classnames({
      'Button': true,
      'hasIcon': icon,
      'expandable': expandable,
      'expanded': expanded,
      ...extraClasses
    });
    return (
      <button
        onClick={this.props.onClick}
        className={classes}
        ref={ c => { this.container = c; } }>
        {icon &&
          <div className="ButtonIcon">
            <Icon name={icon}/>
          </div>
        }
        <div className="ButtonText">
          { this.props.children }
        </div>
      </button>
    );
  }
}

Button.defaultProps = {
  onClick: () => {}
};

module.exports = Button;
