/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import React, { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getRoleList, createRole, updateRole, deleteRole, cleanRoleMessage } from './store';

// ** Reactstrap Imports
import { Card, CardBody, Form, Row, Col, Label } from "reactstrap";

// ** Third Party Components
import Loader from "react-loader";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

import PermissionView from './PermissionView';

import '../../assets/css/AdminControl.css';
import "bootstrap/dist/css/bootstrap.min.css";

const RoleManagement = () => {
    const MySwal = withReactContent(Swal);

    const dispatch = useDispatch();
    const store = useSelector((state) => state.roles);

    // ** Const
    const permissions = {
        admin: {
            userManagement: false,
            roleManagement: false,
            companyManagement: false
        },
        defence: {
            incident: false,
            ransombloc: false
        },
        discovery: {
            pentest: false,
            inventory: false
        },
        governance: {
            ram: false,
            cb: false,
            csc: false,
            cc: false,
            all_task: false
        },
        tools: {
            cve_tool: false,
            threatsource: false,
            cl_tool: false,
            Zeek: false
        }
    }

    const inputRef = useRef(null);

    // ** States
    const [loadFirst, setLoadFirst] = useState(true);
    const [isShownAddRoleData, setIsShownAddRoleData] = useState(false);
    const [allPermissionsSelected, setAllPermissionsSelected] = useState(false);
    const [nameRoleTitle, setNameRoleTitle] = useState("");
    const [rolePermission, setRolePermission] = useState(permissions);
    const [selectedRole, setSelectedRole] = useState("");

    const [isShownDefenceChild, setIsShownDefenceChild] = useState(false);
    const [isShownDiscoverychild, setIsShownDiscoveryChild] = useState(false);
    const [isShownAdminChild, setIsShownAdminChild] = useState(false);
    const [isShownGovernanceChild, setIsShownGovernanceChild] = useState(false);
    const [IsShownToolsChild, setIsShownToolsChild] = useState(false);

    const [showSnackBar, setshowSnackbar] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    const handleRoleLists = useCallback(() => {
        dispatch(getRoleList());
    }, [dispatch])

    useLayoutEffect(() => {
        if (loadFirst) {
            handleRoleLists();
            setLoadFirst(false);
        }
    }, [handleRoleLists, loadFirst, dispatch])

    useEffect(() => {
        if (store?.actionFlag === "ROLE_LST" && store?.roleItems?.length === 0) {
            setSelectedRole("");
            setRolePermission(permissions);
        }

        if (store?.actionFlag === "ROLE_LST" && store?.roleItems?.length) {
            let roleId = store.roleItems[0]?._id;
            let rolePermis = store.roleItems[0]?.permission || permissions
            if (selectedRole) {
                const roleItm = store.roleItems.find((x) => x._id === selectedRole);
                if (roleItm?._id) {
                    roleId = roleItm._id;
                    rolePermis = roleItm?.permission || permissions;
                }
            }

            setSelectedRole(roleId);
            setRolePermission(rolePermis);
        }

        if (store?.actionFlag === "ROLE_DELETED") {
            setSelectedRole("");
            handleRoleLists();
        }

        if (store?.actionFlag === "ROLE_CREATED") {
            if (store?.roleItem?._id) {
                setSelectedRole(store.roleItem._id);
            }

            setNameRoleTitle("");
            ShownAddRoleData();
            handleRoleLists();
        }

        const actionEvent = ["ROLE_UPDATED", "ROLE_DELETED"];
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
    }, [handleRoleLists, permissions, store.roleItems, store.roleItem, store.actionFlag, store.success, store.error, loadFirst, dispatch])

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const handleInputChange = (event) => {
        let value = event.target.value;
        if (value.trim() !== '') {
            setNameRoleTitle(value);
        } else {
            setNameRoleTitle("");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!selectedRole) {
                inputRef.current.blur();
                addUser();
            }
        }
    };

    const ShownDefenceChild = () => {
        setIsShownDefenceChild((current) => !current);
    };

    const ShownDiscoveryChild = () => {
        setIsShownDiscoveryChild((current) => !current);
    };

    const ShownAdminChild = () => {
        setIsShownAdminChild((current) => !current);
    };

    const ShownGovernanceChild = () => {
        setIsShownGovernanceChild((current) => !current);
    };

    const ShownToolsChild = () => {
        setIsShownToolsChild((current) => !current);
    };

    const handleChange = (e, name, value) => {
        setRolePermission({
            ...rolePermission, [name]: {
                ...rolePermission[name],
                [value]: !rolePermission[name][value]
            }
        });
    }

    const handleSelectAllPermissions = () => {
        if (allPermissionsSelected) {
            setRolePermission(permissions);
        } else {
            setRolePermission({
                admin: {
                    userManagement: true,
                    roleManagement: true,
                    companyManagement: true
                },
                defence: {
                    incident: true,
                    ransombloc: true
                },
                discovery: {
                    pentest: true,
                    inventory: true
                },
                governance: {
                    ram: true,
                    cb: true,
                    csc: true,
                    cc: true,
                    all_task: true
                },
                tools: {
                    cve_tool: true,
                    threatsource: true,
                    cl_tool: true,
                    Zeek: true
                }
                // add more permissions here as needed
            });
        }

        setAllPermissionsSelected(!allPermissionsSelected);
    }

    const ShownAddRoleData = (event) => {
        setIsShownAddRoleData((current) => !current);
        setRolePermission(permissions)
        setAllPermissionsSelected(false);
        if (isShownAddRoleData) {
            setNameRoleTitle("");
        }

        if (store?.roleItems?.length > 0) {
            if (isShownAddRoleData) {
                setRolePermission(store.roleItems[0].permission)
            }
        }
    };

    const handleChangeRole = (id = "") => {
        setSelectedRole(id);
        if (store?.roleItems?.length) {
            const roleItem = store.roleItems.find((x) => x._id === id);
            if (roleItem?._id) {
                const permision = roleItem?.permission || permissions
                setRolePermission({ ...permision });
            }
        } else {
            setRolePermission(permissions)
        }
    }

    const addUser = async () => {
        if (nameRoleTitle === "") {
            setshowSnackbar(true);
            setSnackMessage("Role name is empty.");
        } else {
            if (store?.roleItems?.some((ele) =>
                ele?.name?.toString() === nameRoleTitle?.toString()
            )) {
                setshowSnackbar(true);
                setSnackMessage("Role already present.");
            } else {
                dispatch(createRole({
                    name: nameRoleTitle,
                    permission: rolePermission,
                    is_active: 1
                }));
            }
        }
    }

    const handleUpdateRole = (id = "") => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(updateRole({
                    _id: id,
                    permission: rolePermission,
                }));
            }
        })
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
        <div className="content role-management">
            <div className='container-fluid'>
                <ReactSnackBar Icon={(
                    <span><TiMessages size={25} /></span>
                )} Show={showSnackBar}>
                    {snackMessage}
                </ReactSnackBar>

                <Row>
                    <Col className="col-md-12 col-xxl-10 ml-auto mr-auto">
                        <Card className="card-category card-subcategories m-0">
                            <div className="p-0 card-header">
                                <h3 className="card-title border-bottom pb-2 mb-0 mt-0">Access Matrix</h3>
                            </div>

                            <CardBody className='m-0 p-0'>
                                <div className="text-primary">
                                    <Form className='form-border border-0 m-0 pl-0 pr-0 pb-0'>
                                        {isShownAddRoleData && (
                                            <div className="row m-0 align-items-center border-bottom pb-3 role-content">
                                                <Label htmlFor="Role:" className='role-label'>Role Name </Label>
                                                <div className="col-sm-4 p-0">
                                                    <input
                                                        type="text"
                                                        ref={inputRef}
                                                        aria-label="Search"
                                                        value={nameRoleTitle}
                                                        className="form-control"
                                                        placeholder="Add Role Name"
                                                        onKeyPress={handleKeyPress}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <Loader
                                            loaded={store?.loading}
                                            lines={13}
                                            length={10}
                                            width={5}
                                            radius={30}
                                            corners={1}
                                            rotate={0}
                                            direction={1}
                                            color="#2774f6"
                                            speed={1}
                                            trail={60}
                                            shadow={false}
                                            hwaccel={false}
                                            className="spinner"
                                            zIndex={2e9}
                                            top="40%"
                                            left="50%"
                                            scale={1.0}
                                            loadedClassName="loadedContent"
                                        />

                                        {!isShownAddRoleData && (
                                            <div className="row m-0 align-role align-items-center border-bottom role-content pb-3">
                                                <Label htmlFor="Role:" className='role-label'>Role </Label>
                                                <div className="col-sm-5 p-0">
                                                    <select
                                                        id="formGridState"
                                                        className="form-select"
                                                        value={selectedRole}
                                                        onChange={(event) => { handleChangeRole(event.target.value) }}
                                                    >
                                                        {store?.roleItems?.map((role) => (
                                                            <option
                                                                value={role?._id}
                                                                key={role?._id}
                                                            >
                                                                {role.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={ShownAddRoleData}
                                                    className="btn btn-primary"
                                                >
                                                    Add Role
                                                </button>
                                            </div>
                                        )}

                                        <PermissionView
                                            isShownAddRoleData={isShownAddRoleData}
                                            allPermissionsSelected={allPermissionsSelected}
                                            handleSelectAllPermissions={handleSelectAllPermissions}
                                            ShownDefenceChild={ShownDefenceChild}
                                            isShownDefenceChild={isShownDefenceChild}
                                            ShownDiscoveryChild={ShownDiscoveryChild}
                                            isShownDiscoverychild={isShownDiscoverychild}
                                            ShownAdminChild={ShownAdminChild}
                                            isShownAdminChild={isShownAdminChild}
                                            ShownGovernanceChild={ShownGovernanceChild}
                                            isShownGovernanceChild={isShownGovernanceChild}
                                            ShownToolsChild={ShownToolsChild}
                                            IsShownToolsChild={IsShownToolsChild}
                                            handleChange={handleChange}
                                            roleItems={store?.roleItems}
                                            rolePermission={rolePermission}
                                        />

                                        <div className="row m-0 align-items-sm-center buttons">
                                            {isShownAddRoleData ? (
                                                <span>
                                                    <button
                                                        type="button"
                                                        onClick={ShownAddRoleData}
                                                        className="btn btn-primary"
                                                    >
                                                        Cancel
                                                    </button>
                                                </span>
                                            ) : null}

                                            {!isShownAddRoleData && (
                                                <span>
                                                    <button
                                                        type="button"
                                                        disabled={!selectedRole}
                                                        onClick={() => handleDeleteRole(selectedRole)}
                                                        className="float-end btn btn-primary"
                                                    >
                                                        Delete
                                                    </button>
                                                </span>
                                            )}

                                            {!isShownAddRoleData && (
                                                <span>
                                                    <button
                                                        type="button"
                                                        disabled={!selectedRole}
                                                        onClick={() => handleUpdateRole(selectedRole)}
                                                        className="btn btn-primary"
                                                    >
                                                        Update
                                                    </button>
                                                </span>
                                            )}

                                            {isShownAddRoleData && (
                                                <span>
                                                    <button
                                                        type="button"
                                                        onClick={addUser}
                                                        className="btn btn-primary"
                                                    >
                                                        Save
                                                    </button>
                                                </span>
                                            )}
                                        </div>
                                    </Form>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default RoleManagement;
