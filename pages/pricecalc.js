import React, { Component } from 'react';
import PublicRoute from "../components/routes/PublicRoute";
import { connect } from "react-redux";
import {
  resetErrors,
  getEstimate } from "../actions/warihashApiCalls";
import ThreeDotsLoading from "../components/tools/ThreeDotsLoading";
import Head from "next/head";

class calculatorPage extends Component {
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default calculatorPage;