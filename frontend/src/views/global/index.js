// ** React Imports
import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getAuthRolePermission } from "views/login/store";
import { cleanGlobalSettingMessage, getGlobalSettingsList, updateGlobalSettingsList } from "./store";

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    Label,
    Button,
    CardBody,
    Collapse,
    CustomInput
} from 'reactstrap';
import { FormikReactSelect } from "components/FormikFields";

// ** Utils
import { splitWithPipe, arrayJoinWithPipe, onImageSrcError } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from 'components/spinner/simple-spinner';

// ** Third Party Components
import classnames from 'classnames';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { hostRestApiUrl, superAdminRole } from "utility/reduxConstant";

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";

// ** SVG Icons
import openedIcon from "../../assets/img/openedPolygon.svg"
import closedIcon from "../../assets/img/closedPolygon.svg"

const GlobalSetting = () => {
    const navigate = useNavigate()

    const dispatch = useDispatch();
    const store = useSelector((state) => state.globalSetting);

    // ** States
    const [reRenderKey, setReRenderKey] = useState("")
    const [selectedAccordion, setSelectedAccordion] = useState();
    const [settingValues, setSettingValues] = useState([]);

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
    }, [dispatch])

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

        return result
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

            dispatch(updateGlobalSettingsList(settingData));
        }
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
                                                    {group.settings.map((setting, ind) => (
                                                        <Col xxs="12" lg="12" xl="12" key={`custom_${setting.slug}`}>
                                                            <div className={classnames("full-width", {
                                                                "": setting?.type === "select"
                                                            })}>
                                                                <Label className="col-label w-100">{setting.name}</Label>
                                                                {setting?.type === "text" ? (
                                                                    <CustomInput
                                                                        type="text"
                                                                        id={setting.slug}
                                                                        name={setting.slug}
                                                                        defaultValue={setting.value}
                                                                        className="col-input w-100"
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
                                                                                onError={(currentTarget) => onImageSrcError(currentTarget, defaultAvatar)}
                                                                            />
                                                                        ) : null}
                                                                    </div>
                                                                ) : null}

                                                                {setting?.type === "select" ? (
                                                                    <FormikReactSelect
                                                                        id={setting.slug}
                                                                        name={setting.slug}
                                                                        onBlur={() => null}
                                                                        placeholder="Select..."
                                                                        classNamePrefix="react-select"
                                                                        className="react-select col-select w-100"
                                                                        options={setting?.options || []}
                                                                        value={getSelectOpsValue(setting)}
                                                                        onChange={(name, val) => handleChangeSelect(setting, val)}
                                                                    />
                                                                ) : null}

                                                                {setting?.options?.length && setting?.type === "checkbox" ? (
                                                                    <div className="row m-0">
                                                                        {setting.options.map((opt) => (
                                                                            <div key={`${opt.value}-${ind}`} className="d-flex align-items-center checkbox-container">
                                                                                <label className="checkbox-box text-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        id={`${opt.value}-${ind}`}
                                                                                        name={`${opt.value}-${ind}`}
                                                                                        className="pointer mr-1 align-middle"
                                                                                        checked={(getCheckboxOpsValue(setting, opt.value) === opt?.value) || false}
                                                                                        onChange={() => handleChangeCheckbox(setting, opt)}
                                                                                    />
                                                                                    <span className="checkmark" for={`${opt.value}-${ind}`}></span>
                                                                                </label>

                                                                                <Label
                                                                                    for={`${opt.value}-${ind}`}
                                                                                    className="form-check-label user-select-none pointer mb-0 ml-2"
                                                                                >
                                                                                    {opt?.label || ""}
                                                                                </Label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </Col>
                                                    ))}

                                                    <Col className="btn-login ml-1">
                                                        <Button
                                                            type="button"
                                                            color="primary"
                                                            className="mb-3"
                                                            onClick={() => onSubmit()}
                                                        >
                                                            Submit
                                                        </Button>
                                                    </Col>
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
