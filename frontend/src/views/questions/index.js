// ** React Imports
import { useEffect, useState, Fragment, useCallback, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { getQuestionList, deleteQuestion, cleanQuestionMessage } from "./store";

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
import editIcon from "assets/img/edit.svg";
import deleteIcon from "assets/img/delete.svg";

const QuestionsList = () => {
  // ** Hooks
  const navigate = useNavigate();
  const mySwal = withReactContent(Swal);

  // ** Store vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.questions);

  // ** Pagination
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
  const [searchInput, setSearchInput] = useState("");

  // ** States
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  const handleQuestionLists = useCallback((sorting = sort, sortCol = sortColumn, page = currentPage, perPage = rowsPerPage, search = searchInput) => {
    dispatch(getQuestionList({
      sort: sorting,
      sortColumn: sortCol,
      page,
      limit: perPage,
      search: search
    }))
  }, [sort, sortColumn, currentPage, rowsPerPage, searchInput, dispatch])

  const onSearchKey = (value) => {
    setSearchInput(value)
    handleQuestionLists(sort, sortColumn, currentPage, rowsPerPage, value)
  }

  const handlePagination = (page) => {
    setCurrentPage(page + 1)
    handleQuestionLists(sort, sortColumn, page + 1, rowsPerPage, searchInput)
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
    handleQuestionLists(sortDirection, column.sortField, currentPage, rowsPerPage, searchInput)
  }

  const handlePerPage = (value) => {
    setRowsPerPage(value)
    handleQuestionLists(sort, sortColumn, currentPage, value, searchInput)
  }

  useLayoutEffect(() => {
    handleQuestionLists()
  }, [handleQuestionLists])

  useEffect(() => {
    if (store.actionFlag || store?.success || store?.error) {
      dispatch(cleanQuestionMessage());
    }

    if (store.actionFlag === "QESTN_DLT_SCS") {
      handleQuestionLists()
    }

    if (store?.success) {
      setShowSnackbar(true);
      setSnakbarMessage(store.success);
    }

    if (store?.error) {
      setShowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [handleQuestionLists, store.success, store.error, store.actionFlag, dispatch]);

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
        dispatch(deleteQuestion(id))
      }
    })
  }

  const columns = [
    {
      name: "question",
      sortField: "question",
      sortable: true,
      cell: (row) => row?.question,
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
            <img
              alt="Edit"
              title="Edit"
              src={editIcon}
              className="cursor-pointer mr-2"
              onClick={() => navigate(`edit/${row?._id || ""}`)}
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
          {snakebarMessage}
        </ReactSnackBar>

        <Row>
          <Col className="col-md-12 col-xxl-10 mx-auto">
            <Card className="card-content p-0">
              {/* <div className="d-flex justify-content-between p-0 border-bottom card-header">
                <h3 className="card-title">Questions</h3>
              </div> */}

              <CardBody>
                <Row className="top-content">
                  <Col sm="6">
                    <InputGroup>
                      <input
                        type="search"
                        aria-label="Search"
                        value={searchInput}
                        placeholder="Search"
                        className="col-input w-100"
                        onChange={(event) => onSearchKey(event?.target?.value)}
                      />
                      <span className="edit2-icons position-absolute">
                        <BiSearch />
                      </span>
                    </InputGroup>
                  </Col>

                  <Col sm="6" className="text-right">
                    <div className="buttons">
                        <button
                          onClick={() => navigate(`add`)}
                          className="btnprimary"
                          type="button"
                        >
                          Add Question
                        </button>
                    </div>
                  </Col>
                </Row>

                <Row className="question-table mt-3">
                  <Col md="12">
                    <DatatablePagination
                      data={store?.questionItems || []}
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

export default QuestionsList;
