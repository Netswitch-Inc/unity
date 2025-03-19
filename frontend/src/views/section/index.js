import { useState, Fragment, useCallback, useLayoutEffect } from "react";
import SimpleSpinner from "components/spinner/simple-spinner";
import { Col, Row, Card, CardBody, InputGroup } from "reactstrap";
import DatatablePagination from "components/DatatablePagination";
import { useSelector, useDispatch } from "react-redux";
import { TiEdit, TiTrash } from "react-icons/ti";
import Swal from "sweetalert2";
import { getSectionList, deleteSection } from "./store";
import { defaultPerPageRow } from "utility/reduxConstant";
import { BiSearch } from "components/SVGIcons";
import { useNavigate } from "react-router-dom";

const SectionsList = () => {
  // const [showSnackBar, setshowSnackbar] = useState(false)
  // const [snakebarMessage, setSnakbarMessage] = useState("");

  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
  const [searchInput, setSearchInput] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state.sections);

  const handleSectionLists = useCallback(
    (
      sorting = sort,
      sortCol = sortColumn,
      page = currentPage,
      perPage = rowsPerPage,
      search = searchInput
    ) => {
      dispatch(
        getSectionList({
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
    handleSectionLists();
  }, [handleSectionLists, dispatch]);

  // useEffect(() => {
  //     setTimeout(() => {
  //         setshowSnackbar(false);
  //     }, 6000);
  // }, [showSnackBar])

  const handleDeleteSection = async (id) => {
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
        await dispatch(deleteSection(id));
        Swal.fire("Deleted!", "Your user has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "There was an error deleting the user.", "error");
      }
    }
  };

  const onSearchKey = (value) => {
    setSearchInput(value);
    handleSectionLists(sort, sortColumn, currentPage, rowsPerPage, value);
  };

  const handlePagination = (page) => {
    setCurrentPage(page + 1);
    handleSectionLists(sort, sortColumn, page + 1, rowsPerPage, searchInput);
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    handleSectionLists(
      sortDirection,
      column.sortField,
      currentPage,
      rowsPerPage,
      searchInput
    );
  };

  const handlePerPage = (value) => {
    setRowsPerPage(value);
    handleSectionLists(sort, sortColumn, currentPage, value, searchInput);
  };

  const columns = [
    {
      name: "Name",
      sortField: "name",
      sortable: true,
      cell: (row) => row?.name,
    },
    {
      name: "order",
      sortField: "order",
      sortable: true,
      cell: (row) => row.order,
    },
    {
      name: "Status",
      center: true,
      selector: (row) => (
        <input type="checkbox" id="status" checked={row?.status} disabled />
      ),
    },
    {
      name: "Action",
      center: true,
      cell: (row) => (
        <Fragment>
          <TiEdit
            size={20}
            cursor="pointer"
            onClick={() => navigate(`/admin/sections/edit/${row?._id}`)}
          />
          <TiTrash
            size={20}
            cursor="pointer"
            onClick={() => handleDeleteSection(row?._id)}
          />
        </Fragment>
      ),
    },
  ];

  return (
    <div className="content data-list">
      {!store?.loading ? <SimpleSpinner /> : null}
      {/* {showSnackBar && (
                <ReactSnackBar
                    Icon={
                        <span>
                            <TiMessages size={25} />
                        </span>
                    }
                    Show={showSnackBar}
                >
                    {snakebarMessage}
                </ReactSnackBar>
            )} */}

      <div className="container-fluid">
        <Row className="row-row">
          <Card className="col-md-12 col-xxl-10 ml-auto mr-auto tbl-height-container">
            <div className="d-flex justify-content-between p-0 border-bottom card-header">
              <h3 className="card-title">Sections</h3>
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
                  <button
                    onClick={() => navigate("/admin/sections/add")}
                    className="btn btn-primary my-2"
                    type="button"
                  >
                    Add Section
                  </button>
                </Col>
              </Row>

              <Row className="userManagement mt-3">
                <Col className="pb-2" md="12">
                  <DatatablePagination
                    data={store.sectionItems}
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

export default SectionsList;
