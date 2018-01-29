/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');
const PreactTransitionGroup = require('preact-transition-group');
const setQuery = require('set-query-string');
const materials = require('../constants/materials');

// DOM Sections
const Landing = require('../sections/Landing/Landing');
const Preloader = require('../sections/Preloader/Preloader');
const EditText = require('../sections/EditText/EditText');

// WebGL canvas component
const WebGLCanvas = require('../components/WebGLCanvas/WebGLCanvas');

// WebGL scenes
const Text = require('../webgl/scene/Text');
const Floor = require('../webgl/scene/Floor');
const Lighting = require('../webgl/scene/Lighting');

const { assets, webgl } = require('../context');

class App extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      text: '',
      backgroundMaterial: 0,
      isLoaded: false,
      isAltMaterial: false,
      section: 'Preloader'
    };
  }

  handlePreventDefault = ev => {
    ev.preventDefault();
  }

  componentDidUpdate (oldProps, oldState) {
    if (this.state.isLoaded && oldState.isLoaded !== this.state.isLoaded) {
      // start animation loop
      webgl.start();

      // draw a frame so that its correct on first DOM render
      webgl.draw();

      // trigger initial animation in of content
      webgl.animateIn({ delay: 0.5 });
    }

    // propagate through entire scene graph any app changes
    webgl.onAppDidUpdate(oldProps, oldState, this.props, this.state);
  }

  componentDidMount () {
    // To avoid page pulling, text highlighting and such
    webgl.canvas.addEventListener('touchstart', this.handlePreventDefault);
    webgl.canvas.addEventListener('mousedown', this.handlePreventDefault);

    this.loadWebGL();
  }

  componentWillUnmount () {
    webgl.canvas.removeEventListener('touchstart', this.handlePreventDefault);
    webgl.canvas.removeEventListener('mousedown', this.handlePreventDefault);
  }

  loadWebGL () {
    // Preload any queued assets
    assets.loadQueued(() => {
      // Do some fake delay for demo purposes
      setTimeout(() => {
        // Once loading is complete, swap to Landing section and ensure WebGL displays
        this.setState({ section: 'Landing', isLoaded: true });
      }, this.props.fakePreloadTime);

      // Add any "WebGL components" here...
      // webgl.scene.add(new SpinningBox());
      webgl.scene.add(new Text());
      webgl.scene.add(new Floor());
      webgl.scene.add(new Lighting());
    });
  }

  handleUpdateColors = () => {
    let textureIndex;
    if (this.state.backgroundMaterial === materials.length - 1) {
      textureIndex = 0;
    } else {
      textureIndex = this.state.backgroundMaterial + 1;
    }

    this.setState({backgroundMaterial: textureIndex});
    setQuery({theme: textureIndex});
  }

  handleTextUpdate = text => {
    this.setState({text: text});
    setQuery({text: text});
  }

  updateContent = section => {
    this.getContent(section);
    this.setState({section: section});
  }

  getContent (section) {
    // You are probably better off using a real "Router" for history push etc.
    // NB: Ensure there is a 'key' attribute so transition group can create animations
    switch (section) {
      case 'Preloader': return <Preloader key='Preloader'/>;
      case 'EditText': return <EditText key='EditText' onTextUpdate={this.handleTextUpdate} updateContent={this.updateContent}/>;

      default:
      case 'Landing': return <Landing key='Landing' updateContent={this.updateContent} updateColors={this.handleUpdateColors}/>;
    }
  }

  render () {
    const classes = classnames({
      'App': true
    });

    const section = this.state.section;
    const content = this.getContent(section);

    // Render the WebGL if loaded
    // And also render the current UI section on top, with transitions
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        { this.state.isLoaded && <WebGLCanvas />}
        <PreactTransitionGroup className='content'>
          { content }
        </PreactTransitionGroup>
      </div>
    );
  }
}

App.defaultProps = {
  // Artificially inflate preload time so
  // we can see it for demo purposes
  fakePreloadTime: 250
};

module.exports = App;
