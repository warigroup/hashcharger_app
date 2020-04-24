import React from "react";
import WatchClickOutside from "./WatchClickOutside";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FaCaretDown } from "react-icons/fa";
import { algorithms } from "../../settings";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

class MiningAlgoDropDown extends React.Component {
    constructor() {
        super();
        this.state = {
          menuOpen: false
        };
      };
    toggleAlgoMenu = () => {
      const currentState = this.state.menuOpen;
      this.setState({ menuOpen: !currentState });
    };
    
    collapseAlgoMenu = () => {
      this.setState({ menuOpen: false });
    };

    render() {
        return (
            <WatchClickOutside onClickOutside={this.collapseAlgoMenu}>
            <div className="miningalgorithm-dropdown">
            <div className="dropdown-btn"
            id="miningalgorithm-selector">
              <h4>
                {this.props.miningalgo.algorithm === "sha256d" ? "SHA256d" : capitalizeFirstLetter(this.props.miningalgo.algorithm)}
              </h4>
            </div>
              <div className="displayblockdiv"></div>
            </div>
            </WatchClickOutside>
        )
    }
}

MiningAlgoDropDown.propTypes = {
    miningalgo: PropTypes.object
  };

  const mapStateToProps = state => ({
    miningalgo: state.miningalgo
  });

export default connect(
    mapStateToProps,
    null
  )(MiningAlgoDropDown);
