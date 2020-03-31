import React from 'react';
import {
    STRATUM_HOST,
    STRATUM_HOST_PLACE,
    STRATUM_PORT,
    STRATUM_USERNAME,
    STRATUM_PASSWORD
} from "../../utils/stratumLabels";
import {
    FaUser,
    FaLock,
    FaServer,
    FaHashtag
} from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class StratumForm extends React.Component {
    constructor() {
        super();
        this.state = {
            hostfocus: false,
            portfocus: false,
            usernamefocus: false,
            passwordfocus: false
        }
    }

    handleHostFocus = () => {
        this.setState({ hostfocus: true });
    };

    handleHostBlur = () => {
        this.setState({ hostfocus: false });
    };

    handlePortFocus = () => {
        this.setState({ portfocus: true });
    };

    handlePortBlur = () => {
        this.setState({ portfocus: false });
    };

    handleUsernameFocus = () => {
        this.setState({ usernamefocus: true });
    };

    handleUsernameBlur = () => {
        this.setState({ usernamefocus: false });
    };

    handlePasswordFocus = () => {
        this.setState({ passwordfocus: true });
    };

    handlePasswordBlur = () => {
        this.setState({ passwordfocus: false });
    };

    render() {
        const { hostfocus, portfocus, usernamefocus, passwordfocus } = this.state;
        return (
            <div className="container-fluid" style={{width: "100%"}}>
                <div className="row" style={{padding: "0px"}}>
                    <style jsx>
                        {`
                      .portinput {
                        padding-left: 0px;
                      }

                      .hostinput {
                        padding-right: 30px;
                      }
                      @media (max-width: 993px) {
                        .portinput {
                          padding-left: 15px;
                        }
                        .hostinput {
                          padding-right: 15px;
                        }
                    }
                        `}
                    </style>
                <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 hostinput">
                    <div className="form-group">
                        <label htmlFor="host" className="inputlabel">
                            {STRATUM_HOST}
                        </label>
                        <div
                            className={
                                hostfocus === true
                                    ? "input-group input-group-md focused"
                                    : "input-group input-group-md"
                            }
                        >
                            <div className="input-group-prepend">
                                <span
                                    className="input-group-text"
                                    style={{
                                        background: "white",
                                        border: "none",
                                        color: "rgba(0,0,0,0.5)"
                                    }}
                                >
                                    <FaServer style={hostfocus === true ? 
                                        { fontSize: "1.15em", opacity: "1" } : 
                                        { fontSize: "1.15em", opacity: "0.8" }} />
                                </span>
                            </div>
                            <input
                                type="text"
                                name="host"
                                defaultValue={this.props.host}
                                placeholder={STRATUM_HOST_PLACE}
                                className="form-control inputstyles2"
                                onChange={this.props.handleChange}
                                onFocus={this.handleHostFocus}
                                onBlur={this.handleHostBlur}
                                style={{
                                    border: "none",
                                    borderRadius: "7px",
                                    fontSize: "0.82em"
                                }}
                                autoComplete="off"
                            />
                        </div>
                        {this.props.errors.host !== undefined ?
                            <p className="is-invalid-error add-padding-left">{this.props.errors.host}</p> : null}
                    </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-md-12 col-sm-12 col-12 portinput" >
                    <div className="form-group">
                        <label htmlFor="port" className="inputlabel">
                            {STRATUM_PORT}
                        </label>
                        <div
                            className={
                                portfocus === true
                                    ? "input-group input-group-md focused"
                                    : "input-group input-group-md"
                            }
                        >
                            <div className="input-group-prepend">
                                <span
                                    className="input-group-text"
                                    style={{
                                        background: "white",
                                        border: "none",
                                        color: "rgba(0,0,0,0.5)"
                                    }}
                                >
                                    <FaHashtag style={portfocus === true ? 
                                    { fontSize: "1.15em", opacity: "1" } : 
                                    { fontSize: "1.15em", opacity: "0.8" }} />
                                </span>
                            </div>
                            <input
                                type="text"
                                name="port"
                                defaultValue={this.props.port}
                                placeholder="Example: 3333"
                                className="form-control inputstyles2"
                                style={{
                                    border: "none",
                                    borderRadius: "7px",
                                    fontSize: "0.82em"
                                }}
                                onChange={this.props.handleChange}
                                onFocus={this.handlePortFocus}
                                onBlur={this.handlePortBlur}
                                autoComplete="off"
                            />
                        </div>

                        {this.props.errors.port !== undefined ?
                            <p className="is-invalid-error add-padding-left">{this.props.errors.port}</p> : null}
                    </div>
                </div>
                <div className="col-xl-12" />
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="form-group">
                        <label htmlFor="username" className="inputlabel">
                            {STRATUM_USERNAME}
                        </label>
                        <div
                            className={
                                usernamefocus === true
                                    ? "input-group input-group-md focused"
                                    : "input-group input-group-md"
                            }
                        >
                            <div className="input-group-prepend">
                                <span
                                    className="input-group-text"
                                    style={{
                                        background: "white",
                                        border: "none",
                                        color: "rgba(0,0,0,0.5)"
                                    }}
                                >
                                    <FaUser style={
                                        usernamefocus === true ?
                                        { fontSize: "1.15em", opacity: "1" } :
                                        { fontSize: "1.15em", opacity: "0.8" }} />
                                </span>
                            </div>
                            <input
                                type="text"
                                name="username"
                                defaultValue={this.props.username}
                                placeholder={STRATUM_USERNAME}
                                className="form-control inputstyles2"
                                style={{
                                    border: "none",
                                    borderRadius: "7px",
                                    fontSize: "0.82em"
                                }}
                                onChange={this.props.handleChange}
                                onFocus={this.handleUsernameFocus}
                                onBlur={this.handleUsernameBlur}
                                autoComplete="off"
                            />
                        </div>

                        {this.props.errors.username !== undefined ?
                            <p className="is-invalid-error add-padding-left">{this.props.errors.username}</p> : null}
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="form-group">
                        <label htmlFor="password" className="inputlabel">
                            {STRATUM_PASSWORD}
                        </label>
                        <div
                            className={
                                passwordfocus === true
                                    ? "input-group input-group-md focused"
                                    : "input-group input-group-md"
                            }
                        >
                            <div className="input-group-prepend">
                                <span
                                    className="input-group-text"
                                    style={{
                                        background: "white",
                                        border: "none",
                                        color: "rgba(0,0,0,0.5)"
                                    }}
                                >
                                    <FaLock style={passwordfocus === true ? 
                                    { fontSize: "1.15em", opacity: "1" } :
                                    { fontSize: "1.15em", opacity: "0.8" }} />
                                </span>
                            </div>
                            <input
                                type="text"
                                name="password"
                                defaultValue={this.props.password}
                                placeholder={STRATUM_PASSWORD}
                                className="form-control inputstyles2"
                                style={{
                                        border: "none",
                                        borderRadius: "7px",
                                        fontSize: "0.82em"
                                    }}
                                onChange={this.props.handleChange}
                                onFocus={this.handlePasswordFocus}
                                onBlur={this.handlePasswordBlur}
                                autoComplete="off"
                            />
                        </div>
                        {this.props.errors.password !== undefined ?
                            <p className="is-invalid-error add-padding-left">{this.props.errors.password}</p> : null}
                    </div>
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12" />
                </div>
            </div>
        )
    }
}

StratumForm.defaultProps = {
    errors: []
};

StratumForm.propTypes = {
    errors: PropTypes.object
};

const mapStateToProps = state => ({
    errors: state.errors
});

export default connect(mapStateToProps, null)(StratumForm);