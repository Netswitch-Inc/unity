// ** React Imports
import React, { useState, useCallback, useEffect, useLayoutEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { /* deleteConnection, */ getConnectionList, cleanConnectionMessage } from './store';

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
// import withReactContent from 'sweetalert2-react-content';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import {
    defaultPerPageRow,
    connectionPermissionId,
    settingGroupPermissionId
} from 'utility/reduxConstant';

// ** SVG Icons
import { BiSearch } from 'components/SVGIcons';

// ** PNG Icons
import editIcon from "assets/img/edit.svg";
// import deleteIcon from "assets/img/delete.png";

const ConnectionList = () => {
    // ** Hooks
    const navigate = useNavigate();
    // const mySwal = withReactContent(Swal);

    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.connection);
    const loginStore = useSelector((state) => state.login);

    // ** Const
    const permission = getModulePermissionData(loginStore?.authRolePermission, connectionPermissionId, settingGroupPermissionId);

    /* Pagination */
    const [sort, setSort] = useState("desc");
    const [sortColumn, setSortColumn] = useState("_id");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
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
        handleConnectionLists()
    }, [handleConnectionLists])

    useEffect(() => {
        if (store.actionFlag === "CONN_CRET" || store.actionFlag === "CONN_UPDT" || store.actionFlag === "CONN_DLT") {
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

    // const deleteProfile = async (id) => {
    //         mySwal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             dispatch(deleteConnection(id));
    //         }
    //     });
    // }

    const columns = [
        {
            name: 'Name',
            sortField: "name",
            sortable: true,
            selector: (row) => (
                <div
                className="cursor-pointer"
                onClick={() => navigate(`edit/${row?._id || ""}`)}
                >
                   {row?.name || ""}
                </div>
            )
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
                    <div className="actions">
                        {permission?.update ? (
                            <img
                                alt="Edit"
                                title="Edit"
                                src={editIcon}
                                className="cursor-pointer mr-2"
                                onClick={() => navigate(`edit/${row?._id || ""}`)}
                            />
                        ) : null}

                        {/* {!row?.is_default && permission?.delete ? (
                            <img
                                alt="Delete"
                                title="Delete"
                                src={deleteIcon}
                                className="cursor-pointer"
                                onClick={() => deleteProfile(row?._id)}
                            />
                        ) : null} */}
                    </div>
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
                    {/* <div className="d-flex justify-content-between p-0 border-bottom card-header">
                        <h3 className="card-title">Connections</h3>
                    </div> */}

                    <CardBody>
                        <Row className="top-content">
                            <Col xs="6">
                                <InputGroup>
                                    <input className="col-input w-100" type="search" placeholder="Search" aria-label="Search" value={searchInput} onChange={(e) => onSearchKey(e.target.value)} />
                                    <span className="edit2-icons position-absolute">
                                        <BiSearch />
                                    </span>
                                </InputGroup>
                            </Col>

                            <Col xs="6" className='text-right'>
                                {/* <div className="buttons d-none">
                                    {permission?.create ? (
                                        <button
                                            type="button"
                                            className="btnprimary"
                                            onClick={() => navigate(`add`)}
                                        >
                                            Add Connection
                                        </button>
                                    ) : null}
                                </div> */}
                            </Col>
                        </Row>

                        <Row className="userManagement mt-3 connection-table">
                            <Col className="pb-2" md="12">
                                <DatatablePagination
                                    data={store.connectionItems}
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

        </div>
    )
}

export default ConnectionList;
