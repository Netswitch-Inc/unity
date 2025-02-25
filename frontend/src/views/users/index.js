/* eslint-disable react-hooks/exhaustive-deps */
import "bootstrap/dist/css/bootstrap.min.css";
import {
  useEffect,
  useState,
  Fragment,
  useCallback,
  useLayoutEffect,
} from "react";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import {
  getActionRequest,
  editActionRequest,
  cleanMessage,
  deleteActionRequest,
} from "./store";

// ** Reactstrap Imports
import { Col, Row, Card, CardBody, InputGroup } from "reactstrap";

// ** Utils
import { onImageSrcError, getModulePermissionData } from "utility/Utils";

// ** Custom Components
import DatatablePagination from "components/DatatablePagination";

// ** Third Party Components
import Swal from "sweetalert2";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages, TiEdit, TiTrash } from "react-icons/ti";

// ** Constant
import {
  hostRestApiUrl,
  defaultPerPageRow,
  usersPermissionId,
  masterGroupPermissionId,
} from "utility/reduxConstant";

// ** SVG Icons
import { BiSearch } from "components/SVGIcons";

import AddUser from "./model/AddUserModel";

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";
import SimpleSpinner from "components/spinner/simple-spinner";

const UserManagement = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.user);
  const loginStore = useSelector((state) => state.login);

  // ** Const
  const permission = getModulePermissionData(
    loginStore?.authRolePermission,
    usersPermissionId,
    masterGroupPermissionId
  );

  const [openModel, setOpenModel] = useState(false);
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
  const [searchInput, setSearchInput] = useState("");

  const handleUsersLists = useCallback(
    (
      sorting = sort,
      sortCol = sortColumn,
      page = currentPage,
      perPage = rowsPerPage,
      search = searchInput
    ) => {
      dispatch(
        getActionRequest({
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
    handleUsersLists();
  }, [handleUsersLists, dispatch]);

  useEffect(() => {
    if (store.success) {
      handleUsersLists();
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
    }

    if (store.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [handleUsersLists, store.error, store.success]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar]);

  const onSearchKey = (value) => {
    setSearchInput(value);
    handleUsersLists(sort, sortColumn, currentPage, rowsPerPage, value);
  };

  const handlePagination = (page) => {
    setCurrentPage(page + 1);
    handleUsersLists(sort, sortColumn, page + 1, rowsPerPage, searchInput);
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    handleUsersLists(
      sortDirection,
      column.sortField,
      currentPage,
      rowsPerPage,
      searchInput
    );
  };

  const handlePerPage = (value) => {
    setRowsPerPage(value);
    handleUsersLists(sort, sortColumn, currentPage, value, searchInput);
  };

  const closePopup = () => {
    setOpenModel(() => false);
  };

  const getUserData = async (id) => {
    const query = { id: id };
    await dispatch(editActionRequest(query));
  };

  const addUser = () => {
    dispatch(cleanMessage());
    setTitle("Add User");
    setIsEditing(false);
    setOpenModel(() => true);
  };

  const editUser = async (id) => {
    await getUserData(id);
    setTitle("Edit User");
    setIsEditing(true);
    setOpenModel(() => true);
  };

  const deleteUser = async (id) => {
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
        await dispatch(deleteActionRequest(id));
        Swal.fire("Deleted!", "Your user has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "There was an error deleting the user.", "error");
      }
    }
  };

  const columns = [
    {
      name: "Profile Photo",
      sortField: "image",
      cell: (row) => (
        <img
          alt="Profile"
          src={row?.image ? `${hostRestApiUrl}/${row?.image}` : defaultAvatar}
          onError={(currentTarget) =>
            onImageSrcError(currentTarget, defaultAvatar)
          }
          style={{ maxHeight: 40, maxWidth: 40 }}
        />
      ),
    },
    {
      name: "Name",
      sortField: "first_name",
      sortable: true,
      cell: (row) => (
        <div className="text-break">
          {`${row?.first_name ?? ""} ${row?.last_name ?? ""}`.trim()}
        </div>
      ),
    },
    {
      name: "Email",
      sortField: "email",
      sortable: true,
      cell: (row) => (<div className="text-break">{row?.email || ""}</div>),
    },
    {
      name: "Username",
      sortField: "user_name",
      sortable: true,
      selector: (row) => row?.user_name || "",
    },
    {
      name: "Role",
      sortField: "role_id",
      sortable: true,
      cell: (row) => (<div className="text-break">{row?.role_id?.name || ""}</div>),
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
          {permission?.update ? (
            <TiEdit
              size={20}
              cursor="pointer"
              onClick={() => editUser(row?._id)}
            />
          ) : null}

          {permission?.delete ? (
            <TiTrash
              size={20}
              cursor="pointer"
              onClick={() => deleteUser(row?._id)}
            />
          ) : null}
        </Fragment>
      ),
    },
  ];

  return (
    <div className="content data-list">
      <div className="container-fluid">
        {!store?.loading ? <SimpleSpinner /> : null}
        {showSnackBar && (
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
        )}

        <Row className="row-row">
          <Card className="col-md-12 col-xxl-10 ml-auto mr-auto tbl-height-container">
            <div className="d-flex justify-content-between p-0 border-bottom card-header">
              <h3 className="card-title">Users</h3>
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

                <Col sm="6" className="text-right my-2">
                  {permission?.create ? (
                    <button
                      onClick={() => addUser()}
                      className="btn btn-primary"
                      type="button"
                    >
                      Add User
                    </button>
                  ) : null}
                </Col>
              </Row>

              <Row className="userManagement mt-3">
                <Col className="pb-2" md="12">
                  <DatatablePagination
                    data={store?.userItems || []}
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

      {openModel && (
        <AddUser
          lgshow={openModel}
          closePopup={closePopup}
          title={title}
          initialValues={store.editItem}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default UserManagement;
