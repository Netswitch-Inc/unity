import React from "react";
import { Card, CardTitle } from "reactstrap";
// import ReactApexChart from "react-apexcharts";
import DialBar from "./DialGraph";

export function DialDiv(props) {
  return (
    <>
      <Card
        className={`shadow-none resilience-box center ${
          props.defaultData === props?.value ? "active" : ""
        }`}
        onClick={() =>
          props.handlePassControlData({ text: props?.text, desc: props?.des })
        }
        style={props ? { cursor: "pointer" } : { cursor: "auto" }}
      >
        {/* <Dial val={0} /> */}
        {/* <DialBar val={0} /> */}
        <div className="content-wrap">
        <CardTitle className="mb-0"><DialBar val={0} />{props?.text}</CardTitle>
        </div>
      </Card>
    </>
  );
}

export function DialDivFrameworks(props) {
  return (
    <>
      <Card
        className="shadow-none center"
        style={props ? { cursor: "pointer" } : { cursor: "auto" }}
      >
        <div className="content-wrap">
          <CardTitle className="mb-0">{props?.text}</CardTitle>
        </div>
      </Card>
    </>
  );
}
