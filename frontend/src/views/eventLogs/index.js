// ** React Imports
import React, { Fragment, useCallback, useEffect, useLayoutEffect, useState } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getEventLogList, cleanEventLogMessage } from './store';

import {
    Col,
    Row,
    Card,
    CardBody,
    InputGroup
} from 'reactstrap';

// ** Utils
import { getFormatDate, getModulePermissionData } from 'utility/Utils';

// ** Custom Components
import DatatablePagination from 'components/DatatablePagination';
import SimpleSpinner from 'components/spinner/simple-spinner';

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiEye, TiMessages } from "react-icons/ti";

// ** Constant
import { defaultPerPageRow, masterGroupPermissionId, eventLogPermissionId } from "utility/reduxConstant";

// ** SVG Icons
import { BiSearch } from 'components/SVGIcons';

import EventLogDetailModal from './modals/EventLogDetailModal';

const EventLogList = () => {
    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.eventLogs);
    const loginStore = useSelector((state) => state.login);

    // ** Const
    const permission = getModulePermissionData(loginStore?.authRolePermission, eventLogPermissionId, masterGroupPermissionId);

    // ** States
    const [showSnackBar, setshowSnackbar] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [eventLogDetailItem, setEventLogDetailItem] = useState(null);

    /* Pagination */
    const [sort, setSort] = useState("desc");
    const [sortColumn, setSortColumn] = useState("_id");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
    const [searchInput, setSearchInput] = useState("");

    const openDetailModal = (item = null) => {
        setEventLogDetailItem(item);
        setDetailModalOpen(true);
    }

    const closeDetailModal = () => {
        setDetailModalOpen(false);
        setEventLogDetailItem(null);
    }

    const handleEventLogLists = useCallback((sorting = sort,
        sortCol = sortColumn, page = currentPage, perPage = rowsPerPage, search = searchInput) => {
        dispatch(getEventLogList({
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
        handleEventLogLists(sortDirection, column.sortField, currentPage, rowsPerPage, searchInput)
    }

    const handlePagination = (page) => {
        setCurrentPage(page + 1);
        handleEventLogLists(sort, sortColumn, page + 1, rowsPerPage, searchInput)
    }

    const handlePerPage = (value) => {
        setRowsPerPage(value);
        handleEventLogLists(sort, sortColumn, currentPage, value, searchInput)
    }

    const onSearchKey = (value) => {
        setSearchInput(value);
        handleEventLogLists(sort, sortColumn, currentPage, rowsPerPage, value)
    }

    useLayoutEffect(() => {
        handleEventLogLists();
    }, [handleEventLogLists, dispatch])

    useEffect(() => {
        if (store?.actionFlag || store?.success || store?.error) {
            dispatch(cleanEventLogMessage());
        }

        if (store?.success) {
            setshowSnackbar(true);
            setSnackMessage(store.success);
        }

        if (store?.error) {
            setshowSnackbar(true);
            setSnackMessage(store.error);
        }
    }, [store.actionFlag, store.success, store.error, dispatch])

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const handleEventLogView = (item = null) => {
        openDetailModal(item);
    }

    const columns = [
        {
            name: 'Date',
            sortField: "updatedAt",
            sortable: true,
            selector: (row) => (
                row?.updatedAt ? (getFormatDate(row.updatedAt, "DD-MMM-YYYY HH:mm:ss")) : null
            )
        },
        {
            name: 'Type',
            sortField: "type",
            sortable: true,
            selector: (row) => (row?.type || "")
        },
        {
            name: 'Event',
            sortField: "action",
            sortable: true,
            selector: (row) => (row?.action || "")
        },
        {
            name: 'Description',
            sortField: "description",
            sortable: true,
            selector: (row) => (
                <p className="text-wrap">
                    {row?.description || ""}
                </p>
            )
        },
        {
            name: 'Action',
            center: true,
            cell: (row) => (
                <Fragment>
                    {permission?.read ? (
                        <TiEye
                            size={20}
                            color="#fff"
                            title="View"
                            cursor="pointer"
                            className="mr-1"
                            onClick={() => handleEventLogView(row)}
                        />
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
                            <h3 className="card-title">Event Logs</h3>
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

                                <Col sm="6" className='text-right' />
                            </Row>

                            <Row className="eventLogManagement mt-3">
                                <Col className="pb-2" md="12">
                                    <DatatablePagination
                                        data={store.eventLogItems}
                                        columns={columns}
                                        rowsPerPage={rowsPerPage}
                                        pagination={store?.pagination}
                                        handleSort={handleSort}
                                        handleRowPerPage={handlePerPage}
                                        handlePagination={handlePagination}
                                    />
                                </Col>
                            </Row>

                            <EventLogDetailModal
                                open={detailModalOpen}
                                closeModal={closeDetailModal}
                                eventLogDetailItem={eventLogDetailItem}
                            />
                        </CardBody>
                    </Card>
                </Row>
            </div>
        </div>
    )
}

export default EventLogList;
