import React from "react";
import { Card, CardTitle } from "reactstrap";
// import DialBar from "./DialGraph";
// import ReactApexChart from "react-apexcharts";

// ** Third Party Components
import classnames from "classnames";

export function DialDiv(props) {

  return (
    <Card
      className={classnames("shadow-none resilience-box center", {
        "active": props.defaultData === props?.value
      })}
      style={props ? { cursor: "pointer" } : { cursor: "auto" }}
      onClick={() => props.handlePassControlData()}
    >
      {/* <Dial val={0} /> */}
      {/* <DialBar val={0} /> */}
      <div className="content-wrap">
        {/* <CardTitle className="mb-0"><DialBar val={0} />{props?.text}</CardTitle> */}
        <CardTitle className="mb-0">{props?.name}</CardTitle>
        <div className="tile-footer">
          <span>{props?.framework_name || ""}</span>
          <span>{props?.identifier || ""}</span>
        </div>
      </div>
    </Card>
  )
}

export function DialDivFrameworks(props) {
  return (
    <Card
      className="shadow-none center"
      style={props ? { cursor: "pointer" } : { cursor: "auto" }}
    >
      <div className="content-wrap">
        <CardTitle className="mb-0">{props?.text}</CardTitle>
      </div>
    </Card>
  )
}
