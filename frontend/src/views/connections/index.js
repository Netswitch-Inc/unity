// ** React Imports
import React, { useState, useCallback, useEffect, useLayoutEffect, Fragment } from 'react';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import {
    getConnectionList,
    editConnectionRequest,
    cleanConnectionMessage,
    // deleteConnection
} from './store';

// ** Reactstrap Imports
import {
    Col,
    Row,
    Card,
    CardBody,
    InputGroup
} from 'reactstrap';
import SimpleSpinner from 'components/spinner/simple-spinner';

// ** Utils
import { getModulePermissionData } from "utility/Utils";

// ** Custom Components
import DatatablePagination from 'components/DatatablePagination';

// ** Third Party Components
// import Swal from 'sweetalert2';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages, TiEdit /*, TiTrash */ } from "react-icons/ti";

// ** Constant
import {
    defaultPerPageRow,
    connectionPermissionId,
    settingGroupPermissionId
} from 'utility/reduxConstant';

// ** SVG Icons
import { BiSearch } from 'components/SVGIcons';

import ConnectionProfileForm from './model/AddEditConnection';

const ConnectionList = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state.connection);
    const loginStore = useSelector((state) => state.login);

    // ** Const
    const permission = getModulePermissionData(loginStore?.authRolePermission, connectionPermissionId, settingGroupPermissionId);

    const [openModel, setOpenModel] = useState(false);
    const [title, setTitle] = useState('Add Connection');
    const [loadFirst, setLoadFirst] = useState(true);

    /* Pagination */
    const [sort, setSort] = useState("desc");
    const [sortColumn, setSortColumn] = useState("_id");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
    const [isEdited, setIsEdited] = useState(false)
    const [searchInput, setSearchInput] = useState("");

    const [showSnackBar, setshowSnackbar] = useState(false)
    const [snakebarMessage, setSnakbarMessage] = useState("")

    const handleConnectionLists = useCallback((sorting = sort,
        sortCol = sortColumn, page = currentPage, perPage = rowsPerPage, search = searchInput) => {
        dispatch(getConnectionList({
            sort: sorting,
            sortColumn: sortCol,
            page,
            limit: perPage,
            search: search,
        }));
    }, [sort, sortColumn, currentPage, rowsPerPage, searchInput, dispatch])

    const handleSort = (column, sortDirection) => {
        setSort(sortDirection);
        setSortColumn(column.sortField);
        handleConnectionLists(sortDirection, column.sortField, currentPage)
    }

    const handlePagination = (page) => {
        setCurrentPage(page + 1);
        handleConnectionLists(sort, sortColumn, page + 1)
    }

    const onSearchKey = (value) => {
        setSearchInput(value);
        handleConnectionLists(sort, sortColumn, currentPage, rowsPerPage, value)
    }

    const handlePerPage = (value) => {
        setRowsPerPage(value);
        handleConnectionLists(sort, sortColumn, currentPage, value, searchInput)
    }

    useLayoutEffect(() => {
        if (loadFirst) {
            handleConnectionLists();
            setLoadFirst(false)
        }
    }, [handleConnectionLists, loadFirst, dispatch])

    useEffect(() => {
        if (store.actionFlag === "CONNECTION_CREATED" || store.actionFlag === "Connection_UPDATED") {
            handleConnectionLists()
        }

        if (store.actionFlag || store.success || store.error) {
            dispatch(cleanConnectionMessage());
        }

        if (store.success) {
            setshowSnackbar(true)
            setSnakbarMessage(store.success)
        }

        if (store.error) {
            setshowSnackbar(true)
            setSnakbarMessage(store.error)
        }
    }, [handleConnectionLists, store.error, store.success, store.actionFlag, dispatch])

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
            setSnakbarMessage('')
        }, 6000);
    }, [showSnackBar])

    // const AddConnection = () => {
    //     setIsEdited(() => false)
    //     setOpenModel(true);
    //     setTitle('Add Connection');
    // }

    const EditConnection = (id) => {
        const query = { id: id }
        setIsEdited(() => true)
        dispatch(editConnectionRequest(query));
        setOpenModel(true);
        setTitle('Edit Connection');
    }

    // const deleteProfile = async (id) => {
    //     const result = await Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!'
    //     });

    //     if (result.isConfirmed) {
    //         try {
    //             // Perform delete action here, e.g., call an API to delete the user
    //             await dispatch(deleteConnection(id));
    //             Swal.fire(
    //                 'Deleted!',
    //                 'Your user has been deleted.',
    //                 'success'
    //             );
    //             // Refresh user list or update UI as needed
    //             setLoadFirst(true)
    //         } catch (error) {
    //             Swal.fire(
    //                 'Error!',
    //                 'There was an error deleting the user.',
    //                 'error'
    //             );
    //         }
    //     }
    // };

    const closePopup = () => {
        setOpenModel(() => false);
    };

    const columns = [
        {
            name: 'Name',
            sortField: "name",
            sortable: true,
            selector: (row) => (row?.name || "")
        },
        {
            name: 'Username',
            sortField: "username",
            sortable: true,
            selector: (row) => (row?.username || "")
        },
        {
            name: 'IP Address/Url',
            sortField: "ip_address",
            sortable: true,
            selector: (row) => (row?.ip_address || "")
        },
        {
            name: 'Port',
            sortField: "port",
            sortable: true,
            selector: (row) => (row?.port || "")
        },
        {
            name: 'Action',
            center: true,
            cell: (row) => (
                <Fragment>
                    {permission?.update ? (
                        <TiEdit
                            size={20}
                            color="#fff"
                            cursor="pointer"
                            className="mr-1"
                            onClick={() => EditConnection(row?._id)}
                        />
                    ) : null}

                    {/* {!row?.is_default && permission?.delete ? (
                        <TiTrash
                            size={20}
                            color="#fff"
                            cursor="pointer"
                            className="d-none"
                            onClick={() => deleteProfile(row?._id)}
                        />
                    ) : null} */}
                </Fragment>
            )
        }
    ]

    return (
        <div className="content data-list">
            {!store?.loading ? <SimpleSpinner /> : null}
            {showSnackBar && (
                <ReactSnackBar
                    Icon={(<span><TiMessages size={25} /></span>)}
                    Show={showSnackBar}
                >
                    {snakebarMessage}
                </ReactSnackBar>
            )}

            <Row>
                <Card className="col-md-12 col-xxl-10 ml-auto mr-auto tbl-height-container">
                    <div className="d-flex justify-content-between p-0 border-bottom card-header">
                        <h3 className="card-title">Connections</h3>
                    </div>

                    <CardBody>
                        <Row className="mt-2">
                            <Col xs="6">
                                <InputGroup>
                                    <input className="form-control " type="search" placeholder="Search" aria-label="Search" value={searchInput} onChange={(e) => onSearchKey(e.target.value)} />
                                    <span className="edit2-icons position-absolute">
                                        <BiSearch />
                                    </span>
                                </InputGroup>
                            </Col>

                            <Col xs="6" className='text-right'>
                                {/* {permission?.create ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary d-none"
                                        onClick={() => AddConnection()}
                                    >
                                        Add Connection
                                    </button>
                                ) : null} */}
                            </Col>
                        </Row>

                        <Row className="userManagement mt-3">
                            <Col className="pb-2" md="12">
                                <DatatablePagination
                                    data={store.ConnectionItems}
                                    columns={columns}
                                    pagination={store?.pagination}
                                    handleSort={handleSort}
                                    handlePagination={handlePagination}
                                    handleRowPerPage={handlePerPage}
                                    rowsPerPage={rowsPerPage}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Row>

            {openModel && (<ConnectionProfileForm show={openModel} closePopup={closePopup} title={title} initialValues={isEdited ? store.ConnectionItem : store.addConnectionItem} />)}
        </div>
    )
}

export default ConnectionList;
