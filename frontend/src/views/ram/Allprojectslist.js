/* eslint-disable react-hooks/exhaustive-deps */

import {
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  UncontrolledTooltip,
} from "reactstrap";
import React, { useState, useCallback, useEffect } from "react";
import {
  defaultPerPageRow,
  superAdminRole,
  companyAdminRole,
  currencySign,
  pipFormats,
  priority,
  projectStatus,
} from "utility/reduxConstant";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TiEye, TiTick, TiTimes } from "react-icons/ti";
import { getProjectList, updateProject } from "views/Projects/store";
import Select from "react-select";
import DatatablePagination from "components/DatatablePagination";
import SimpleSpinner from "components/spinner/simple-spinner";
import { BiSearch } from "components/SVGIcons";
import Swal from "sweetalert2";

import FrappeGanttView from "./FrappeGanttView";

const AllprojectsTab = ({ currentTab }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectStore = useSelector((state) => state.projects);
  const loginStore = useSelector((state) => state.login);
  const companyStore = useSelector((state) => state.company);

  const [rowsPerPage, setRowsPerPage] = useState(defaultPerPageRow);
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesList, setCompaniesList] = useState([]);
  const [companyVal, setCompanyVal] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState(null);

  const authUser = loginStore?.authUserItem;

  const handleRowClicked = (row) => {
    navigate(`/admin/project-details/${row?._id}`, {
      state: {
        // data: RAMData.RAMTableData,
        displayID: row?._id,
      },
    });
  };

  useEffect(() => {
    let list = [];
    if (companyStore?.companyItems?.length > 0) {
      list = companyStore?.companyItems?.map((item) => ({
        label: item?.name,
        value: item?._id,
      }));
    }
    setCompaniesList(() => list);
  }, [companyStore?.companyItems]);

  useEffect(() => {
    if (projectStore.actionFlag === "PROJECT_UPDATED") {
      handleProjectLists();
    }
  }, [projectStore.actionFlag]);

  const handleProjectLists = useCallback(
    (
      sorting = sort,
      sortCol = sortColumn,
      page = currentPage,
      perPage = rowsPerPage,
      search = searchInput
    ) => {
      let params = {
        sort: sorting,
        sortColumn: sortCol,
        page,
        limit: perPage,
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
      if (status?.value) {
        params.status = status?.value;
      }

      dispatch(getProjectList(params));
    },
    [
      sort,
      sortColumn,
      currentPage,
      rowsPerPage,
      dispatch,
      companyVal,
      selectedPriority,
      searchInput,
      status,
    ]
  );
  useEffect(() => {
    if (currentTab === "allprojects") {
      handleProjectLists();
    }
  }, [currentTab]);

  useEffect(() => {
    if (
      companyVal?.value !== "" ||
      selectedPriority?.value !== "" ||
      status?.value
    ) {
      handleProjectLists();
    }
  }, [handleProjectLists, companyVal, selectedPriority, status]);

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
    handleProjectLists(sort, sortColumn, currentPage, rowsPerPage, value);
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

  const updateStatus = async (payload, action) => {
    // setStatusval(() => status);
    await updateProjectStatus(payload, action);
    // await handleProjectLists(sort, sortColumn, currentPage, rowsPerPage, status)
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
                <TiEye
                  size={20}
                  color="#fff"
                  cursor="pointer"
                  className="mr-1"
                  id={`tooltip-detail-${row?._id}`}
                  onClick={() => handleRowClicked(row)}
                />

                <UncontrolledTooltip
                  placement="top"
                  target={`tooltip-detail-${row?._id}`}
                >
                  Detail
                </UncontrolledTooltip>

                {row?.status === "created" ? (
                  <>
                    <TiTick
                      size={20}
                      color="#fff"
                      cursor="pointer"
                      className="mr-1"
                      id={`tooltip-approve-${row?._id}`}
                      onClick={() =>
                        updateStatus(
                          { _id: row?._id, status: "approved" },
                          "created",
                          "Approve"
                        )
                      }
                    />

                    <UncontrolledTooltip
                      placement="top"
                      target={`tooltip-approve-${row?._id}`}
                    >
                      Approve
                    </UncontrolledTooltip>
                  </>
                ) : null}

                {row?.status === "approved" ? (
                  <>
                    <TiTick
                      size={20}
                      color="#fff"
                      cursor="pointer"
                      className="mr-1"
                      id={`tooltip-complete-${row?._id}`}
                      onClick={() =>
                        updateStatus(
                          { _id: row?._id, status: "completed" },
                          "approved",
                          "Complete"
                        )
                      }
                    />

                    <UncontrolledTooltip
                      placement="top"
                      target={`tooltip-complete-${row?._id}`}
                    >
                      Complete
                    </UncontrolledTooltip>
                  </>
                ) : null}

                {row?.status === "created" || row?.status === "approved" ? (
                  <>
                    <TiTimes
                      size={20}
                      color="#fff"
                      cursor="pointer"
                      className="mr-1"
                      id={`tooltip-cancel-${row?._id}`}
                      onClick={() =>
                        updateStatus(
                          { _id: row?._id, status: "cancelled" },
                          "created",
                          "Cancel"
                        )
                      }
                    />

                    <UncontrolledTooltip
                      placement="top"
                      target={`tooltip-cancel-${row?._id}`}
                    >
                      Cancel
                    </UncontrolledTooltip>
                  </>
                ) : null}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
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
                    className="form-control mt-0 mr-1"
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
                    className="react-select mx-1"
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
                  name="priority"
                  className="react-select mx-1"
                  classNamePrefix="react-select"
                  placeholder="Select Priority"
                  value={selectedPriority}
                  isClearable={true}
                  options={priority}
                  onChange={(secVal) => {
                    setSelectedPriority(secVal);
                  }}
                />
                <Select
                  name="status"
                  className="react-select mx-1"
                  classNamePrefix="react-select"
                  placeholder="Select Status"
                  value={status}
                  isClearable={true}
                  options={projectStatus}
                  onChange={(secVal) => {
                    setStatus(secVal);
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
  );
};

export default AllprojectsTab;
