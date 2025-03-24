/* eslint-disable react-hooks/exhaustive-deps */

import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { getListing } from "./store";
import { getFrameworkList } from "views/CompilanceBuilders/store";
import {
  getCompanyComplianceControlList,
  cleanCompanyComplianceControlMessage,
} from "views/companyComplianceControls/store";

import { Button, Card, CardBody, Col, Row } from "reactstrap";
import {
  GenerateRows,
  GenerateFrameworkRows,
} from "components/ComplinceControlComps/DataRows";
import SubControlCard from "components/ComplinceControlComps/SubcontrolCard";
import HistoryAndReportCard from "components/ComplinceControlComps/HistoryGraphData";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import SimpleSpinner from "components/spinner/simple-spinner";

const CompilanceController = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.complincecontrol);
  const frameworkStore = useSelector((state) => state.compilance);
  const loginStore = useSelector((state) => state.login);
  const companyComplianceControlStore = useSelector(
    (state) => state.companyComplianceControls
  );
  const authUserItem = loginStore?.authUserItem?._id
    ? loginStore?.authUserItem
    : null;

  const [rows, setRows] = useState([]);
  const [directControlData, setDirecteControlData] = useState([]);
  const [selectedControl, setSelectedControl] = useState(null);
  const [isGoingBack, setIsGoingBack] = useState(false);
  const [frameworkRows, setFrameworkRows] = useState([]);
  const [showControllers, setShowControllers] = useState(false);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [SnackMessage, setSnackMessage] = useState("");
  const [directDataRows, setDirectDataRows] = useState([]);
  const [valueState, setValueState] = useState(false);
  const [controlledBack, setControlledBack] = useState(false);

  // useEffect(() => {
  //   scrollTop();
  // });

  useLayoutEffect(() => {
    dispatch(
      getCompanyComplianceControlList({
        company_id:
          authUserItem?.company_id?._id || authUserItem?.company_id || "",
      })
    );
  }, [authUserItem]);

  const handleSelectedControlData = (item) => {
    setSelectedControl(() => item);
    setIsGoingBack(() => false);
    setValueState(() => true);
    if (!controlledBack) {
      setControlledBack(() => true);
    }
  };

  useEffect(() => {
    let list1 = [];
    if (companyComplianceControlStore.actionFlag === "CMPN_CONTRL_LST") {
      if (
        companyComplianceControlStore?.companyComplianceControlList?.length &&
        directControlData?.length === 0
      ) {
        list1 = companyComplianceControlStore.companyComplianceControlList.map(
          (item) => {
            return item?.control_id || null;
          }
        );
        setDirecteControlData(() => list1);
        setSelectedControl(() => list1[0]);
        const generatedRows = GenerateRows(
          list1,
          2,
          handleSelectedControlData,
          list1[0]
        );
        setDirectDataRows(() => generatedRows);
        setShowControllers(() => true);
      }
    }

    // setFrameworkRows()
    if (companyComplianceControlStore.actionFlag) {
      dispatch(cleanCompanyComplianceControlMessage(null));
    }
  }, [
    companyComplianceControlStore.actionFlag,
    companyComplianceControlStore.companyComplianceControlList,
    directControlData,
    directDataRows,
    showControllers,
    selectedControl,
  ]);

  useEffect(() => {
    dispatch(getFrameworkList());
  }, [dispatch]);

  const handleControllerLists = useCallback(
    (framework_id) => {
      const frameworkId = framework_id.join(",");
      const params = {
        framework_id: frameworkId,
      };
      dispatch(getListing(params));
      setShowControllers(() => true);
      setIsGoingBack(() => false);
    },
    [dispatch]
  );

  const handleBack = () => {
    setIsGoingBack(true);
  };

  useEffect(() => {
    if (isGoingBack) {
      setSelectedControl(null);
      setShowControllers(false);
    }
  }, [isGoingBack]);

  useEffect(() => {
    if (
      store?.controllerItems?.length > 0 &&
      showControllers &&
      directControlData?.length === 0
    ) {
      if (selectedControl === null) {
        setSelectedControl(() => store?.controllerItems[0]);
      }
      const generatedRows = GenerateRows(
        store.controllerItems,
        2,
        handleSelectedControlData,
        selectedControl
      );
      setRows(generatedRows);
    }

    if (
      store?.controllerItems?.length === 0 &&
      showControllers &&
      directControlData?.length === 0
    ) {
      setShowControllers(() => false);
      setshowSnackbar(true);
      setSnackMessage(
        () =>
          "There are No Controllers For this framework try with different framework"
      );
    }

    if (
      frameworkStore?.frameworkItems?.length > 0 &&
      !showControllers &&
      directControlData?.length === 0
    ) {
      const generatedFrameworkRows = GenerateFrameworkRows(
        frameworkStore?.frameworkItems,
        2,
        handleControllerLists
      );
      setFrameworkRows(generatedFrameworkRows);
    }
  }, [store.controllerItems, frameworkStore?.frameworkItems, selectedControl]);

  useEffect(() => {
    let list1 = [];
    if (
      companyComplianceControlStore?.companyComplianceControlList?.length > 0 &&
      valueState
    ) {
      list1 = companyComplianceControlStore.companyComplianceControlList.map(
        (item) => {
          return item?.control_id || null;
        }
      );
      const generatedRows = GenerateRows(
        list1,
        2,
        handleSelectedControlData,
        selectedControl
      );
      setDirectDataRows(() => generatedRows);
      setShowControllers(() => true);
      setValueState(() => false);
    }
  }, [valueState]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar]);

  const handleBackControl = () => {
    let list1 = companyComplianceControlStore.companyComplianceControlList.map(
      (item) => {
        return item?.control_id || null;
      }
    );
    const generatedRows = GenerateRows(
      list1,
      2,
      handleSelectedControlData,
      null
    );
    setDirectDataRows(() => generatedRows);
    setSelectedControl(() => null);
    setControlledBack(() => true);
    setShowControllers(() => true);
  };
  console.log(store?.controllerItems, "store?.controllerItems");
  return (
    <div className="content">
      {!store?.loading ? <SimpleSpinner /> : null}
      {!frameworkStore?.loading ? <SimpleSpinner /> : null}
      {!companyComplianceControlStore?.loading ? <SimpleSpinner /> : null}

      {showSnackBar ? (
        <ReactSnackBar
          Icon={
            <span>
              <TiMessages size={25} />
            </span>
          }
          Show={showSnackBar}
        >
          {SnackMessage}
        </ReactSnackBar>
      ) : null}

      <Row>
        <Col
          md="12"
          lg="4"
          className="pr-1 complaince-right-container compliance-pie-charts"
        >
          <Card className="card-chart mb-0 h-100" id="scrollTopID">
            <CardBody className="p-0">
              {(rows || directDataRows) && showControllers && (
                <div className="ScrollingEffectGraph">
                  <div className="border-bottom pb-2 btn-control-title mb-2">
                    {directDataRows?.length === 0 && (
                      <Button
                        className="btn btn-primary btn-next mt-0"
                        onClick={handleBack}
                      >
                        <i className="tim-icons icon-minimal-left" />
                      </Button>
                    )}
                    {(!controlledBack || selectedControl !== null) &&
                      directDataRows?.length > 0 && (
                        <Button
                          className="btn btn-primary btn-next mt-0"
                          onClick={handleBackControl}
                        >
                          <i className="tim-icons icon-minimal-left" />
                        </Button>
                      )}
                    <h4 className="text-center">
                      {directDataRows?.length > 0
                        ? "Priority List"
                        : store?.controllerItems[0]?.framework_id?.label}
                    </h4>
                  </div>
                  {directDataRows?.length > 0 ? directDataRows : rows}
                </div>
              )}

              {frameworkRows && !showControllers && (
                <div className="ScrollingEffectGraph">
                  <h3 className="border-bottom text-center pb-2">Frameworks</h3>
                  {frameworkRows}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col md="12" lg="8" className="pl-1 pr-1 complaince-right-container">
          {selectedControl !== null ||
            (store?.controllerItems?.length > 0 && isGoingBack === false) ? (
            <SubControlCard
              selectedTiles={
                selectedControl ? selectedControl : store?.controllerItems[0]
              }
              setIsGoingBack={setIsGoingBack}
            />
          ) : (
            <HistoryAndReportCard />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CompilanceController;
