"use strict";
import React from "react";
import PropTypes from "prop-types";
import objectAssign from "object-assign";
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

export default class ScrollUp extends React.Component {
  constructor() {
    super();
    // set default state
    this.state = { show: false };
    // default property `data`
    this.data = {
      startValue: 0,
      currentTime: 0, // store current time of animation
      startTime: null,
      rafId: null
    };
  }

  shouldComponentUpdate(nextState) {
    return nextState.show !== this.state.show;
  }

  componentDidMount() {
    this.handleScroll(); // initialize state
    // Add all listeners which can start scroll /////
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    // Remove all listeners which was registered /////
    window.removeEventListener("scroll", this.handleScroll);
  }

  // Evaluate show/hide this component, depend on new position //////
  handleScroll = () => {
    if (window.pageYOffset > this.props.showUnder) {
      if (!this.state.show) {
        this.setState({ show: true });
      }
    } else {
      if (this.state.show) {
        this.setState({ show: false });
      }
    }
  };

  // handle click on the button ///////
  handleClick = () => {
    this.toTop();
  };

  toTop = () => {
    scroll.scrollToTop({duration: 100});
  };

  render() {
    let propStyle = this.props.style;
    let element = (
      <div style={propStyle} onClick={this.handleClick}>
        {this.props.children}
      </div>
    );

    let style = objectAssign({}, ScrollUp.defaultProps.style);
    style = objectAssign(style, propStyle);
    style.opacity = this.state.show ? 1 : 0;
    style.visibility = this.state.show ? "visible" : "hidden";
    style.transitionProperty = "opacity, visibility";
    return React.cloneElement(element, { style: style });
  }
}

// Set default props
ScrollUp.defaultProps = {
  duration: 250,
  easing: "easeOutCubic",
  style: {
    position: "fixed",
    bottom: 50,
    right: 30,
    cursor: "pointer",
    transitionDuration: "0.2s",
    transitionTimingFunction: "linear",
    transitionDelay: "0s"
  },
  topPosition: 0
};

// Set validation property types
ScrollUp.propTypes = {
  topPosition: PropTypes.number,
  showUnder: PropTypes.number.isRequired, // show button under this position,
  easing: PropTypes.oneOf([
    "linear",
    "easeInQuad",
    "easeOutQuad",
    "easeInOutQuad",
    "easeInCubic",
    "easeOutCubic",
    "easeInOutCubic",
    "easeInQuart",
    "easeOutQuart",
    "easeInOutQuart",
    "easeInQuint",
    "easeOutQuint",
    "easeInOutQuint",
    "easeInSine",
    "easeOutSine",
    "easeInOutSine",
    "easeInExpo",
    "easeOutExpo",
    "easeInOutExpo",
    "easeInCirc",
    "easeOutCirc",
    "easeInOutCirc",
    "easeInElastic",
    "easeOutElastic",
    "easeInOutElastic",
    "easeInBack",
    "easeOutBack",
    "easeInOutBack",
    "easeInBounce",
    "easeOutBounce",
    "easeInOutBounce"
  ]),
  duration: PropTypes.number, // seconds
  style: PropTypes.object
};
