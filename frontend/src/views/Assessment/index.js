// ** React Imports
import { useState, Fragment, useEffect, useCallback, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { getAssessmentList, deleteAssessment, cleanAssessmentMessage } from "./store";

// ** Reactstrap Imports
import { Col, Row, Card, CardBody, InputGroup } from "reactstrap";

// ** Utils
import { getModulePermissionData } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";
import DatatablePagination from "components/DatatablePagination";

// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import {
  defaultPerPageRow,
  discoveryGroupPermissionId,
  assessmentFormsPermissionId,
} from "utility/reduxConstant";

// ** SVG Icons
import { BiSearch } from "components/SVGIcons";
import editIcon from "assets/img/edit.svg";
import viewIcon from "assets/img/view.svg";
import deleteIcon from "assets/img/delete.svg";
import arrowForwardIcon from "assets/img/arrow-forward.svg";

const AssessmentList = () => {
  // ** Hooks
  const navigate = useNavigate();
  const mySwal = withReactContent(Swal);

  // ** Store vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.assessment);
  const loginStore = useSelector((state) => state.login);

  // ** States
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  // ** Pagination
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
  const [searchInput, setSearchInput] = useState("");

  // ** Const
  const permission = getModulePermissionData(loginStore?.authRolePermission, assessmentFormsPermissionId, discoveryGroupPermissionId);

  const handleAssesmentLists = useCallback((sorting = sort, sortCol = sortColumn, page = currentPage, perPage = rowsPerPage, search = searchInput) => {
    dispatch(getAssessmentList({
      sort: sorting,
      sortColumn: sortCol,
      page,
      limit: perPage,
      search: search
    }))
  }, [sort, sortColumn, currentPage, rowsPerPage, searchInput, dispatch])

  useLayoutEffect(() => {
    handleAssesmentLists()
  }, [handleAssesmentLists])

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanAssessmentMessage(null));
    }

    if (store?.actionFlag === "ASESMNT_DLT_SCS") {
      handleAssesmentLists();
    }

    if (store?.success) {
      setShowSnackbar(true);
      setSnackMessage(store.success);
    }

    if (store?.error) {
      setShowSnackbar(true);
      setSnackMessage(store.error);
    }
  }, [handleAssesmentLists, store?.actionFlag, store.success, store.error, dispatch])

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const handleDeleteAssessment = async (id) => {
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
        dispatch(deleteAssessment(id));
      }
    })
  }

  const onSearchKey = (value) => {
    setSearchInput(value);
    handleAssesmentLists(sort, sortColumn, currentPage, rowsPerPage, value);
  }

  const handlePagination = (page) => {
    setCurrentPage(page + 1);
    handleAssesmentLists(sort, sortColumn, page + 1, rowsPerPage, searchInput);
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    handleAssesmentLists(sortDirection, column.sortField, currentPage, rowsPerPage, searchInput)
  }

  const handlePerPage = (value) => {
    setRowsPerPage(value);
    handleAssesmentLists(sort, sortColumn, currentPage, value, searchInput);
  }

  const columns = [
    {
      name: "Name",
      sortField: "name",
      sortable: true,
      cell: (row) => (
        <div
          className="text-break cursor-pointer"
          onClick={() => {
            if (permission?.update) {
              navigate(`/admin/assessment-forms/edit/${row?._id}`);
            }
          }}
        >
          {row?.name || ""}
        </div>
      )
    },
    {
      name: "Status",
      center: true,
      selector: (row) => (
        <div className="badge">
          {row?.status ? (<span className="active">Active</span>) : <span className="inactive">InActive</span>}
        </div>
      )
    },
    {
      name: "Action",
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
                onClick={() => navigate(`/admin/assessment-forms/edit/${row?._id}`)}
              />
            ) : null}

            {permission?.delete ? (
              <img
                alt="Delete"
                title="Delete"
                src={deleteIcon}
                className="cursor-pointer mr-2"
                onClick={() => handleDeleteAssessment(row?._id)}
              />
            ) : null}

            {permission?.update ? (
              <img
                alt="Preview"
                title="Preview"
                src={viewIcon}
                className="cursor-pointer mr-2"
                onClick={() => navigate(`/admin/assessment-forms/detail/${row?._id}`)}
              />
            ) : null}

            <img
              alt="Arrow Forward"
              src={arrowForwardIcon}
              title="Assessment Submissions"
              className="cursor-pointer"
              onClick={() => navigate(`/admin/assessment-reports/${row?._id}`, {
                state: { name: row?.name }
              })}
            />
          </div>
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
          {snackMessage}
        </ReactSnackBar>

        <Row>
          <Col className="col-md-12 col-xxl-10 mx-auto">
            <Card className="card-content p-0">
              {/* <div className="d-flex justify-content-between p-0 border-bottom card-header">
                <h3 className="card-title">Assesment Forms</h3>
              </div> */}

              <CardBody>
                <Row className="top-content">
                  <Col sm="6">
                    <InputGroup>
                      <input
                        className="col-input w-100"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchInput}
                        onChange={(event) => onSearchKey(event?.target?.value)}
                      />
                      <span className="edit2-icons position-absolute">
                        <BiSearch />
                      </span>
                    </InputGroup>
                  </Col>

                  <Col sm="6" className="text-right">
                    <div className="buttons">
                      {permission?.create ? (
                        <button
                          type="button"
                          className="btnprimary"
                          onClick={() => navigate("/admin/assessment-forms/add")}
                        >
                          Add Assessment Form
                        </button>
                      ) : null}
                    </div>
                  </Col>
                </Row>

                <Row className=" mt-3 assesment-table">
                  <Col className="pb-2" md="12">
                    <DatatablePagination
                      data={store.assessmentItems}
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

export default AssessmentList;
