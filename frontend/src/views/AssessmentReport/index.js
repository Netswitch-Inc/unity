// ** React Imports
import React, { useState, Fragment, useCallback, useLayoutEffect, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { deleteAssessmentReport, getAssessmentReportList, cleanAssessmentReportMessage } from "views/userAssest/store";

// ** Reactstrap Imports
import { Col, Row, Card, CardBody, InputGroup } from "reactstrap";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";
import DatatablePagination from "components/DatatablePagination";

// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { defaultPerPageRow } from "utility/reduxConstant";

// ** SVG Icons
import { BiSearch } from "components/SVGIcons";

// ** PNG Icons
import viewIcon from "assets/img/view.svg";
import deleteIcon from "assets/img/delete.svg";

const AsessmentReportList = () => {
  // ** Hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mySwal = withReactContent(Swal);

  const dispatch = useDispatch();
  const store = useSelector((state) => state.assessmentReport);

  // ** States
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  // ** Pagination
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
  const [searchInput, setSearchInput] = useState("");

  const handleAssessmentReportLists = useCallback((sorting = sort, sortCol = sortColumn, page = currentPage, perPage = rowsPerPage, search = searchInput) => {
    dispatch(getAssessmentReportList({
      sort: sorting,
      sortColumn: sortCol,
      page,
      limit: perPage,
      search: search,
      asessmentId: id
    }))
  }, [sort, sortColumn, currentPage, rowsPerPage, searchInput, id, dispatch])

  const onSearchKey = (value) => {
    setSearchInput(value)
    handleAssessmentReportLists(sort, sortColumn, currentPage, rowsPerPage, value)
  }

  const handlePagination = (page) => {
    setCurrentPage(page + 1)
    handleAssessmentReportLists(sort, sortColumn, page + 1, rowsPerPage, searchInput)
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
    handleAssessmentReportLists(sortDirection, column.sortField, currentPage, rowsPerPage, searchInput)
  }

  const handlePerPage = (value) => {
    setRowsPerPage(value)
    handleAssessmentReportLists(sort, sortColumn, currentPage, value, searchInput)
  }

  useLayoutEffect(() => {
    handleAssessmentReportLists()
  }, [handleAssessmentReportLists])

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanAssessmentReportMessage(null))
    }

    if (store?.actionFlag === "ASSMT_RPRT_DLT_SCS") {
      handleAssessmentReportLists()
    }

    if (store?.success) {
      setShowSnackbar(true);
      setSnackMessage(store.success);
    }

    if (store?.error) {
      setShowSnackbar(true);
      setSnackMessage(store.error);
    }
  }, [handleAssessmentReportLists, store.actionFlag, store.success, store.error, dispatch])

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const handleDelete = async (id) => {
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
        dispatch(deleteAssessmentReport(id))
      }
    })
  }

  const columns = [
    {
      name: "Company",
      sortField: "company_name",
      sortable: true,
      cell: (row) => row?.company_name,
    },
    {
      name: "email",
      sortField: "email",
      sortable: true,
      cell: (row) => row?.email,
    },
    {
      name: "business type",
      sortField: "business_type",
      sortable: true,
      cell: (row) => row?.business_type,
    },

    {
      name: "Action",
      center: true,
      cell: (row) => (
        <Fragment>
          <div className="actions">
            <img
              alt="View"
              height={22}
              src={viewIcon}
              title="View"
              cursor="pointer"
              className="cursor-pointer mr-2"
              onClick={() => navigate(`/admin/assessment-reports/detail/${row?._id}?asessmentId=${row?.assessment_id}`)}
            />

            <img
              alt="Delete"
              title="Delete"
              src={deleteIcon}
              className="cursor-pointer"
              onClick={() => handleDelete(row?._id)}
            />
          </div>
        </Fragment>
      )
    }
  ]

  return (
    <div className="content data-list">
      <div className="container-fluid">
        {!store?.loading ? (<SimpleSpinner />) : null}

        <ReactSnackBar Icon={(
          <span><TiMessages size={25} /></span>
        )} Show={showSnackBar}>
          {snackMessage}
        </ReactSnackBar>

        <Row>
          <Col className="col-md-12 col-xxl-10 mx-auto">
            <div className="p-0 role-name d-flex justify-content-between mb-3">
              <h3 className="card-title mb-0 mt-0">{location?.state?.name ? `${location?.state?.name} Submissions` : `Asessment Reports`}</h3>
              <div className="buttons black-btn">
              <button
                type="button"
                className="btnprimary"
                onClick={() => navigate("/admin/assessment-forms")}
              >
                Back
              </button>
              </div>
            </div>

            <Card className="card-content p-0">
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
                    </div>
                  </Col>
                </Row>

                <Row className="mt-3 assesment-share-table">
                  <Col md="12">
                    <DatatablePagination
                      data={store?.assessmentReportItems || []}
                      pagination={store?.pagination}
                      columns={columns}
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

export default AsessmentReportList;
