// ** React Imports
import React, { Fragment, useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { /* deleteCronScheduler, */ getCronSchedulerList, cleanCronSchedulerMessage } from "./store";

// ** Reactstrap Imports
import { Col, Row, Card, CardBody, InputGroup } from "reactstrap";

// ** Utils
import { getModulePermissionData } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";
import DatatablePagination from "components/DatatablePagination";

// ** Third Party Components
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import {
  defaultPerPageRow,
  cronSchedulerPermissionId,
  settingGroupPermissionId,
} from "utility/reduxConstant";

// ** SVG Icons
import { BiSearch } from "components/SVGIcons";

// ** PNG Icons
import editIcon from "assets/img/edit.svg";
import alertIcon from "assets/img/alert.svg";

// import deleteIcon from "assets/img/delete.png";

const CronSchedulerList = () => {
  // ** Hooks
  const navigate = useNavigate();
  // const mySwal = withReactContent(Swal);

  // ** Store vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.cronScheduler);
  const loginStore = useSelector((state) => state.login);

  // ** Const
  const permission = getModulePermissionData(loginStore?.authRolePermission, cronSchedulerPermissionId, settingGroupPermissionId)

  /* Pagination */
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
  const [searchInput, setSearchInput] = useState("");

  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  const handleCronSchedulerLists = useCallback((sorting = sort, sortCol = sortColumn, page = currentPage, perPage = rowsPerPage, search = searchInput) => {
    dispatch(getCronSchedulerList({
      sort: sorting,
      sortColumn: sortCol,
      page,
      limit: perPage,
      search: search
    }))
  }, [sort, sortColumn, currentPage, rowsPerPage, searchInput, dispatch])

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    handleCronSchedulerLists(sortDirection, column.sortField, currentPage);
  }

  const handlePagination = (page) => {
    setCurrentPage(page + 1);
    handleCronSchedulerLists(sort, sortColumn, page + 1);
  }

  const onSearchKey = (value) => {
    setSearchInput(value);
    handleCronSchedulerLists(sort, sortColumn, currentPage, rowsPerPage, value);
  }

  const handlePerPage = (value) => {
    setRowsPerPage(value);
    handleCronSchedulerLists(sort, sortColumn, currentPage, value, searchInput);
  }

  useLayoutEffect(() => {
    handleCronSchedulerLists();
  }, [handleCronSchedulerLists])

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanCronSchedulerMessage());
    }

    if (store.actionFlag === "CRN_SCH_CRET" || store.actionFlag === "CRN_SCH_UPDT") {
      handleCronSchedulerLists();
    }

    if (store.actionFlag === "CRN_SCH_DLT") {
      handleCronSchedulerLists();
    }

    if (store.success) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
    }

    if (store.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [store.error, store.success, store.actionFlag, handleCronSchedulerLists, dispatch])


  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
      setSnakbarMessage("");
    }, 6000);
  }, [showSnackBar])

  const handleGetCronErrorHint = (id = "") => {
    if (id && store?.cronSchedulerErrorItems?.length) {
      const cronErrorItm = store.cronSchedulerErrorItems.find((x) => (x.cron_scheduler_id?._id || x.cron_scheduler_id) === id)

      return cronErrorItm?._id || null
    }

    return null
  }

  // const handleDelete = (id = "") => {
  //   mySwal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       dispatch(deleteCronScheduler(id))
  //     }
  //   })
  // }

  const columns = [
    {
      name: "Name",
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
      name: "Type",
      sortField: "type",
      sortable: true,
      selector: (row) => row?.type || ""
    },
    {
      name: "Cron Style",
      sortField: "cron_style",
      sortable: true,
      selector: (row) => row?.cron_style || ""
    },
    {
      name: "Status",
      sortField: "cron_style",
      sortable: true,
      selector: (row) => (
        <div className="badge">
          {row?.status ? (
            <span className="active">Enabled</span>
          ) : (
            <span className="inactive">Disabled</span>
          )}
        </div>
      )
    },
    {
      name: "Action",
      center: true,
      cell: (row) => (
        <Fragment>
          {permission?.update ? (
            <img
              height={22}
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
              className="cursor-pointer mr-2"
              onClick={() => handleDelete(row?._id)}
            />
          ) : null} */}

          {handleGetCronErrorHint(row?._id) ? (
            <img
              alt=""
              height={20}
              src={alertIcon}
              className="cursor-pointer mr-2"
              title="Cron Error Alert"
              id={`tooltip-cron-error-${row?._id}`}
              onClick={() => navigate(`alert-detail/${row?._id || ""}`)}
            />
          ) : null}
        </Fragment>
      )
    }
  ]

  return (
    <div className="content data-list">
      <div className="container-fluid">
        {!store?.loading ? <SimpleSpinner /> : null}

        <ReactSnackBar Icon={(
          <span><TiMessages size={25} /></span>
        )} Show={showSnackBar}>
          {snakebarMessage}
        </ReactSnackBar>

        <Row>
          <Col className="col-md-12 col-xxl-10 mx-auto">
            <Card className="card-content p-0">
              {/* <div className="d-flex justify-content-between p-0 border-bottom card-header">
                        <h3 className="card-title">Cron Schedulers</h3>
                    </div> */}

              <CardBody>
                <Row className="top-content">
                  <Col sm="6">
                    <InputGroup>
                      <input
                        type="search"
                        aria-label="Search"
                        placeholder="Search"
                        value={searchInput}
                        className="col-input w-100"
                        onChange={(event) => onSearchKey(event?.target?.value)}
                      />
                      <span className="edit2-icons position-absolute">
                        <BiSearch />
                      </span>
                    </InputGroup>
                  </Col>

                  <Col sm="6" className="text-right">
                    {/* <div className="buttons d-none">
                      {permission?.create ? (
                        <button
                          type="button"
                          className="btnprimary"
                          onClick={() => navigate(`add`)}
                        >
                          Add Cron Scheduler
                        </button>
                      ) : null}
                    </div> */}
                  </Col>
                </Row>

                <Row className="userManagement mt-3 cron-table ">
                  <Col md="12">
                    <DatatablePagination
                      data={store.cronSchedulerItems}
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
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CronSchedulerList;
