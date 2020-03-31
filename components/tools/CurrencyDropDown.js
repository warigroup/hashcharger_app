import React from "react";
import WatchClickOutside from "./WatchClickOutside";
import PropTypes from "prop-types";
import { FaCaretDown } from "react-icons/fa";

class CurrencyDropDown extends React.Component {
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
            <button onClick={this.toggleAlgoMenu} className="dropdown-btn"
            id="currency-selector"><h4>
                {this.props.currency}
                {" "}
                <FaCaretDown className="facaretdown" />
              </h4></button><div className="displayblockdiv"></div>
              <div className={this.state.menuOpen === true ? "algorithm-menu-display" : "algorithm-menu-hidden"}
              style={{marginLeft: "-20px"}}>
                <div className="triangle-shape2" />
                <ul>
                  <li
                    className={
                      this.props.currency === "BTC"
                        ? "listitem selected"
                        : "listitem"
                    }
                    onClick={() => this.props.selectCurrency("BTC")}
                  >
                    BTC
                  </li>
                  <li
                    className={
                      this.props.currency === "USD"
                        ? "listitem selected"
                        : "listitem"
                    }
                    onClick={() => this.props.selectCurrency("USD")}
                  >
                    USD
                  </li>
                </ul>
              </div>
            </div>
            </WatchClickOutside>
        )
    }
}

CurrencyDropDown.propTypes = {
    currency: PropTypes.string
  };


export default CurrencyDropDown;
