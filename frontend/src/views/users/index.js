/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import { useEffect, useState, Fragment, useCallback, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { getUserList, cleanUserMessage, deleteUser } from "./store";

// ** Reactstrap Imports
import { Col, Row, Card, CardBody, InputGroup } from "reactstrap";

// ** Utils
import { onImageSrcError, getModulePermissionData } from "utility/Utils";

// ** Custom Components
import DatatablePagination from "components/DatatablePagination";
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import {
  hostRestApiUrl,
  defaultPerPageRow,
  usersPermissionId,
  masterGroupPermissionId,
} from "utility/reduxConstant";

// ** SVG Icons
import { BiSearch } from "components/SVGIcons";
import editIcon from "assets/img/edit.svg";
import deleteIcon from "assets/img/delete.svg";

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";

// ** Styles
import "bootstrap/dist/css/bootstrap.min.css";

const UserManagement = () => {
  // ** Hooks
  const navigate = useNavigate();
  const mySwal = withReactContent(Swal);

  // ** Store vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.user);
  const loginStore = useSelector((state) => state.login);

  // ** Const
  const permission = getModulePermissionData(loginStore?.authRolePermission, usersPermissionId, masterGroupPermissionId)

  // ** States
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  // ** Pagination
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
  const [searchInput, setSearchInput] = useState("");

  const handleRowClicked = (row) => {
    if (permission?.update) {
      navigate(`/admin/users/edit/${row?._id || ""}`);
    }
  }

  const handleUsersLists = useCallback((sorting = sort, sortCol = sortColumn, page = currentPage, perPage = rowsPerPage, search = searchInput) => {
    dispatch(getUserList({
      sort: sorting,
      sortColumn: sortCol,
      page,
      limit: perPage,
      search: search
    }))
  }, [sort, sortColumn, currentPage, rowsPerPage, searchInput, dispatch])

  useLayoutEffect(() => {
    handleUsersLists();
  }, [handleUsersLists])

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanUserMessage(null))
    }

    if (store?.actionFlag === "USR_DLT" || store?.actionFlag === "USR_DLT_ERR") {
      handleUsersLists()
    }

    if (store?.success) {
      setShowSnackbar(true);
      setSnackMessage(store.success);
    }

    if (store?.error) {
      setShowSnackbar(true);
      setSnackMessage(store.error);
    }
  }, [dispatch, handleUsersLists, store.error, store.success, store.actionFlag])

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const onSearchKey = (value) => {
    setSearchInput(value);
    handleUsersLists(sort, sortColumn, currentPage, rowsPerPage, value);
  }

  const handlePagination = (page) => {
    setCurrentPage(page + 1);
    handleUsersLists(sort, sortColumn, page + 1, rowsPerPage, searchInput);
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    handleUsersLists(
      sortDirection,
      column.sortField,
      currentPage,
      rowsPerPage,
      searchInput
    )
  }

  const handlePerPage = (value) => {
    setRowsPerPage(value);
    handleUsersLists(sort, sortColumn, currentPage, value, searchInput);
  }

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
        dispatch(deleteUser(id))
      }
    })
  }

  const columns = [
    {
      name: "Photo",
      sortField: "image",
      cell: (row) => (
        <img
          alt="Profile"
          style={{ maxHeight: 40, maxWidth: 40 }}
          src={row?.image ? `${hostRestApiUrl}/${row?.image}` : defaultAvatar}
          onError={(currentTarget) => onImageSrcError(currentTarget, defaultAvatar)}
        />
      )
    },
    {
      name: "Name",
      sortField: "first_name",
      sortable: true,
      cell: (row) => (
        <div className="text-break">
          <span
            className="text-wrap cursor-pointer"
            onClick={() => handleRowClicked(row)}
          >
            {`${row?.first_name ?? ""} ${row?.last_name ?? ""}`.trim()}
          </span>
        </div>
      )
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
                onClick={() => navigate(`edit/${row?._id || ""}`)}
              />
            ) : null}

            {permission?.delete ? (
              <img
                alt="Delete"
                title="Delete"
                src={deleteIcon}
                className="cursor-pointer"
                onClick={() => handleDelete(row?._id)}
              />
            ) : null}
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
                <h3 className="card-title">Users</h3>
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
                          onClick={() => navigate(`add`)}
                          className="btnprimary"
                          type="button"
                        >
                          Add User
                        </button>
                      ) : null}
                    </div>
                  </Col>
                </Row>

                <Row className="userManagement mt-3">
                  <Col md="12">
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
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default UserManagement;
