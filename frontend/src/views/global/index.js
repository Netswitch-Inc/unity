// ** React Imports
import React, { useState, useEffect, useCallback, useLayoutEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getAuthRolePermission } from "views/login/store";
import { getAppSettings, cleanGlobalSettingMessage, getGlobalSettingsList, updateGlobalSettingsList } from "./store";

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Label,
  Button,
  CardBody,
  Collapse,
  CustomInput,
  UncontrolledTooltip
} from 'reactstrap';
import Select from "react-select";

// ** Utils
import { splitWithPipe, arrayJoinWithPipe /*, onImageSrcError */ } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from 'components/spinner/simple-spinner';

// ** Third Party Components
import classnames from 'classnames';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { hostRestApiUrl, superAdminRole } from "utility/reduxConstant";

// ** Default Avatar
// import defaultAvatar from "assets/img/avatar-default.jpg";

// ** Icons
import infoIcon from "assets/img/info.png";
import openedIcon from "../../assets/img/openedPolygon.svg"
import closedIcon from "../../assets/img/closedPolygon.svg"

const GlobalSetting = () => {
  // ** Hooks
  const navigate = useNavigate()

  // ** Store vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.globalSetting);

  // ** Const
  const aiServiceGroupName = "AI Integration";
  const aiIntegrationSettingType = "ai_integration";
  const aiServiceSettingSlug = "ai_integration_service";
  const notUseCommonGroupStructure = [aiServiceGroupName];

  // ** States
  const [reRenderKey, setReRenderKey] = useState("")
  const [selectedAccordion, setSelectedAccordion] = useState();
  const [settingValues, setSettingValues] = useState([]);
  const [makeRefresh, setMakeRefresh] = useState(false);

  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  const loginStore = useSelector((state) => state.login);
  const authUserItem = loginStore?.authUserItem?._id ? loginStore?.authUserItem : null;

  const handleDefaultReset = useCallback(() => {
    setSettingValues([])
  }, [])

  useLayoutEffect(() => {
    handleDefaultReset()
    dispatch(getGlobalSettingsList())
  }, [handleDefaultReset, dispatch])

  const handleSettingUpdateSuccess = useCallback(() => {
    dispatch(getGlobalSettingsList());
    dispatch(getAuthRolePermission());
    if (makeRefresh) {
      dispatch(getAppSettings());
    }
  }, [dispatch, makeRefresh])

  useEffect(() => {
    if (authUserItem?.role_id?._id !== superAdminRole) {
      navigate('/admin/dashboard')
    }
  })

  useEffect(() => {
    if (store?.actionFlag || store.success || store.error) {
      dispatch(cleanGlobalSettingMessage(null));
    }

    if (store?.actionFlag === "UPDT_GBL_STING") {
      handleSettingUpdateSuccess()
    }

    if (store.success) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
    }

    if (store.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [dispatch, handleSettingUpdateSuccess, store?.actionFlag, store.success, store.error])

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const onInputChange = (id, slug, value) => {
    const data = settingValues;
    if (id && slug) {
      const ind = data.findIndex(x => x._id === id);
      if (ind !== -1) {
        data[ind].value = value;
      } else {
        data.push({ _id: id, slug, value });
      }
    }

    // console.log("onInputChange ",data);
    setSettingValues([...data]);
  }

  const handleChangeImage = (id, slug, event) => {
    const data = [...settingValues];
    if (id && slug && event) {
      const ind = data.findIndex(x => x._id === id);
      const file = event.currentTarget.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (ind !== -1) {
            data[ind].value = reader.result;
          } else {
            data.push({ _id: id, slug, value: reader.result });
          }

          setReRenderKey(new Date().getTime());
        }

        reader.readAsDataURL(file)
      }
    }

    // console.log("handleChangeImage >>> ", data);
    setSettingValues(data);
  }

  const handleChangeSelect = (item = null, val = null) => {
    const data = settingValues;
    const id = item?._id || "";
    const slug = item?.slug || "";
    if (id && slug) {
      const ind = data.findIndex(x => x._id === id);
      if (ind !== -1) {
        data[ind].value = val?.value || "";
      } else {
        data.push({ _id: id, slug, value: val?.value });
      }
    }

    setSettingValues([...data]);
  }

  const getInputOptValue = (item = null) => {
    let result = "";
    const id = item?._id || "";
    if (id) {
      result = item?.value || "";
      const ind = settingValues.findIndex(x => x._id === id);
      if (ind >= 0) {
        result = settingValues[ind]?.value || "";
      }
    }

    return result;
  }

  const getSelectOpsValue = (item = null) => {
    let result = null;
    const id = item?._id || "";
    if (id) {
      let value = item?.value || "";

      const values = item?.options || [];
      const ind = settingValues.findIndex(x => x._id === id);
      if (ind !== -1) {
        if (settingValues[ind]?.value) { value = settingValues[ind].value; }
      }

      const itm = values?.find((x) => x.value === value) || null;
      if (itm && itm?.value) { result = itm; }
    }

    return result;
  }

  const getCheckboxOpsValue = (item = null, val = "") => {
    let result = "";
    const id = item?._id || "";
    if (id) {
      let value = item?.value || "";

      const ind = settingValues.findIndex(x => x._id === id);
      if (ind !== -1) {
        if (settingValues[ind]?._id) { value = settingValues[ind].value; }
      }

      const values = splitWithPipe(value) || [];
      result = values?.find((x) => x === val) || "";
    }

    return result || ""
  }

  const getImageOptValue = (item = null) => {
    let result = "";
    const id = item?._id || "";
    if (id) {
      let value = item?.value || "";

      const ind = settingValues.findIndex(x => x._id === id);
      if (ind !== -1) {
        if (settingValues[ind]?._id) { value = settingValues[ind].value; }
      }

      if (value) {
        result = `${hostRestApiUrl}/${value}`;
        if (value.includes(";base64,")) { result = value; }
      }
    }

    // console.log("getImageOptValue >>> ", result);
    return result || ""
  }

  const handleChangeCheckbox = (item = null, val = null, value = "") => {
    const data = settingValues;
    const id = item?._id || "";
    const slug = item?.slug || "";
    if (id && slug) {
      let values = splitWithPipe(item?.value) || [];
      const ind = data.findIndex((x) => x._id === id);
      if (ind !== -1) {
        values = splitWithPipe(data[ind].value) || [];
        const checked = values.findIndex((x) => x === val?.value)
        if (checked !== -1) {
          values.splice(checked, 1);
        } else {
          values.push(val?.value || "");
        }

        data[ind].value = arrayJoinWithPipe(values) || "";
      } else {
        const checked = values.findIndex((x) => x === val?.value)
        if (checked !== -1) {
          values.splice(checked, 1);
        } else {
          values.push(val?.value || "");
        }

        data.push({ _id: id, slug, value: arrayJoinWithPipe(values) || "" });
      }
    }

    setSettingValues([...data]);
  }

  const onSubmit = () => {
    if (settingValues?.length) {
      const settingData = {
        data: settingValues
      }

      const isMatch = settingValues.some((item) => item?.slug.includes('app_setting'));
      setMakeRefresh(isMatch);

      dispatch(updateGlobalSettingsList(settingData));
    }
  }

  const handleGetSettingItem = (slug = "", settings = []) => {
    if (slug && settings?.length) {
      const setting = settings.find((x) => x.slug === slug) || null;
      return setting;
    }

    return null;
  }

  const renderAIServicesAPIKeyInput = (slug = "", group = null) => {
    if (slug && group?.settings?.length) {
      const aiServiceValue = getSelectOpsValue(handleGetSettingItem(aiServiceSettingSlug, group?.settings))?.value;
      if (aiServiceValue && handleGetSettingItem(`${aiIntegrationSettingType}_${aiServiceValue}_api_key`, group?.settings)) {
        const settingItem = handleGetSettingItem(`${aiIntegrationSettingType}_${aiServiceValue}_api_key`, group?.settings);
        return (
          <Col xxs="12" lg="12" xl="12">
            <div id={`container-${settingItem.slug}`} className={classnames("full-width")}>
              <Label className="col-label w-100">
                {settingItem.name}

                {settingItem?.note ? (
                  <span className="ml-1">
                    <img
                      alt="icon"
                      width={16}
                      height={16}
                      src={infoIcon}
                      id={`tooltip-icon-${settingItem.slug}`}
                      className="i-icon-img cursor-pointer"
                    />

                    <UncontrolledTooltip placement="auto" container={`container-${settingItem.slug}`} target={`tooltip-icon-${settingItem.slug}`}>
                      <div className="inner-desc">{settingItem.note}</div>
                    </UncontrolledTooltip>
                  </span>
                ) : null}
              </Label>

              <CustomInput
                type="text"
                id={settingItem.slug}
                name={settingItem.slug}
                className="col-input w-100"
                disabled={settingItem?.disabled || false}
                value={getInputOptValue(settingItem) || ""}
                onInput={(event) => onInputChange(settingItem?._id, settingItem?.slug, event?.target?.value)}
              />
            </div>
          </Col>
        )
      }
    }

    return null;
  }

  return (
    <div className="content global-management">
      {!store?.loading ? (
        <SimpleSpinner />
      ) : null}

      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snakebarMessage}
      </ReactSnackBar>

      <div className='container-fluid'>
        {store?.globalSettingsList && store?.globalSettingsList?.length > 0 ? (
          <Row key={reRenderKey}>
            <Col xxs="12" className="mb-4">
              <Card className="m-0">
                {/* <div className="p-0 border-bottom pb-2 card-header row justify-content-between m-0">
                  <h3 className='card-title mb-0 mt-0'>Global Setting</h3>
                  <button
                      type="button"
                      className="btn btn-primary d-none"
                  >
                      Back
                  </button>
                </div> */}

                <CardBody className='m-0 p-0'>
                  {store?.globalSettingsList.map((group, indexTab) => (
                    <div key={`div_${indexTab}_${group.group_name}`} className={classnames("accrodion-permi mt-2", {
                      "accordion-border-left": selectedAccordion === indexTab
                    })}>
                      <Button
                        color="link"
                        className='permission-accordion d-flex align-items-center'
                        onClick={() => {
                          setSelectedAccordion(indexTab);
                          if (indexTab === selectedAccordion) {
                            setSelectedAccordion();
                          }
                        }}
                        aria-expanded={selectedAccordion === indexTab}
                      >
                        {selectedAccordion === indexTab ? (
                          <span className="check-box-permission"><img alt="Open" src={openedIcon} /></span>
                        ) : (
                          <span className="check-box-permission"><img alt="Close" src={closedIcon} /></span>
                        )} <span>{group.group_name} </span>
                      </Button>

                      <Collapse isOpen={selectedAccordion === indexTab} className='gobal-input border-top-0'>
                        <Row>
                          {!notUseCommonGroupStructure.includes(group?.group_name) ? (<>
                            {group.settings.map((setting, ind) => (<Fragment key={`custom_${setting.slug}`}>
                              <Col xxs="12" lg="12" xl="12">
                                <div
                                  id={`container-${setting.slug}`}
                                  className={classnames("full-width", {
                                    "": setting?.type === "select"
                                  })}
                                >
                                  <Label className="col-label w-100">
                                    {setting.name}

                                    {setting?.note ? (
                                      <span className="ml-1">
                                        <img
                                          alt="icon"
                                          width={16}
                                          height={16}
                                          src={infoIcon}
                                          id={`tooltip-icon-${setting.slug}`}
                                          className="i-icon-img cursor-pointer"
                                        />

                                        <UncontrolledTooltip placement="auto" container={`container-${setting.slug}`} target={`tooltip-icon-${setting.slug}`}>
                                          <div className="inner-desc">{setting.note}</div>
                                        </UncontrolledTooltip>
                                      </span>
                                    ) : null}
                                  </Label>

                                  {setting?.type === "text" ? (
                                    <CustomInput
                                      type="text"
                                      id={setting.slug}
                                      name={setting.slug}
                                      className="col-input w-100"
                                      disabled={setting?.disabled || false}
                                      value={getInputOptValue(setting) || ""}
                                      onInput={(event) => onInputChange(setting?._id, setting?.slug, event?.target?.value)}
                                    />
                                  ) : null}

                                  {setting?.type === "image" ? (
                                    <div className="d-flex">
                                      <span className="col-photo">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          name={setting.slug}
                                          onChange={(event) => handleChangeImage(setting?._id, setting?.slug, event)}
                                          disabled={setting?.disabled || false}
                                        />
                                      </span>

                                      {getImageOptValue(setting) ? (
                                        <img
                                          width={50}
                                          height={45}
                                          alt="Avatar"
                                          key={setting.slug}
                                          src={getImageOptValue(setting)}
                                          style={{
                                            marginLeft: "10px",
                                            maxWidth: "100%"
                                          }}
                                        // onError={(currentTarget) => onImageSrcError(currentTarget, defaultAvatar)}
                                        />
                                      ) : null}
                                    </div>
                                  ) : null}

                                  {setting?.options?.length ? (<>
                                    {setting?.type === "select" ? (
                                      <Select
                                        onBlur={() => null}
                                        placeholder="Select..."
                                        id={`${setting.slug}-select`}
                                        name={`${setting.slug}-select`}
                                        options={setting?.options || []}
                                        classNamePrefix="react-select"
                                        className="react-select col-select w-100"
                                        value={getSelectOpsValue(setting)}
                                        onChange={(val) => handleChangeSelect(setting, val)}
                                        isDisabled={setting?.disabled || false}
                                      />
                                    ) : null}

                                    {setting?.type === "checkbox" ? (
                                      <div className="row m-0">
                                        {setting.options.map((opt) => (
                                          <div key={`${setting?.slug}-${opt.value}-${ind}`} className="d-flex align-items-center checkbox-container">
                                            <label className="checkbox-box text-center">
                                              <input
                                                type="checkbox"
                                                className="pointer mr-1 align-middle"
                                                id={`${setting?.slug}-${opt.value}-${ind}-checkbox`}
                                                name={`${setting?.slug}-${opt.value}-${ind}-checkbox`}
                                                checked={(getCheckboxOpsValue(setting, opt.value) === opt?.value) || false}
                                                onChange={() => handleChangeCheckbox(setting, opt)}
                                                disabled={setting?.disabled || false}
                                              />
                                              <span className="checkmark" for={`${setting?.slug}-${opt.value}-${ind}-checkbox`}></span>
                                            </label>

                                            <Label
                                              for={`${setting?.slug}-${opt.value}-${ind}-checkbox`}
                                              className="form-check-label user-select-none pointer mb-0 ml-2"
                                            >
                                              {opt?.label || ""}
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                    ) : null}

                                    {setting?.type === "radio" ? (
                                      <div className="radio-container d-flex">
                                        {setting.options.map((opt) => (
                                          <div key={`${setting?.slug}-${opt.value}-${ind}`} className="form-check">
                                            <input
                                              type="radio"
                                              className="mx-2"
                                              value={opt.value}
                                              aria-label={opt?.label || ""}
                                              id={`${opt.value}-${ind}-radio`}
                                              name={`${setting?.slug}-${ind}-radio`}
                                              disabled={setting?.disabled || false}
                                              checked={(getSelectOpsValue(setting)?.value === opt.value) || false}
                                              onChange={() => handleChangeSelect(setting, opt)}
                                            />
                                            <label htmlFor={`${opt.value}-${ind}-radio`} className="form-check-label">
                                              {opt?.label || ""}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    ) : null}
                                  </>) : null}
                                </div>
                              </Col>
                            </Fragment>))}

                            <Col className="btn-login">
                              <div className="buttons">
                                <button
                                  type="button"
                                  color="primary"
                                  className="btnprimary"
                                  disabled={!settingValues?.length}
                                  onClick={() => onSubmit()}
                                >
                                  Submit
                                </button>
                              </div>
                            </Col>
                          </>) : null}

                          {group?.group_name === aiServiceGroupName && handleGetSettingItem(aiServiceSettingSlug, group?.settings) ? (<>
                            <Col xxs="12" lg="12" xl="12">
                              <div id={`container-${aiServiceSettingSlug}`} className={classnames("full-width")}>
                                <Label className="col-label w-100">
                                  {handleGetSettingItem(aiServiceSettingSlug, group?.settings)?.name}

                                  {handleGetSettingItem(aiServiceSettingSlug, group?.settings)?.note ? (
                                    <span className="ml-1">
                                      <img
                                        alt="icon"
                                        width={16}
                                        height={16}
                                        src={infoIcon}
                                        id={`tooltip-icon-${aiServiceSettingSlug}`}
                                        className="i-icon-img cursor-pointer"
                                      />

                                      <UncontrolledTooltip placement="auto" container={`container-${aiServiceSettingSlug}`} target={`tooltip-icon-${aiServiceSettingSlug}`}>
                                        <div className="inner-desc">{handleGetSettingItem(aiServiceSettingSlug, group?.settings).note}</div>
                                      </UncontrolledTooltip>
                                    </span>
                                  ) : null}
                                </Label>

                                {handleGetSettingItem(aiServiceSettingSlug, group?.settings)?.options?.length ? (<>
                                  <div className="radio-container d-flex">
                                    {handleGetSettingItem(aiServiceSettingSlug, group?.settings).options.map((opt) => (
                                      <div key={`${aiServiceSettingSlug}-${opt.value}`} className="form-check">
                                        <input
                                          type="radio"
                                          className="mx-2"
                                          value={opt.value}
                                          aria-label={opt?.label || ""}
                                          id={`${opt.value}-radio`}
                                          name={`${aiServiceSettingSlug}-radio`}
                                          disabled={handleGetSettingItem(aiServiceSettingSlug, group?.settings)?.disabled || false}
                                          checked={(getSelectOpsValue(handleGetSettingItem(aiServiceSettingSlug, group?.settings))?.value === opt.value) || false}
                                          onChange={() => handleChangeSelect(handleGetSettingItem(aiServiceSettingSlug, group?.settings), opt)}
                                        />
                                        <label htmlFor={`${opt.value}-radio`} className="form-check-label">
                                          {opt?.label || ""}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </>) : null}
                              </div>
                            </Col>

                            {renderAIServicesAPIKeyInput(aiServiceSettingSlug, group)}

                            {group?.settings?.length ? (
                              <Col className="btn-login">
                                <div className="buttons">
                                  <button
                                    type="button"
                                    color="primary"
                                    className="btnprimary"
                                    disabled={!settingValues?.length}
                                    onClick={() => onSubmit()}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </Col>
                            ) : null}
                          </>) : null}
                        </Row>
                      </Collapse>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : null}
      </div>
    </div>
  )
}

export default GlobalSetting;
