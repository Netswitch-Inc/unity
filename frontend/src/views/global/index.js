import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getAuthRolePermission } from "views/login/store";
import { cleanGlobalSettingMessage, getGlobalSettingsList, updateGlobalSettingsList } from "./store";

import {
    Col,
    Row,
    Card,
    Label,
    Button,
    CardBody,
    Collapse,
    FormGroup,
    CustomInput
} from 'reactstrap';
import { FormikReactSelect } from "components/FormikFields";

// ** Utils
import { splitWithPipe, arrayJoinWithPipe } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from 'components/spinner/simple-spinner';

// ** Third Party Components
import classnames from 'classnames';
import ReactSnackBar from "react-js-snackbar";
import { TiArrowLeft, TiMessages } from "react-icons/ti";

// ** Constant
import { superAdminRole } from "utility/reduxConstant";

const GlobalSetting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const store = useSelector((state) => state.globalSetting);

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

    return (<>
        <div className="content data-list global-management">
            {!store?.loading ? (
                <SimpleSpinner />
            ) : null}

            {showSnackBar && (
                <ReactSnackBar
                    Icon={(<span><TiMessages size={25} /></span>)}
                    Show={showSnackBar}
                >
                    {snakebarMessage}
                </ReactSnackBar>
            )}

            <div className='container-fluid'>
                {store?.globalSettingsList && store?.globalSettingsList?.length > 0 ? (
                    <Row>
                        <Col xxs="12" className="mb-4">
                            <Card className="m-0">
                                <div className="p-0 border-bottom pb-2 card-header row justify-content-between m-0">
                                    <h3 className='card-title mb-0 mt-0'>Global Setting</h3>
                                    <button
                                        type="button"
                                        className="btn btn-primary d-none"
                                    >
                                        Back
                                        <TiArrowLeft size={25} title="Back" className='ml-2' />
                                    </button>
                                </div>

                                <CardBody className='m-0 p-0'>
                                    {store?.globalSettingsList.map((group, indexTab) => (
                                        <div className="accrodion-permi mt-2" key={`div_${indexTab}_${group.group_name}`}>
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
                                                    <span className="check-box-permission"><p className="mb-0">-</p></span>
                                                ) : (
                                                    <span className="check-box-permission"><p className="mb-0">+</p></span>
                                                )} <span>{group.group_name} </span>
                                            </Button>

                                            <Collapse isOpen={selectedAccordion === indexTab} className='gobal-input border-top-0'>
                                                <Row>
                                                    {group.settings.map((setting, ind) => (
                                                        <Col xxs="12" lg="12" xl="12" key={`custom_${setting.slug}`}>
                                                            <FormGroup className={classnames({
                                                                'mb-4': true,
                                                                '': setting?.type === "select"
                                                            })}>
                                                                <Label className="w-100 d-block">{setting.name}</Label>
                                                                {setting?.type === "text" ? (
                                                                    <CustomInput
                                                                        type="text"
                                                                        id={setting.slug}
                                                                        name={setting.slug}
                                                                        defaultValue={setting.value}
                                                                        className="w-100 form-control"
                                                                        onInput={(event) => onInputChange(setting._id, setting.slug, event.target.value)}
                                                                    />
                                                                ) : null}

                                                                {setting?.type === "select" ? (<>
                                                                    <FormikReactSelect
                                                                        id={setting.slug}
                                                                        name={setting.slug}
                                                                        onBlur={() => null}
                                                                        placeholder="Select..."
                                                                        options={setting?.options || []}
                                                                        value={getSelectOpsValue(setting)}
                                                                        onChange={(name, val) => handleChangeSelect(setting, val)}
                                                                    />
                                                                </>) : null}

                                                                {setting?.options?.length && setting?.type === "checkbox" ? (<>
                                                                    {setting.options.map((opt) => (
                                                                        <div key={`${opt.value}-${ind}`} className="d-inline-block mr-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`${opt.value}-${ind}`}
                                                                                className="pointer mr-1 align-middle"
                                                                                checked={(getCheckboxOpsValue(setting, opt.value) === opt?.value) || false}
                                                                                onChange={() => handleChangeCheckbox(setting, opt)}
                                                                            />
                                                                            <Label
                                                                                for={`${opt.value}-${ind}`}
                                                                                className="form-check-label user-select-none pointer mb-0"
                                                                            >
                                                                                {opt?.label || ""}
                                                                            </Label>
                                                                        </div>
                                                                    ))}
                                                                </>) : null}
                                                            </FormGroup>
                                                        </Col>
                                                    ))}

                                                    <Col className="btn-login text-center">
                                                        <FormGroup>
                                                            <Button
                                                                type="button"
                                                                color="primary"
                                                                className=""
                                                                onClick={() => onSubmit()}
                                                            >
                                                                Submit
                                                            </Button>
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
                ) : null}
            </div>
        </div>
    </>)
}

export default GlobalSetting;