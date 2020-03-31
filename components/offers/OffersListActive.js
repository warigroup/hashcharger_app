import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import {
  clearNetwork,
  clearCurrentProfile,
  clearHashrateData,
  logoutUser,
  redirectErrorMessage,
  getHashrateInfo
} from "../../actions/warihashApiCalls";
import PaymentRate from "../tools/PaymentRate";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Tooltip from "react-tooltip-lite";
import { Router } from "../../routes";
import ActiveOffersModal from "./ActiveOffersModal";

class OffersListActive extends React.Component {
  constructor() {
    super();
    this.state = {
      orderBy: "",
      orderAsc: true,
      orderAscNum: true,
      showModal: false,
      modaloffers: [],
      currentPage: 1,
      totalPage: 100,
      activeClasses: [false, false, false, false, false],
      menuOpen: false,
      modalLoading: true
    };
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.network.networkstatus === 401 &&
      prevProps.network.networkstatus !== 401
    ) {
      this.props.redirectErrorMessage();
      this.props.clearCurrentProfile();
      this.props.logoutUser();
    };
    if (
      prevProps.hashrate !== this.props.hashrate
    ) {
      this.setState({ modalLoading: false });
    };
  };

  componentDidMount() {
    this.props.clearHashrateData();
  };

  componentWillUnmount() {
    this.props.clearNetwork();
  };

  redirecAndShowError = () => {
    this.props.redirectErrorMessage();
    Router.pushRoute("/login");
  };

  /// SORT //////////////////////////////
  compareBy = key => {
    const { orderAsc } = this.state;
    if (orderAsc) {
      return function (a, b) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      };
    } else {
      return function (a, b) {
        if (a[key] > b[key]) return -1;
        if (a[key] < b[key]) return 1;
        return 0;
      };
    };
  };

  sortBy = event => {
    const { tableitems } = this.props;
    const target = event.target;
    const id = target.id;
    this.setState({
      currentPage: 1,
      orderBy: id,
      orderAsc: !this.state.orderAsc,
      tableitems: tableitems.sort(this.compareBy(id))
    });
  };

  numericCompareBy = () => {
    let { orderAscNum } = this.state;
    const { tableitems } = this.props;
    if (orderAscNum) {
      this.setState({
        tableitems: tableitems.sort((a, b) => parseFloat(a.declared_hashrate) - parseFloat(b.declared_hashrate))
      })
    } else {
      this.setState({
        tableitems: tableitems.reverse()
      })
    };
  };

  sortNumeric = event => {
    const target = event.target;
    const id = target.id;
    this.setState({
      currentPage: 1,
      orderBy: id,
      orderAscNum: !this.state.orderAscNum
    });
    this.numericCompareBy();
  };

  sortPrice = event => {
    const target = event.target;
    const id = target.id;
    this.setState({
      currentPage: 1,
      orderBy: id,
      orderAscNum: !this.state.orderAscNum
    });
    let { orderAscNum } = this.state;
    const { tableitems } = this.props;
    if (orderAscNum) {
      this.setState({
        tableitems: tableitems.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        )
      });
    } else {
      this.setState({
        tableitems: tableitems.reverse()
      });
    };
  };

  sortBoolean = event => {
    const target = event.target;
    const id = target.id;
    this.setState({
      currentPage: 1,
      orderBy: id,
      orderAscNum: !this.state.orderAscNum
    });
    let { orderAscNum } = this.state;
    const { tableitems } = this.props;
    if (orderAscNum) {
      this.setState({
        tableitems: tableitems.sort(function (a, b) {
          return a.miner_available - b.miner_available;
        })
      });
    } else {
      this.setState({
        tableitems: tableitems.reverse()
      });
    }
  };

  addActiveClass = index => {
    const activeClasses = [
      ...this.state.activeClasses.slice(0, index),
      !this.state.activeClasses[index],
      this.state.activeClasses.slice(index + 1)
    ];
    this.setState({ activeClasses });
  };

  /// OPEN VIEW INFO MODAL ////////////////////
  handleOpenModal = activeoffer => {
    const modaloffers = activeoffer;
    this.setState({ modaloffers: modaloffers });
    this.setState({ showModal: true });
    this.props.getHashrateInfo(activeoffer.offer_id);
    this.setState({ menuOpen: false });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
    this.props.clearHashrateData();
    this.setState({ modaloffers: [] });
    this.setState({ modalLoading: true });
  };

  render() {
    const activeClasses = this.state.activeClasses.slice();
    let hideClass = "hidethis";

    const minerUnavailable = <span>Unavailable</span>;
    const minerAvailable = (
      <span style={{ color: "#79B33B", fontWeight: "600" }}>Available</span>
    );

    ///// TABLE /////////////////////////////
    const offersTable = this.props.tableitems.map(
      activeoffers => {
        return (
          <tr
            className="row m-0 offercontents tablerowstyles"
            key={activeoffers.offer_id}
            style={{ width: "100% !important" }}
            itemProp="offers"
            itemScope
            itemID={activeoffers.offer_id}
          >
            <td className={this.props.auth.isAuthenticated === true &&
              ((this.props.profile || {}).profile || {}).username !== "" &&
              ((this.props.profile || {}).profile || {}).is_staff === true ?
              "activeoffers-table-hashrate-staff" :
              "activeoffers-table-hashrate"} >
              <span
                className={activeoffers.declared_hashrate > 0 ? "" : hideClass}
              >
                <p className="tabledata">{activeoffers.declared_hashrate} {activeoffers.hashrate_units}
                  H/s</p>
              </span>

              <span
                className={activeoffers.declared_hashrate > 0 ? hideClass : ""}
              >
                <p className="tabledata">Unavailable</p>
              </span>
            </td>

            <td className={this.props.auth.isAuthenticated === true &&
              ((this.props.profile || {}).profile || {}).username !== "" &&
              ((this.props.profile || {}).profile || {}).is_staff === true ?
              "activeoffers-table-rate-staff" :
              "activeoffers-table-rate"} itemProp="price">
              <p className="tabledata">{activeoffers.price} {this.props.updating === false ? <PaymentRate /> : 
            <span style={{display: "inline-block"}}>{this.props.configs.payment_vehicle}/{this.props.unit}Hashes/sec/{this.props.time}</span>}</p>
              <meta itemProp="priceCurrency" content="BTC" />
            </td>
            <td className={this.props.auth.isAuthenticated === true &&
              ((this.props.profile || {}).profile || {}).username !== "" &&
              ((this.props.profile || {}).profile || {}).is_staff === true ?
              "activeoffers-table-createdby-staff" :
              "activeoffers-table-createdby"} itemProp="seller">
              <p className="tabledata">{activeoffers.creator}</p>
            </td>
            <td className={this.props.auth.isAuthenticated === true &&
              ((this.props.profile || {}).profile || {}).username !== "" &&
              ((this.props.profile || {}).profile || {}).is_staff === true ?
              "activeoffers-table-time-staff" :
              "activeoffers-table-time"} >
              <p className="tabledata">{moment(activeoffers.create_time).format("MM/DD/YYYY HH:mm")}</p>
            </td>
            <td className={this.props.auth.isAuthenticated === true &&
              ((this.props.profile || {}).profile || {}).username !== "" &&
              ((this.props.profile || {}).profile || {}).is_staff === true ?
              "activeoffers-table-miner-staff" :
              "activeoffers-table-miner"} >
              <p className="tabledata">{activeoffers.miner_available === true
                ? minerAvailable
                : minerUnavailable}</p>
            </td>
            <td className={this.props.auth.isAuthenticated === true &&
              ((this.props.profile || {}).profile || {}).username !== "" &&
              ((this.props.profile || {}).profile || {}).is_staff === true ?
              "activeoffers-table-buttons-staff" :
              "activeoffers-table-buttons"} >
              
              {this.props.auth.isAuthenticated === true &&
                ((this.props.profile || {}).profile || {}).username !== "" &&
                ((this.props.profile || {}).profile || {}).is_staff === true ?

                <button
                  className="btn btn-sm btn-secondary offerbtn mobile-adjustments"
                  onClick={() => {
                    this.handleOpenModal(activeoffers);
                  }}
                >
                  Details
              </button> : null}
            </td>
          </tr>
        );
      }
    );

    return (
      <React.Fragment>
        <div
          className="col-md-12 col-12 col-xs-12 tablecontainer"
          style={{ padding: "0px" }}
        >
          <div
            className="board"
            style={{
              borderBottom: "1px solid rgba(0,0,0,1)",
              borderRadius: "0px"
            }}
          >
            <table
              id="tableA"
              className="table table-borderless container"
              style={{
                padding: "0px",
                borderTop: "0px",
                borderBottom: "0px",
                marginTop: "0px"
              }}
            >
              <thead className="activeoffersbg text-white">
                <tr className="row m-0">
                  <th
                    id="declared_hashrate"
                    className={this.props.auth.isAuthenticated === true &&
                      ((this.props.profile || {}).profile || {}).username !== "" &&
                      ((this.props.profile || {}).profile || {}).is_staff === true ?
                      "activeoffers-table-hashrate-staff offertitle" :
                      "activeoffers-table-hashrate offertitle"}
                  >
                    <Tooltip
                      content="Hashrate provided by the miner, as measured by Warihash over the last 24 hours"
                      direction="up-start"
                      arrow={false}
                    >
                      <button
                        id="declared_hashrate"
                        onClick={event => {
                          this.sortNumeric(event);
                          this.addActiveClass(0);
                        }}
                        className="tablesortbtn"
                        style={{
                          display: "inline-block",
                          marginRight: "8px"
                        }}
                      >
                        Hashrate{" "}
                      </button>
                      {activeClasses[0] === true ? (
                        <FaCaretUp
                          style={{
                            marginLeft: "5px",
                            display: "inline-block"
                          }}
                        />
                      ) : (
                          <FaCaretDown
                            style={{
                              marginLeft: "5px",
                              display: "inline-block"
                            }}
                          />
                        )}
                    </Tooltip>
                  </th>
                  <th
                    id="price"
                    className={this.props.auth.isAuthenticated === true &&
                      ((this.props.profile || {}).profile || {}).username !== "" &&
                      ((this.props.profile || {}).profile || {}).is_staff === true ?
                      "activeoffers-table-rate-staff offertitle" :
                      "activeoffers-table-rate offertitle"}
                  >
                    <Tooltip
                      content="Price required to buy the miner"
                      direction="up-start"
                      arrow={false}
                    >
                      <button
                        id="price"
                        onClick={event => {
                          this.sortPrice(event);
                          this.addActiveClass(1);
                        }}
                        className="tablesortbtn"
                        style={{
                          display: "inline-block",
                          marginRight: "8px"
                        }}
                      >
                        Rate{" "}
                      </button>
                      {activeClasses[1] === true ? (
                        <FaCaretUp
                          style={{
                            marginLeft: "5px",
                            display: "inline-block"
                          }}
                        />
                      ) : (
                          <FaCaretDown
                            style={{
                              marginLeft: "5px",
                              display: "inline-block"
                            }}
                          />
                        )}
                    </Tooltip>
                  </th>

                  <th
                    id="creator"
                    className={this.props.auth.isAuthenticated === true &&
                      ((this.props.profile || {}).profile || {}).username !== "" &&
                      ((this.props.profile || {}).profile || {}).is_staff === true ?
                      "activeoffers-table-createdby-staff offertitle" :
                      "activeoffers-table-createdby offertitle"}
                  >
                    <Tooltip
                      content="Username of the owner of the miner"
                      direction="up-start"
                      arrow={false}
                    >
                      <button
                        id="creator"
                        onClick={event => {
                          this.sortBy(event);
                          this.addActiveClass(2);
                        }}
                        className="tablesortbtn"
                        style={{
                          display: "inline-block",
                          marginRight: "8px"
                        }}
                      >
                        Created By{" "}
                      </button>
                      {activeClasses[2] === true ? (
                        <FaCaretUp
                          style={{
                            marginLeft: "5px",
                            display: "inline-block"
                          }}
                        />
                      ) : (
                          <FaCaretDown
                            style={{
                              marginLeft: "5px",
                              display: "inline-block"
                            }}
                          />
                        )}
                    </Tooltip>
                  </th>

                  <th
                    id="create_time"
                    className={this.props.auth.isAuthenticated === true &&
                      ((this.props.profile || {}).profile || {}).username !== "" &&
                      ((this.props.profile || {}).profile || {}).is_staff === true ?
                      "activeoffers-table-time-staff offertitle" :
                      "activeoffers-table-time offertitle"}
                  >
                    <Tooltip
                      content="Time when the order was created"
                      direction="up-start"
                      arrow={false}
                    >
                      <button
                        id="create_time"
                        onClick={event => {
                          this.sortBy(event);
                          this.addActiveClass(3);
                        }}
                        className="tablesortbtn"
                        style={{
                          display: "inline-block",
                          marginRight: "8px"
                        }}
                      >
                        Created On{" "}
                      </button>
                      {activeClasses[3] === true ? (
                        <FaCaretUp
                          style={{
                            marginLeft: "5px",
                            display: "inline-block"
                          }}
                        />
                      ) : (
                          <FaCaretDown
                            style={{
                              marginLeft: "5px",
                              display: "inline-block"
                            }}
                          />
                        )}
                    </Tooltip>
                  </th>

                  <th
                    id="miner_available"
                    className={this.props.auth.isAuthenticated === true &&
                      ((this.props.profile || {}).profile || {}).username !== "" &&
                      ((this.props.profile || {}).profile || {}).is_staff === true ?
                      "activeoffers-table-miner-staff offertitle" :
                      "activeoffers-table-miner offertitle"}
                  >
                    <Tooltip
                      content="The current availability status of miner"
                      direction="up-start"
                      arrow={false}
                    >
                      <button
                        id="miner_available"
                        className="tablesortbtn"
                        onClick={event => {
                          this.sortBoolean(event);
                          this.addActiveClass(4);
                        }}
                        style={{
                          display: "inline-block",
                          marginRight: "8px"
                        }}
                      >
                        Miner Availability{" "}
                      </button>
                      {activeClasses[4] === true ? (
                        <FaCaretUp
                          style={{
                            marginLeft: "5px",
                            display: "inline-block"
                          }}
                        />
                      ) : (
                          <FaCaretDown
                            style={{
                              marginLeft: "5px",
                              display: "inline-block"
                            }}
                          />
                        )}
                    </Tooltip>
                  </th>

                  <th className={this.props.auth.isAuthenticated === true &&
                    ((this.props.profile || {}).profile || {}).username !== "" &&
                    ((this.props.profile || {}).profile || {}).is_staff === true ?
                    "activeoffers-table-buttons-staff offertitle" :
                    "activeoffers-table-buttons offertitle"} />
                </tr>
              </thead>
              <tbody className="activeoffers-tbody">
                {this.props.tableitems.length > 0 ? offersTable : null}
              </tbody>
            </table>


            <ActiveOffersModal
              showModal={this.state.showModal}
              handleCloseModal={this.handleCloseModal}
              modaloffers={this.state.modaloffers}
              modalLoading={this.state.modalLoading}
              hashrate={this.props.hashrate}
            />

          </div>
        </div>
      </React.Fragment>
    );
  }
}

OffersListActive.defaultProps = {
  network: [],
  miningalgo: [],
  configs: [],
  hashrate: []
};

OffersListActive.propTypes = {
  getHashrateInfo: PropTypes.func,
  logoutUser: PropTypes.func,
  clearNetwork: PropTypes.func,
  redirectErrorMessage: PropTypes.func,
  clearCurrentProfile: PropTypes.func,
  clearHashrateData: PropTypes.func,
  auth: PropTypes.object,
  profile: PropTypes.object,
  errors: PropTypes.object,
  configs: PropTypes.object,
  network: PropTypes.object,
  miningalgo: PropTypes.object,
  hashrate: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  errors: state.errors,
  configs: state.configs,
  network: state.network,
  miningalgo: state.miningalgo,
  hashrate: state.hashrate
});

export default connect(
  mapStateToProps,
  {
    redirectErrorMessage,
    clearNetwork,
    clearCurrentProfile,
    clearHashrateData,
    logoutUser,
    getHashrateInfo
  }
)(OffersListActive);