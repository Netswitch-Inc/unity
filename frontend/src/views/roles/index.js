/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getRoleList, deleteRole, cleanRoleMessage } from './store';

// ** Reactstrap Imports
import { Col, Row } from 'reactstrap';

// ** Utils
import { getModulePermissionData } from 'utility/Utils';

// ** Custom Components
import SimpleSpinner from 'components/spinner/simple-spinner';

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// ** Constant
import { roleItem, rolesPermissionId, masterGroupPermissionId } from "utility/reduxConstant";

import AddNewRoleModal from './modals/AddNewRoleModal';

import deleteicon from "assets/img/delete_blue.svg";
import settingicon from "assets/img/setting.svg";

const RoleList = () => {
    // ** Hooks
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.roles);
    const loginStore = useSelector((state) => state.login);

    // ** Const
    const permission = getModulePermissionData(loginStore?.authRolePermission, rolesPermissionId, masterGroupPermissionId);

    // ** States
    const [modalOpen, setModalOpen] = useState(false);
    const [roleItemData, setRoleItemData] = useState(roleItem);

    const [showSnackBar, setshowSnackbar] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    /* Pagination */
    const [sort] = useState("desc");
    const [sortColumn] = useState("_id");

    const handleRoleLists = useCallback((sorting = sort,
        sortCol = sortColumn) => {
        dispatch(getRoleList({
            sort: sorting,
            sortColumn: sortCol
        }));
    }, [sort, sortColumn, dispatch])

    useLayoutEffect(() => {
        handleRoleLists();
    }, [handleRoleLists, dispatch])

    useEffect(() => {
        const actionEvent = ["ROLE_CREATED", "ROLE_UPDATED", "ROLE_DELETED"];
        if (actionEvent.includes(store?.actionFlag)) {
            handleRoleLists();
        }

        if (store?.actionFlag || store?.success || store?.error) {
            dispatch(cleanRoleMessage());
        }

        if (store?.success && store?.actionFlag !== "ROLE_LST") {
            setshowSnackbar(true);
            setSnackMessage(store.success);
        }

        if (store?.error) {
            setshowSnackbar(true);
            setSnackMessage(store.error);
        }
    }, [handleRoleLists, store.actionFlag, store.success, store.error, dispatch])

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const handleEditRole = (item = null) => {
        setRoleItemData(item || roleItem);
        setModalOpen(true);
    }

    const handleDeleteRole = (id = "") => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteRole(id));
            }
        });
    }

    return (
        <div className="content data-list">
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
                    <div className="col-md-12 col-xxl-10 mx-auto tbl-height-container roles-page">
                        <Row>
                            {store?.roleItems?.length ? (
                                store.roleItems.map((item, ind) => (
                                    <Col key={`${item?._id}-${ind}`} sm={6} lg={4} xl={3} className='grid-box'>
                                        <div className='content-wrap'>
                                            <h3 className='title'>{item?.name || ""}</h3>
                                            <div className='actions'>
                                                <div className='edit'>
                                                    {permission?.update ? (
                                                        <a
                                                            // title="Edit"
                                                            role="button"
                                                            onClick={() => handleEditRole(item)}
                                                        >
                                                            Edit Role
                                                        </a>
                                                    ) : null}
                                                </div>

                                                <div className='view-delete'>
                                                    {permission?.update ? (
                                                        <a
                                                            role="button"
                                                            className='view'
                                                            title="Module Permission"
                                                            onClick={() => navigate(`permission/${item?._id}`)}
                                                        >
                                                            <img src={settingicon} alt="" />
                                                        </a>
                                                    ) : null}

                                                    {!item?.is_default && permission?.delete ? (
                                                        <a
                                                            role="button"
                                                            title="Delete"
                                                            className="delete"
                                                            onClick={() => handleDeleteRole(item?._id)}
                                                        >
                                                            <img src={deleteicon} alt="" />
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            ) : null}

                            {permission?.create ? (
                                <Col sm={6} lg={4} xl={3} className='grid-box'>
                                    <div className='content-wrap'>
                                        <div className='buttons'>
                                            <button type="button"
                                                className='btnprimary'
                                                onClick={() => setModalOpen(true)}
                                            >
                                                Add New Role
                                            </button>
                                        </div>

                                        <div className='content-box'>
                                            Add a new role, if it does not exist
                                        </div>
                                    </div>
                                </Col>
                            ) : null}
                        </Row>

                        <AddNewRoleModal
                            open={modalOpen}
                            roleItemData={roleItemData}
                            closeModal={() => setModalOpen(false)}
                            resetRoleItemData={() => setRoleItemData(roleItem)}
                        />
                    </div>
                </Row>
            </div>
        </div>
    )
}

export default RoleList;
