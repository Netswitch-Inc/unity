/* eslint-disable react-hooks/exhaustive-deps */

import {
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
} from "reactstrap";
import React, { useState, useCallback, useEffect } from "react";
import "../../assets/customcss/customWork.css";
import { useSelector, useDispatch } from "react-redux";
import {
  defaultPerPageRow,
  superAdminRole,
  companyAdminRole,
  currencySign,
  pipFormats,
  priority,
} from "utility/reduxConstant";
import {
  getProjectList,
  updateProject,
  getProject,
} from "views/projects/store";
import DatatablePagination from "components/DatatablePagination";
import SimpleSpinner from "components/spinner/simple-spinner";
import Swal from "sweetalert2";
import { getCompanyList } from "views/companies/store";
import Select from "react-select";
import { BiSearch } from "components/SVGIcons";
import crossIcon from "assets/img/cross.svg"
import viewIcon from "assets/img/view.svg"
import checkIcon from "assets/img/check.svg"
import addIcon from "assets/img/add.svg"

import FrappeGanttView from "./FrappeGanttView";
import { useNavigate } from "react-router-dom";

function GeneralCard(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projectStore = useSelector((state) => state.projects);
  const loginStore = useSelector((state) => state.login);
  const companyStore = useSelector((state) => state.company);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusval, setStatusval] = useState(props.currentTab);
  const [companiesList, setCompaniesList] = useState([]);
  const [companyVal, setCompanyVal] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const authUser = loginStore?.authUserItem;
  const [searchInput, setSearchInput] = useState("");

  let handleID = function (id) {
    props.setDisplayID(id);
  };

  const handleProjectLists = useCallback(
    (
      sorting = sort,
      sortCol = sortColumn,
      page = currentPage,
      perPage = rowsPerPage,
      status = props.currentTab,
      search = searchInput
    ) => {
      let params = {
        sort: sorting,
        sortColumn: sortCol,
        page,
        limit: perPage,
        status,
        search: search,
      };
      if (loginStore?.authUserItem?.company_id?._id) {
        params.company_id = loginStore?.authUserItem?.company_id?._id;
      }
      if (!loginStore?.authUserItem?.company_id?._id) {
        params.company_id = companyVal?.value;
      }
      if (selectedPriority?.value) {
        params.priority = selectedPriority?.value;
      }
      dispatch(getProjectList(params));
    },
    [
      props.currentTab,
      statusval,
      sort,
      sortColumn,
      currentPage,
      rowsPerPage,
      dispatch,
      companyVal,
      selectedPriority,
      searchInput,
    ]
  );

  const handlePagination = (page) => {
    setCurrentPage(page + 1);
    handleProjectLists(sort, sortColumn, page + 1, rowsPerPage);
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    handleProjectLists(
      sortDirection,
      column.sortField,
      currentPage,
      rowsPerPage
    );
  };

  const handlePerPage = (value) => {
    setRowsPerPage(value);
    handleProjectLists(sort, sortColumn, currentPage, value);
  };

  const onSearchKey = (value) => {
    setSearchInput(() => value);
    handleProjectLists(
      sort,
      sortColumn,
      currentPage,
      rowsPerPage,
      props.currentTab,
      value
    );
  };

  const updateProjectStatus = async (payload, action) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(updateProject(payload));
        Swal.fire(
          `${payload?.status.toUpperCase()}`,
          `Project is ${payload?.status}.`,
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an error while updating status.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    if (authUser?.role_id?._id === superAdminRole) {
      dispatch(getCompanyList());
    }
  }, [dispatch]);

  useEffect(() => {
    if (projectStore.actionFlag === "PRJCT_UPDT_SCS") {
      handleProjectLists(sort, sortColumn, currentPage, rowsPerPage, statusval);
    }
    if (companyStore?.companyItems?.length > 0) {
      const list = companyStore?.companyItems?.map((item) => ({
        label: item?.name,
        value: item?._id,
      }));
      setCompaniesList(() => list);
    }
  }, [projectStore.actionFlag, companyStore?.companyItems]);

  const updateStatus = async (payload, status, action) => {
    setStatusval(() => status);
    await updateProjectStatus(payload, action);
    // await handleProjectLists(sort, sortColumn, currentPage, rowsPerPage, status)
  };

  const handleRowClicked = (row) => {
    handleID(row?._id);
  };

  useEffect(() => {
    if (companyVal?.value || selectedPriority?.value) {
      handleProjectLists();
    }
  }, [handleProjectLists, companyVal, selectedPriority]);

  useEffect(() => {
    if (props.currentTab !== statusval) {
      setCompanyVal(null);
      setSearchInput("");
      setSelectedPriority(null);
    }
  }, [props.currentTab]);

  const handleGetCurrentProject = async (displayID) => {
    if (displayID) {
      const query = { id: displayID };
      await dispatch(getProject(query));
    }
    navigate(`/admin/project/edit/${displayID}`, {
      state: { reCreate: true },
    })
  };

  const columns = [
    {
      name: "Priority",
      sortField: "priority",
      cell: (row) => (
        <span
          className="text-wrap cursor-pointer"
          onClick={() => handleRowClicked(row)}
        >
          {row.priority}
        </span>
      ),
    },
    {
      name: "Name",
      sortField: "name",
      cell: (row) => (
        <span
          className="text-wrap cursor-pointer"
          onClick={() => handleRowClicked(row)}
        >
          {row.name}
        </span>
      ),
    },
    {
      name: "Impact Scope",
      sortField: "affected_scope",
      cell: (row) => (
        <span
          className="text-wrap cursor-pointer"
          onClick={() => handleRowClicked(row)}
        >
          {row.affected_scope}
        </span>
      ),
    },
    {
      name: "Affected Score %",
      sortField: "affected_risk",
      center: true,
      cell: (row) => (
        <span
          className="text-wrap cursor-pointer"
          onClick={() => handleRowClicked(row)}
        >
          {row.affected_risk}%
        </span>
      ),
    },
    {
      name: "Risk Likelihood",
      sortField: "likelyhood",
      center: true,
      cell: (row) => (
        <span
          className="text-wrap cursor-pointer"
          onClick={() => handleRowClicked(row)}
        >
          {pipFormats[row.likelyhood - 1]}
        </span>
      ),
    },
    {
      name: "Cost of Risk",
      sortField: "cost_of_risk",
      center: true,
      cell: (row) => (
        <span
          className="text-wrap cursor-pointer"
          onClick={() => handleRowClicked(row)}
        >
          {currencySign}
          {row.cost_of_risk}
        </span>
      ),
    },
    {
      name: "Fix Projected Cost",
      sortField: "fix_projected_cost",
      center: true,
      cell: (row) => (
        <span
          className="text-wrap cursor-pointer"
          onClick={() => handleRowClicked(row)}
        >
          {currencySign}
          {row.fix_projected_cost}
        </span>
      ),
    },
    ...(loginStore?.authUserItem?.role_id?._id === superAdminRole ||
      loginStore?.authUserItem?.role_id?._id === companyAdminRole
      ? [
        {
          name: "Action",
          center: true,
          cell: (row) => (
            <div className="text-center">
              <img
                alt=""
                height={22}
                title="Detail"
                src={viewIcon}
                className="cursor-pointer mr-2"
                id={`tooltip-detail-${row?._id}`}
                onClick={() => handleRowClicked(row)}
              />

              {/* <UncontrolledTooltip
                placement="top"
                target={`tooltip-detail-${row?._id}`}
              >
                Detail
              </UncontrolledTooltip> */}

              {row?.status === "created" ? (<>
                <img
                  alt=""
                  height={22}
                  src={checkIcon}
                  title="Approve"
                  className="cursor-pointer mr-2"
                  id={`tooltip-approve-${row?._id}`}
                  onClick={() => updateStatus({ _id: row?._id, status: "approved" }, "created", "Approve")}
                />

                {/* <UncontrolledTooltip
                    placement="top"
                    target={`tooltip-approve-${row?._id}`}
                  >
                    Approve
                  </UncontrolledTooltip> */}
              </>) : null}

              {row?.status === "approved" ? (<>
                <img
                  alt=""
                  height={22}
                  src={checkIcon}
                  title="Complete"
                  className="cursor-pointer mr-2"
                  id={`tooltip-complete-${row?._id}`}
                  onClick={() => updateStatus({ _id: row?._id, status: "completed" }, "approved", "Complete")}
                />

                {/* <UncontrolledTooltip
                    placement="top"
                    target={`tooltip-complete-${row?._id}`}
                  >
                    Complete
                  </UncontrolledTooltip> */}
              </>) : null}

              {row?.status === "created" || row?.status === "approved" ? (<>
                <img
                  alt=""
                  height={22}
                  title="Cancel"
                  src={crossIcon}
                  className="cursor-pointer mr-2"
                  id={`tooltip-cancel-${row?._id}`}
                  onClick={() => updateStatus({ _id: row?._id, status: "cancelled" }, "created", "Cancel")}
                />

                {/* <UncontrolledTooltip
                    placement="top"
                    target={`tooltip-cancel-${row?._id}`}
                  >
                    Cancel
                  </UncontrolledTooltip> */}
              </>) : null}

              {row.status === "cancelled" ? (<>
                <img
                  alt=""
                  height={18}
                  src={addIcon}
                  title="Create"
                  className="cursor-pointer ml-1"
                  id={`tooltip-create-${row?._id}`}
                  onClick={() => handleGetCurrentProject(row?._id)}
                />

                {/* <UncontrolledTooltip
                    placement="top"
                    target={`tooltip-create-${row?._id}`}
                  >
                    Create
                  </UncontrolledTooltip> */}
              </>) : null}
            </div>
          )
        }
      ]
      : [])
  ];

  return (
    <>
      <div className="general-card">
        <Row>
          <Col lg="12" md="12">
            <Card className="p-3">
              <CardHeader className="row align-items-center p-0 pb-2 border-bottom">
                <div className="col-md-3">
                  <CardTitle tag="h3" className="">
                    Projects
                  </CardTitle>
                </div>
                <div className="d-flex justify-content-end col-md-9 filters">
                  <InputGroup className="mb-0">
                    <input
                      className="col-input w-100 mt-0 mr-1"
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
                  {authUser?.role_id?._id === superAdminRole ? (
                    <Select
                      name="company_id"
                      className="react-select col-select w-100 mx-1"
                      classNamePrefix="react-select"
                      placeholder="Select Location"
                      value={companyVal}
                      isClearable={true}
                      options={companiesList}
                      onChange={(secVal) => {
                        setCompanyVal(secVal);
                      }}
                    />
                  ) : null}

                  <Select
                    name="status"
                    className="react-select col-select w-100 mx-1"
                    classNamePrefix="react-select"
                    placeholder="Select Priority"
                    value={selectedPriority}
                    isClearable={true}
                    options={priority}
                    onChange={(secVal) => {
                      setSelectedPriority(secVal);
                    }}
                  />
                </div>
              </CardHeader>
              {!projectStore?.loading ? <SimpleSpinner /> : null}
              <CardBody>
                <Row className="roleManagement mt-3 content data-list">
                  <Col className="pb-2" md="12">
                    <DatatablePagination
                      data={projectStore.projectItems}
                      columns={columns}
                      rowsPerPage={rowsPerPage}
                      pagination={projectStore?.pagination}
                      handleSort={handleSort}
                      handleRowPerPage={handlePerPage}
                      handlePagination={handlePagination}
                      onRowClicked={handleRowClicked}
                    />
                  </Col>
                </Row>

                <FrappeGanttView />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default GeneralCard;
