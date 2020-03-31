import React from "react";
import { connect } from "react-redux";
import {
  clearNetwork,
  clearCurrentProfile,
  clearHashrateData,
  logoutUser,
  redirectErrorMessage,
  getHashrateHistory
} from "../../actions/warihashApiCalls";
import PropTypes from "prop-types";
import moment from "moment";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import PaymentRate from "../tools/PaymentRate";
import Tooltip from "react-tooltip-lite";
import TakenOffersModal from "./TakenOffersModal";

class OffersListTaken extends React.Component {
  constructor() {
    super();
    this.state = {
      orderBy: "",
      orderAsc: true,
      orderAscNum: true,
      orderAscPr: true,
      takenoffers: "",
      modaloffers: [],
      currentPage: 1,
      totalPage: 100,
      activeClasses: [false, false, false, false, false],
      showModal: false,
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
    if (prevProps.hashrate !== this.props.hashrate) {
      this.setState({ modalLoading: false });
    };
  }

  componentDidMount() {
    this.props.clearHashrateData();
  };

  componentWillUnmount() {
    this.props.clearNetwork();
    this.props.clearHashrateData();
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
    }
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
        tableitems: tableitems.sort(function (a, b) {
          return (
            (a.average_hashrate === null) - (b.average_hashrate === null) ||
            +(
              parseFloat(b.average_hashrate) > parseFloat(a.average_hashrate)
            ) ||
            -(parseFloat(b.average_hashrate) < parseFloat(a.average_hashrate))
          );
        })
      });
    } else {
      this.setState({
        tableitems: tableitems.reverse()
      });
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
      orderAscPr: !this.state.orderAscPr
    });
    let { orderAscPr } = this.state;
    const { tableitems } = this.props;
    if (orderAscPr) {
      this.setState({
        tableitems: tableitems.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        )
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
  handleOpenModal = takenoffers => {
    this.setState({ modaloffers: takenoffers });
    this.props.getHashrateHistory(takenoffers.offer_take_id);
    this.setState({ showModal: true });
    this.setState({ menuOpen: false });
  };

  handleCloseModal = () => {
    this.props.clearHashrateData();
    this.setState({ showModal: false });
    this.setState({ modaloffers: [] });
    this.setState({ modalLoading: true });
  };

  render() {
    const activeClasses = this.state.activeClasses.slice();

    ///// TABLE /////////////////////////////
    const offersTable = this.props.tableitems.map(
      takenoffers => {
        return (
          <tr
            className="row m-0 offercontents tablerowstyles"
            key={takenoffers.offer_take_id}
            itemProp="offers"
            itemScope
            itemID={takenoffers.offer_take_id}
          >
            <td className="takenoffers-table-hashrate">
              <span
                className={
                  takenoffers.average_hashrate === null ? "hidethis" : ""
                }
              >
                <p className="tabledata">{takenoffers.average_hashrate} {takenoffers.hashrate_units}H/s</p>
              </span>
              <span
                className={
                  takenoffers.average_hashrate === null ? "" : "hidethis"
                }
              >
                <p className="tabledata">Unavailable</p>
              </span>
            </td>
            <td className="takenoffers-table-rate" itemProp="price">
              <p className="tabledata">{takenoffers.price} {this.props.updating === false ? <PaymentRate /> : 
            <span style={{display: "inline-block"}}>{this.props.configs.payment_vehicle}/{this.props.unit}Hashes/sec/{this.props.time}</span>}</p>
              <meta itemProp="priceCurrency" content="BTC" />
            </td>
            <td className="takenoffers-table-status">
              <p className="tabledata">{takenoffers.is_finished === true ? "Finished" : "Ongoing"}</p>
            </td>
            <td className="takenoffers-table-starttime">
              <p className="tabledata">{moment(takenoffers.take_time).format("MM/DD/YYYY HH:mm")}</p>
            </td>
            <td className="takenoffers-table-endtime">
              <p className="tabledata">{moment(takenoffers.take_end_time).format("MM/DD/YYYY HH:mm")}</p>
            </td>
            <td className="takenoffers-table-buttons">

              <button
                className="btn btn-sm btn-secondary offerbtn"
                id="details-btn"
                onClick={() => this.handleOpenModal(takenoffers)}
                style={{ margin: "0px" }}
              >
                Details
              </button>
            </td>
          </tr>
        );
      }
    );

    return (
      <React.Fragment>

        <div
          className="col-md-12 col-12 tablecontainer"
          style={{ padding: "0px" }}
        >
          <div
            className="board"
            style={{
              borderBottom: "1px solid rgba(0,0,0,1)",
              borderTop: "1px solid black",
              borderRadius: "0px"
            }}
          >
            <table id="tableT" className="table table-borderless container">
              <thead className="bg-secondary text-white">
                <tr className="row m-0">
                  <th
                    id="average_hashrate"
                    className="takenoffers-table-hashrate offertitle"
                  >
                    <Tooltip
                      content="Hashrate provided by the miner during this order"
                      direction="up-start"
                      arrow={false}
                    >
                      <button
                        id="average_hashrate"
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
                    className="takenoffers-table-rate offertitle"
                  >
                    <Tooltip
                      content="Price at which the miner was purchased"
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
                    id="is_finished"
                    className="takenoffers-table-status offertitle"
                  >
                    <Tooltip
                      content="Current settlement status"
                      direction="up-start"
                      arrow={false}
                    >
                      <button
                        id="is_finished"
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
                        Status{" "}
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
                    id="take_time"
                    className="takenoffers-table-starttime offertitle"
                  >
                    <Tooltip
                      content="Start time of the settlement"
                      direction="up-start"
                      arrow={false}
                    >
                      <button
                        id="take_time"
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
                        Start Time{" "}
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
                    id="take_end_time"
                    className="takenoffers-table-endtime offertitle"
                  >
                    <Tooltip
                      content="End time of the settlement"
                      direction="up-start"
                      arrow={false}
                    >
                      <button
                        id="take_end_time"
                        onClick={event => {
                          this.sortBy(event);
                          this.addActiveClass(4);
                        }}
                        className="tablesortbtn"
                        style={{
                          display: "inline-block",
                          marginRight: "8px"
                        }}
                      >
                        End Time{" "}
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

                  <th className="takenoffers-table-buttons" />
                </tr>
              </thead>
              <tbody>
                {this.props.tableitems.length > 0 ? offersTable : null}
              </tbody>
            </table>



            <TakenOffersModal
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

OffersListTaken.defaultProps = {
  network: [],
  miningalgo: [],
  configs: [],
  hashrate: []
};

OffersListTaken.propTypes = {
  getHashrateHistory: PropTypes.func,
  logoutUser: PropTypes.func,
  clearNetwork: PropTypes.func,
  clearCurrentProfile: PropTypes.func,
  clearHashrateData: PropTypes.func,
  redirectErrorMessage: PropTypes.func,
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
    getHashrateHistory,
    clearNetwork,
    clearCurrentProfile,
    clearHashrateData,
    logoutUser
  }
)(OffersListTaken);
