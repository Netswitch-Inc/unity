// ** React Imports
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
    cleanRoleMessage,
    getRolePermissions,
    createRolePermission,
    updateRolePermission
} from './store';

// ** Reactstrap Imports
import { Card, CardBody, Col, Row, Table } from 'reactstrap';

// ** Utils
import { isObjEmpty } from 'utility/Utils';

// ** Custom Components
import SimpleSpinner from 'components/spinner/simple-spinner';

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages, TiArrowLeft } from "react-icons/ti";

const ModulePermission = () => {
    // ** Hooks
    const { id } = useParams();
    const navigate = useNavigate();

    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.roles);

    // ** States
    const [selectedGroup, setSelectedGroup] = useState("");
    const [showSnackBar, setshowSnackbar] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    const handleRolePermissions = useCallback(() => {
        dispatch(getRolePermissions({ role_id: id }));
    }, [dispatch, id])

    useLayoutEffect(() => {
        handleRolePermissions();
    }, [handleRolePermissions, dispatch])

    useEffect(() => {
        if (store?.actionFlag || store?.success || store?.error) {
            dispatch(cleanRoleMessage());
        }

        if (store?.success) {
            setshowSnackbar(true);
            setSnackMessage(store.success);
        }

        if (store?.error) {
            setshowSnackbar(true);
            setSnackMessage(store.error);
        }

        if (store?.actionFlag === "PERMISSION_CREATED" || store?.actionFlag === "PERMISSION_UPDATED") {
            handleRolePermissions()
        }
    }, [handleRolePermissions, store.actionFlag, store.success, store.error, dispatch])

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const handleChange = (checked = false, action = "", row) => {
        const payload = {
            _id: row?._id,
            can_all: row?.can_all || false,
            can_read: row?.can_read || false,
            can_create: row?.can_create || false,
            can_update: row?.can_update || false,
            can_delete: row?.can_delete || false
        };
        if (row?.company_id) {
            payload.company_id = row?.company_id?._id || row?.company_id;
        }

        if (row?.module_id) {
            payload.module_id = row?.module_id?._id || row?.module_id;
        }

        if (row?.role_id) {
            payload.role_id = row?.role_id?._id || row?.role_id;
        }

        if (!row?.role_id) { payload.role_id = id; }

        if (action === "can_read") {
            payload.can_read = checked;
        } else if (action === "can_create") {
            payload.can_create = checked;
        } else if (action === "can_update") {
            payload.can_update = checked;
        } else if (action === "can_delete") {
            payload.can_delete = checked;
        }

        if (payload.can_read && payload.can_create && payload.can_update && payload.can_delete) {
            payload.can_all = true;
        } else {
            payload.can_all = false;
        }

        if (payload?._id) {
            dispatch(updateRolePermission(payload));
        } else {
            dispatch(createRolePermission(payload));
        }
    }

    const handleChangeSelectAll = async (checked = false, row) => {
        const payload = {
            _id: row?._id,
            can_all: checked,
            can_read: checked,
            can_create: checked,
            can_update: checked,
            can_delete: checked
        }

        if (row?.company_id) {
            payload.company_id = row?.company_id?._id || row?.company_id;
        }

        if (row?.module_id) {
            payload.module_id = row?.module_id?._id || row?.module_id;
        }

        if (row?.role_id) {
            payload.role_id = row?.role_id?._id || row?.role_id;
        }

        if (!row?.role_id) { payload.role_id = id; }
        if (payload?._id) {
            dispatch(updateRolePermission(payload));
        } else {
            dispatch(createRolePermission(payload));
        }
    }

    return (
        <div className="content role-management">
            {!store?.loading ? (
                <SimpleSpinner />
            ) : null}

            <div className='container-fluid'>
                <ReactSnackBar Icon={(
                    <span><TiMessages size={25} /></span>
                )} Show={showSnackBar}>
                    {snackMessage}
                </ReactSnackBar>

                <Row>
                    <Col className="col-md-12 col-xxl-10 ml-auto mr-auto">
                        <Card className="card-category card-subcategories m-0">
                            <div className="p-0 border-bottom pb-2 card-header row justify-content-between m-0">
                                <h3 className='card-title mb-0 mt-0'>
                                    {store?.roleItem?.name || ""} - Module Permissions
                                </h3>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => navigate('/admin/roles')}
                                >
                                    Back
                                    <TiArrowLeft size={25} title="Back" className='ml-2' />
                                </button>
                            </div>

                            <CardBody className='m-0 p-0'>
                                <div className='role--container mt-2 mb-0 pt-0 pb-0 d-block'>
                                    {store?.groupPermissions && !isObjEmpty(store.groupPermissions) && Object.keys(store.groupPermissions).length ? (
                                        <ul className='nested-Lists'>
                                            {Object.keys(store.groupPermissions).map((key) => (
                                                store.groupPermissions && store.groupPermissions[key] && store.groupPermissions[key]?.length ? (
                                                    <li key={key}>
                                                        <div className='d-flex align-items-center mb-0'>
                                                            <span
                                                                className="check-box-permission user-select-none"
                                                                onClick={() => {
                                                                    setSelectedGroup(key);
                                                                    if (key === selectedGroup) {
                                                                        setSelectedGroup("");
                                                                    }
                                                                }}
                                                            >
                                                                <p>{selectedGroup === key ? "-" : "+"}</p>
                                                            </span>
                                                            <label className="text-capitalize mb-0" title={key} htmlFor={key}>{key}</label>
                                                        </div>

                                                        {key === selectedGroup ? (
                                                            <Table className="" responsive>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Module Name</th>
                                                                        <th className="text-center">All</th>
                                                                        <th className="text-center">View</th>
                                                                        <th className="text-center">Create</th>
                                                                        <th className="text-center">Update</th>
                                                                        <th className="text-center">Delete</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {store.groupPermissions[key].map((item, index) => (
                                                                        <tr key={`${key}-${index}`}>
                                                                            <td>{item?.module_id?.name}</td>
                                                                            <td className="text-center">
                                                                                <input
                                                                                    id={`can_all-${key}-${index}`}
                                                                                    type="checkbox"
                                                                                    className="form-check-input pointer "
                                                                                    checked={item?.can_all || false}
                                                                                    onChange={(event) => handleChangeSelectAll(event?.target?.checked, item)}
                                                                                />
                                                                            </td>

                                                                            <td className="text-center">
                                                                                <input
                                                                                    id={`can_read-${key}-${index}`}
                                                                                    type="checkbox"
                                                                                    className="form-check-input pointer "
                                                                                    checked={item?.can_read || false}
                                                                                    onChange={(event) => handleChange(event?.target?.checked, "can_read", item)}
                                                                                />
                                                                            </td>

                                                                            <td className="text-center">
                                                                                <input
                                                                                    id={`can_create-${key}-${index}`}
                                                                                    type="checkbox"
                                                                                    className="form-check-input pointer "
                                                                                    checked={item?.can_create || false}
                                                                                    onChange={(event) => handleChange(event?.target?.checked, "can_create", item)}
                                                                                />
                                                                            </td>

                                                                            <td className="text-center">
                                                                                <input
                                                                                    id={`can_update-${key}-${index}`}
                                                                                    type="checkbox"
                                                                                    className="form-check-input pointer "
                                                                                    checked={item?.can_update || false}
                                                                                    onChange={(event) => handleChange(event?.target?.checked, "can_update", item)}
                                                                                />
                                                                            </td>

                                                                            <td className="text-center">
                                                                                <input
                                                                                    id={`can_delete-${key}-${index}`}
                                                                                    type="checkbox"
                                                                                    className="form-check-input pointer "
                                                                                    checked={item?.can_delete || false}
                                                                                    onChange={(event) => handleChange(event?.target?.checked, "can_delete", item)}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        ) : null}
                                                    </li>
                                                ) : null
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ModulePermission;
