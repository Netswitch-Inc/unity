
// ** React Imports
import React, { useEffect, useLayoutEffect, useState, useCallback, Fragment } from 'react';
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getRoleList, deleteRole, cleanRoleMessage } from './store';

// ** Reactstrap Imports
import { Card, CardBody, Col, InputGroup, Row } from 'reactstrap';

// ** Utils
import { getModulePermissionData } from 'utility/Utils';

// ** Custom Components
import DatatablePagination from 'components/DatatablePagination';
import SimpleSpinner from 'components/spinner/simple-spinner';

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiEye, TiEdit, TiTrash, TiMessages } from "react-icons/ti";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// ** Constant
import {
    roleItem,
    defaultPerPageRow,
    rolesPermissionId,
    masterGroupPermissionId
} from "utility/reduxConstant";

// ** SVG Icons
import { BiSearch } from 'components/SVGIcons';

import AddNewRoleModal from './modals/AddNewRoleModal';

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
    const [sort, setSort] = useState("desc");
    const [sortColumn, setSortColumn] = useState("_id");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
    const [searchInput, setSearchInput] = useState("");

    const handleRoleLists = useCallback((sorting = sort,
        sortCol = sortColumn, page = currentPage, perPage = rowsPerPage, search = searchInput) => {
        dispatch(getRoleList({
            sort: sorting,
            sortColumn: sortCol,
            page,
            limit: perPage,
            search: search
        }));
    }, [sort, sortColumn, currentPage, rowsPerPage, searchInput, dispatch])

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection);
        setSortColumn(column.sortField);
        handleRoleLists(sortDirection, column.sortField, currentPage, rowsPerPage, searchInput)
    }

    const handlePagination = (page) => {
        setCurrentPage(page + 1);
        handleRoleLists(sort, sortColumn, page + 1, rowsPerPage, searchInput)
    }

    const handlePerPage = (value) => {
        setRowsPerPage(value);
        handleRoleLists(sort, sortColumn, currentPage, value, searchInput)
    }

    const onSearchKey = (value) => {
        setSearchInput(value);
        handleRoleLists(sort, sortColumn, currentPage, rowsPerPage, value)
    }

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

    const columns = [
        {
            name: 'Name',
            sortField: "name",
            sortable: true,
            selector: (row) => row?.name || ""
        },
        {
            name: 'Action',
            center: true,
            cell: (row) => (
                <Fragment>
                    {permission?.update ? (
                        <TiEdit title="Edit" size={20} color="#fff" cursor="pointer" className='mr-1' onClick={() => handleEditRole(row)} />
                    ) : null}

                    {permission?.update ? (
                        <TiEye title="Module Permission" size={20} color="#fff" cursor="pointer" className='mr-1' onClick={() => navigate(`permission/${row?._id}`)} />
                    ) : null}

                    {!row?.is_default && permission?.delete ? (
                        <TiTrash title="Delete" size={20} color="#fff" cursor="pointer" onClick={() => handleDeleteRole(row?._id)} />
                    ) : null}
                </Fragment>
            )
        }
    ];

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

                <Row className='row-row'>
                    <Card className="col-md-12 col-xxl-10 ml-auto mr-auto tbl-height-container">
                        <div className="d-flex justify-content-between p-0 border-bottom card-header">
                            <h3 className="card-title">Roles</h3>
                        </div>

                        <CardBody className='pl-0 pr-0'>
                            <Row className="mt-2">
                                <Col sm="6">
                                    <InputGroup>
                                        <input className="form-control " type="search" placeholder="Search" aria-label="Search" value={searchInput} onChange={(event) => onSearchKey(event?.target?.value)} />
                                        <span className="edit2-icons position-absolute">
                                            <BiSearch />
                                        </span>
                                    </InputGroup>
                                </Col>

                                <Col sm="6" className='text-right'>
                                    {permission?.create ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => setModalOpen(true)}
                                        >
                                            Add Role
                                        </button>
                                    ) : null}
                                </Col>
                            </Row>

                            <Row className="roleManagement mt-3">
                                <Col className="pb-2" md="12">
                                    <DatatablePagination
                                        data={store.roleItems}
                                        columns={columns}
                                        rowsPerPage={rowsPerPage}
                                        pagination={store?.pagination}
                                        handleSort={handleSort}
                                        handleRowPerPage={handlePerPage}
                                        handlePagination={handlePagination}
                                    />
                                </Col>
                            </Row>

                            <AddNewRoleModal
                                open={modalOpen}
                                roleItemData={roleItemData}
                                closeModal={() => setModalOpen(false)}
                                resetRoleItemData={() => setRoleItemData(roleItem)}
                            />
                        </CardBody>
                    </Card>
                </Row>
            </div>
        </div>
    )
}

export default RoleList;
