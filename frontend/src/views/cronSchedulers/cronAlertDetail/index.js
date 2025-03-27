// ** React Imports
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { cleanCronSchedulerMessage, getCronSchedulerAlertWarning } from "../store";

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Button,
  CardBody,
  Collapse,
  FormGroup
} from 'reactstrap';

// ** Utils
import { getFormatDate } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import classnames from 'classnames';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** SVG Icons
import openedIcon from "../../../assets/img/openedPolygon.svg"
import closedIcon from "../../../assets/img/closedPolygon.svg"

const CronAlertDetail = () => {
  // ** Hooks
  const { id } = useParams();
  const navigate = useNavigate();

  // ** Store vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.cronScheduler);

  // ** States
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [selectedAccordion, setSelectedAccordion] = useState();

  useLayoutEffect(() => {
    dispatch(getCronSchedulerAlertWarning({ id }))
  }, [dispatch, id])

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanCronSchedulerMessage());
    }

    if (store.success) {
      setShowSnackbar(true);
      setSnackMessage(store.success);
    }

    if (store.error) {
      setShowSnackbar(true);
      setSnackMessage(store.error);
    }
  }, [store.error, store.success, store.actionFlag, navigate, dispatch])

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  return (
    <div className="content global-management">
      {!store?.loading ? <SimpleSpinner /> : null}

      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snackMessage}
      </ReactSnackBar>

      <div className="p-0 role-name d-flex justify-content-between mb-3">
        <h3 className="card-title mb-0 mt-0">{""}</h3>
        <div className="buttons black-btn">
          <button
            type="button"
            className="btnprimary"
            onClick={() => navigate('/admin/cron-schedulers')}
          >
            Back
          </button>
        </div>
      </div>

      <div>
        {store?.cronSchedulerItem?._id && store?.cronSchedulerErrorItems?.length ? (<>
          <Row className="log-details mb-4">
            <Col md={6}>
              <FormGroup className="d-flex mb-2">
                <label className="mb-0 font-weight-bold">Cron Name:</label>
                <p className="mb-0 text-white ml-1">
                  {store.cronSchedulerItem?.name || ""}
                </p>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="d-flex mb-2">
                <label className="mb-0 font-weight-bold">
                  Cron Type:
                </label>
                <p className="mb-0 text-white ml-1">
                  {store.cronSchedulerItem?.type || ""}
                </p>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="d-flex mb-2">
                <label className="mb-0 font-weight-bold">
                  Cron Status:
                </label>
                <p className="mb-0 text-white ml-1">
                  {store.cronSchedulerItem?.status ? "Enabled" : "Disabled"}
                </p>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="d-flex mb-2">
                <label className="mb-0 font-weight-bold">
                  Description:
                </label>
                <p className="mb-0 text-white ml-1">
                  {store.cronSchedulerItem?.description || ""}
                </p>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col xxs="12" className="mb-4">
              <Card className="m-0">
                <CardBody className='m-0 p-0 assesment-detail'>
                  {store.cronSchedulerErrorItems.map((item, ind) => (
                    <div key={`${item?._id}-${ind}`} className={classnames("accrodion-permi mt-2", {
                      "accordion-border-left": selectedAccordion === ind
                    })}>
                      <Button
                        color="link"
                        className='permission-accordion d-flex align-items-center'
                        onClick={() => {
                          setSelectedAccordion(ind);
                          if (ind === selectedAccordion) {
                            setSelectedAccordion();
                          }
                        }}
                        aria-expanded={selectedAccordion === ind}
                      >
                        <div className="d-flex justify-content-between w-100 pr-4">
                          <span className="pr-2 w-75 heading-fonts">{item?.description}</span>

                          {item?.date ? (<span className="h4 text-white mb-0 w-25 text-right right-percent">{getFormatDate(item.date, "DD-MM-YYYY HH:mm:ss")} </span>) : null}
                        </div>

                        {selectedAccordion === ind ? (
                          <span className="check-box-permission"><img alt="Open" src={openedIcon} /></span>
                        ) : (
                          <span className="check-box-permission"><img alt="Close" src={closedIcon} /></span>
                        )}
                      </Button>

                      <Collapse isOpen={selectedAccordion === ind} className='gobal-input border-top-0'>
                        <Row>
                          {item?.date ? (
                            <Col xxs="12" lg="12" xl="12">
                              <FormGroup className="d-flex mb-2">
                                <label className="mb-0 font-weight-bold">Date:</label>
                                <p className="mb-0 text-white ml-1">
                                  {getFormatDate(item.date, "DD-MM-YYYY HH:mm:ss")}
                                </p>
                              </FormGroup>
                            </Col>
                          ) : null}

                          <Col xxs="12" lg="12" xl="12">
                            <FormGroup className="d-flex mb-2">
                              <label className="mb-0 font-weight-bold">Description:</label>
                              <p className="mb-0 text-white ml-1">
                                {item?.description || ""}
                              </p>
                            </FormGroup>
                          </Col>

                          <Col xxs="12" lg="12" xl="12">
                            <FormGroup className="mb-2">
                              <label className="mb-0 font-weight-bold">Error logs:</label>
                              <p className="mb-0 text-white ml-1">
                                <pre>{JSON.stringify(item.error_logs, null, 2)}</pre>
                              </p>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Collapse>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>) : null}
      </div>
    </div>
  )
}

export default CronAlertDetail;
