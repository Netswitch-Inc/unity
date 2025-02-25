import {
  useState,
  Fragment,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import SimpleSpinner from "components/spinner/simple-spinner";
import { Col, Row, Card, CardBody, InputGroup, UncontrolledTooltip } from "reactstrap";
import DatatablePagination from "components/DatatablePagination";
import { useSelector, useDispatch } from "react-redux";
import {
  TiEdit,
  TiTrash,
  TiEye,
  TiArrowForwardOutline,
} from "react-icons/ti";
import Swal from "sweetalert2";
import { getAssessmentList, deleteAssessment } from "./store";
import {
  defaultPerPageRow,
  discoveryGroupPermissionId,
  assessmentFormsPermissionId,
} from "utility/reduxConstant";
import { BiSearch } from "components/SVGIcons";
import { useNavigate } from "react-router-dom";

// ** Utils
import { getModulePermissionData } from "utility/Utils";

const AssessmentList = () => {
  // const [showSnackBar, setshowSnackbar] = useState(false)
  // const [snakebarMessage, setSnakbarMessage] = useState("");

  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
  const [searchInput, setSearchInput] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state.assessment);
  const loginStore = useSelector((state) => state.login);

  // ** Const
  const permission = getModulePermissionData(
    loginStore?.authRolePermission,
    assessmentFormsPermissionId,
    discoveryGroupPermissionId
  );

  const handleAssesmentLists = useCallback(
    (
      sorting = sort,
      sortCol = sortColumn,
      page = currentPage,
      perPage = rowsPerPage,
      search = searchInput
    ) => {
      dispatch(
        getAssessmentList({
          sort: sorting,
          sortColumn: sortCol,
          page,
          limit: perPage,
          search: search,
        })
      );
    },
    [sort, sortColumn, currentPage, rowsPerPage, searchInput, dispatch]
  );

  useLayoutEffect(() => {
    handleAssesmentLists();
  }, [handleAssesmentLists, dispatch]);

  useEffect(() => {
    if (store?.actionFlag === "ASSESSMENT_DELETED_SUCCSESS") {
      dispatch(getAssessmentList());
    }
  }, [store?.actionFlag, dispatch]);

  const handleDeleteAssessment = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteAssessment(id));
        handleAssesmentLists();
        Swal.fire("Deleted!", "Your user has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "There was an error deleting the user.", "error");
      }
    }
  };

  const onSearchKey = (value) => {
    setSearchInput(value);
    handleAssesmentLists(sort, sortColumn, currentPage, rowsPerPage, value);
  };

  const handlePagination = (page) => {
    setCurrentPage(page + 1);
    handleAssesmentLists(sort, sortColumn, page + 1, rowsPerPage, searchInput);
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    handleAssesmentLists(
      sortDirection,
      column.sortField,
      currentPage,
      rowsPerPage,
      searchInput
    );
  };

  const handlePerPage = (value) => {
    setRowsPerPage(value);
    handleAssesmentLists(sort, sortColumn, currentPage, value, searchInput);
  };

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
              navigate(`/admin/assessment-forms/${row?._id}`);
            }
          }}
        >
          {row?.name || ""}
        </div>
      ),
    },
    {
      name: "Status",
      center: true,
      selector: (row) => (row.status === 1 ? "Active" : "InActive"),
    },
    {
      name: "Action",
      center: true,
      cell: (row) => (
        <Fragment>
          {permission?.update ? (
            <>
              <TiEdit
                size={20}
                cursor="pointer"
                id={`tooltip-Update-${row?._id}`}
                onClick={() => navigate(`/admin/assessment-forms/${row?._id}`)}
              />
              <UncontrolledTooltip
                placement="top"
                target={`tooltip-Update-${row?._id}`}
              >
                Update
              </UncontrolledTooltip>
            </>
          ) : null}

          {permission?.delete ? (
            <>
              <TiTrash
                size={20}
                cursor="pointer"
                id={`tooltip-Delete-${row?._id}`}
                onClick={() => handleDeleteAssessment(row?._id)}
              />
              <UncontrolledTooltip
                placement="top"
                target={`tooltip-Delete-${row?._id}`}
              >
                Delete
              </UncontrolledTooltip>
            </>
          ) : null}

          {permission?.update ? (
            <>
              <TiEye
                size={20}
                cursor="pointer"
                id={`tooltip-Preview-${row?._id}`}
                onClick={() =>
                  navigate(`/admin/assessment-form-preview/${row?._id}`)
                }
              />
              <UncontrolledTooltip
                placement="top"
                target={`tooltip-Preview-${row?._id}`}
              >
                Preview
              </UncontrolledTooltip>
            </>
          ) : null}
          <TiArrowForwardOutline
            size={20}
            cursor="pointer"
            id={`tooltip-forward-${row?._id}`}
            onClick={() =>
              navigate(`/admin/assessment-repots/${row?._id}`, {
                state: { name: row?.name },
              })
            }
          />
          <UncontrolledTooltip
            placement="top"
            target={`tooltip-forward-${row?._id}`}
          >
            Asessment Submissions
          </UncontrolledTooltip>
        </Fragment>
      ),
    },
  ];

  return (
    <div className="content data-list">
      {!store?.loading ? <SimpleSpinner /> : null}
      <div className="container-fluid">
        <Row className="row-row">
          <Card className="col-md-12 col-xxl-10 ml-auto mr-auto tbl-height-container">
            <div className="d-flex justify-content-between p-0 border-bottom card-header">
              <h3 className="card-title">Assesment Forms</h3>
            </div>

            <CardBody className="pl-0 pr-0">
              <Row className="mt-2">
                <Col sm="6">
                  <InputGroup>
                    <input
                      className="form-control "
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
                  {permission?.create ? (
                    <button
                      onClick={() => navigate("/admin/assessment-forms/add")}
                      className="btn btn-primary my-2"
                      type="button"
                    >
                      Assesment Form
                    </button>
                  ) : null}
                </Col>
              </Row>

              <Row className="userManagement mt-3">
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
        </Row>
      </div>
    </div>
  );
};

export default AssessmentList;
