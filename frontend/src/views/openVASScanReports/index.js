// ** React Imports
import { Fragment, useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { getOpenVASScanReportList, deleteOpenVASScanReport, cleanOpenVASScanReportMessage } from "./store";

// ** Reactstrap Imports
import { Col, Row, Card, CardBody, InputGroup, UncontrolledTooltip } from "reactstrap";

// ** Utils
import { getModulePermissionData } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";
import DatatablePagination from "components/DatatablePagination";

// ** Third Party Components
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReactSnackBar from "react-js-snackbar";
import { TiEdit, TiTrash, TiMessages } from "react-icons/ti";

// ** Constant
import {
  defaultPerPageRow,
  settingGroupPermissionId,
  openVasScanReportPermissionId
} from "utility/reduxConstant";

// ** SVG Icons
import { BiSearch } from "components/SVGIcons";

// ** Modals
import ModalImportCSV from "./model/ModalImportCSV";

const OpenVASScanReportLists = () => {
  // ** Hooks
  const navigate = useNavigate();
  const mySwal = withReactContent(Swal);

  const dispatch = useDispatch();
  const store = useSelector((state) => state.openVASScanReport);

  const loginStore = useSelector((state) => state.login);

  // ** Const
  const permission = getModulePermissionData(loginStore?.authRolePermission, openVasScanReportPermissionId, settingGroupPermissionId)

  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
  const [searchInput, setSearchInput] = useState("");

  const [showSnackBar, setShowSnackbar] = useState(false)
  const [snakebarMessage, setSnakbarMessage] = useState("")

  const [openModel, setOpenModel] = useState(false);

  const handleOpenVASScanReportLists = useCallback((sorting = sort, sortCol = sortColumn, page = currentPage, perPage = rowsPerPage, search = searchInput) => {
    dispatch(getOpenVASScanReportList({
      sort: sorting,
      sortColumn: sortCol,
      page,
      limit: perPage,
      search: search,
    }))
  }, [sort, sortColumn, currentPage, rowsPerPage, searchInput, dispatch])

  const onSearchKey = (value) => {
    setSearchInput(value);
    handleOpenVASScanReportLists(sort, sortColumn, currentPage, rowsPerPage, value);
  }

  const handlePagination = (page) => {
    setCurrentPage(page + 1);
    handleOpenVASScanReportLists(sort, sortColumn, page + 1, rowsPerPage, searchInput);
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    handleOpenVASScanReportLists(
      sortDirection,
      column.sortField,
      currentPage,
      rowsPerPage,
      searchInput
    )
  }

  const handlePerPage = (value) => {
    setRowsPerPage(value);
    handleOpenVASScanReportLists(sort, sortColumn, currentPage, value, searchInput);
  }

  const closePopup = () => {
    setOpenModel(() => false);
  }

  const AddOpenVASScanReport = () => {
    setOpenModel(true);
  }

  useLayoutEffect(() => {
    handleOpenVASScanReportLists();
  }, [handleOpenVASScanReportLists, dispatch]);

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanOpenVASScanReportMessage())
    }

    if (store?.actionFlag === "OVSR_SCH_ISRT_MNLT") {
      closePopup()
      handleOpenVASScanReportLists()
    }

    if (store?.actionFlag === "OVSR_SCH_DLT") {
      handleOpenVASScanReportLists()
    }

    if (store.success) {
      setShowSnackbar(true)
      setSnakbarMessage(store.success)
    }

    if (store.error) {
      setShowSnackbar(true)
      setSnakbarMessage(store.error)
    }
  }, [handleOpenVASScanReportLists, store.actionFlag, store.success, store.error, dispatch])

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
      setSnakbarMessage('')
    }, 6000);
  }, [showSnackBar])

  const handleDelete = (id = "") => {
    mySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteOpenVASScanReport(id));
      }
    });
  }

  const columns = [
    {
      name: "ip",
      sortField: "ip",
      sortable: true,
      selector: (row) => (
        <div>{row?.ip || ""}</div>
      )
    },
    {
      name: "severity",
      sortField: "severity",
      sortable: true,
      selector: (row) => (
        <div>{row?.severity || ""}</div>
      )
    },
    {
      name: "qod",
      sortField: "qod",
      sortable: true,
      selector: (row) => (
        <div>{row?.qod || ""}%</div>
      )
    },
    {
      name: "Solution Type",
      sortField: "solution_type",
      sortable: true,
      selector: (row) => (
        <div>{row?.solution_type || ""}</div>
      )
    },
    {
      name: "Timestamp",
      sortField: "timestamp",
      sortable: true,
      selector: (row) => (
        <div>{row?.timestamp || ""}</div>
      )
    },
    {
      name: "Action",
      center: true,
      cell: (row) => (
        <Fragment>
          {permission?.update ? (<>
            <TiEdit
              size={20}
              cursor="pointer"
              id={`tooltip-edit-${row?._id}`}
              onClick={() => navigate(`/admin/openvas-scan-reports/edit/${row?._id}`)}
            />
            <UncontrolledTooltip
              placement="top"
              target={`tooltip-edit-${row?._id}`}
            >
              Edit
            </UncontrolledTooltip>
          </>) : null}

          {permission?.delete ? (<>
            <TiTrash
              size={20}
              cursor="pointer"
              id={`tooltip-delete-${row?._id}`}
              onClick={() => handleDelete(row?._id)}

            />
            <UncontrolledTooltip
              placement="top"
              target={`tooltip-delete-${row?._id}`}
            >
              Delete
            </UncontrolledTooltip>
          </>) : null}
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

      <div className="container-fluid">
        <Row className="row-row">
          <Card className="col-md-12 col-xxl-10 ml-auto mr-auto tbl-height-container">
            <div className="d-flex justify-content-between p-0 border-bottom card-header">
              <h3 className="card-title">OpenVAS Scan Reports</h3>
            </div>

            <CardBody className="pl-0 pr-0">
              <Row className="mt-2">
                <Col sm="6">
                  <InputGroup>
                    <input
                      type="search"
                      value={searchInput}
                      aria-label="Search"
                      placeholder="Search"
                      className="form-control "
                      onChange={(event) => onSearchKey(event?.target?.value)}
                    />
                    <span className="edit2-icons position-absolute">
                      <BiSearch />
                    </span>
                  </InputGroup>
                </Col>

                <Col sm="6" className="text-right">
                  {permission?.create ? (
                    <button
                      type="button"
                      className="btn btn-primary my-2"
                      onClick={() => AddOpenVASScanReport()}
                    >
                      Import CSV
                    </button>
                  ) : null}
                </Col>
              </Row>

              <Row className="userManagement mt-3">
                <Col className="pb-2" md="12">
                  <DatatablePagination
                    data={store.openVASScanReportItems}
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

      <ModalImportCSV
        show={openModel}
        closePopup={closePopup}
      />

    </div>
  )
}

export default OpenVASScanReportLists;
