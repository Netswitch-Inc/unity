/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Table,
  Button,
  Pagination,
  PaginationLink,
  PaginationItem
} from "reactstrap";
import Select from "react-select";

import Loader from "react-loader";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import { useTable, usePagination, useFilters } from "react-table";

import BulkModel from "../modals/BulkModel";
import WhiteListedModel from "../modals/WhiteListedModel";

const CisHostDetailsTable = ({
  ModalToggle,
  setModalToggle,
  searchedTerm,
  status,
  hostData,
}) => {
  const [PolicyPopupShow, setPolicyPopupShow] = useState(false);
  const [policyId, setPolicyId] = useState();
  const [selectedData, setSelectedData] = useState([]);
  const [type, setType] = useState("");
  const [loaded] = useState(true);
  const [Pagest, setPagest] = useState(pageIndex);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [SnackMessage] = useState(false);

  const DataId = (id) => {
    setPolicyId(id);
    setPolicyPopupShow(true);
  };

  const AssignPopupcallback = () => {
    setPolicyPopupShow(false);
  };

  const [initialData] = useState([]);
  const [data, setTableData] = useState([]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Select",
        accessor: "Select",
        Cell: (row) => {
          return (
            <input
              type="checkbox"
              className="checkbox"
              checked={selectedData?.some((elem) => {
                if (elem?.id === row?.row?.original?.id) {
                  return true;
                }
              })}
              disabled={
                row?.row?.original?.fail <= 0 ||
                row?.row?.original?.assignTo?.length > 0 ||
                row?.row?.original?.has_policy === 0
              }
              onChange={(event) => handleChange(event, row, row.row.index)}
            />
          );
        },
      },
      {
        Header: "Description",
        accessor: "itemName",
      },
      {
        Header: "Pass",
        accessor: "pass",
      },
      {
        Header: "Fail",
        accessor: "fail",
      },
      {
        Header: "Error",
        accessor: "error",
      },
      {
        Header: "Unknown",
        accessor: "unknown",
      },
      {
        Header: "Score",
        accessor: "score",
      },
      {
        Header: "Max",
        accessor: "max",
      },
      {
        Header: "Percent",
        accessor: "percentage",
        Cell: ({ value }) => {
          return value.toFixed(2);
        },
      },
      {
        Header: "WhiteList",
        accessor: "whiteList",
        Cell: (row) => {
          return (
            <span
              className="White-list pointer"
              onClick={() => DataId(row?.row?.original?.id)}
            >
              {row?.row?.original?.whiteList}
            </span>
          );
        },
      },
      {
        Header: "Assign To",
        accessor: "assignTo",
      },
    ],
    [selectedData]
  );

  const getCisData = async () => {
  }

  const {
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: Pagest },
      status,
    },
    useFilters,
    usePagination
  );

  useEffect(() => {
    getCisData();
    setPagest(pageIndex);
  }, []);

  useEffect(() => {
    if (searchedTerm.trim().length >= 1) {
      setTableData(initialData);
      if (status) {
        setTableData((prev) =>
          prev.filter((item) => !isNaN(item.fail) && item.fail > 0)
        );
      } else {
        setTableData(initialData);
      }

      setTableData((prev) =>
        prev.filter((item) => {
          return Object.keys(item).some((key) => {
            let value = item[key];

            return String(value)
              .toLowerCase()
              .includes(String(searchedTerm).toLowerCase());
          });
        })
      );
    } else {
      setTableData(initialData);
    }
  }, [searchedTerm]);

  useEffect(() => {
    if (status) {
      setTableData((prev) =>
        prev.filter((item) => !isNaN(item.fail) && item.fail > 0)
      );
    } else {
      setTableData(initialData);
    }
  }, []);

  const handleChange = (event, allData, index) => {
    let { checked } = event.target,
      singleRow = allData.row.original;

    if (checked) {
      setSelectedData((selectedData) => [...selectedData, singleRow]);
    } else {
      setSelectedData((arr) =>
        arr.filter((item) => item.itemName !== singleRow.itemName)
      );
    }
  };

  const openModalBox = (type) => {
    setModalToggle(!ModalToggle);
    setType(type);
  };

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 5000);
  }, [showSnackBar]);

  let checkboxSelectData = () => {
    setSelectedData([]);
  };

  let whiteListFailCount = async () => { };

  return (
    <>
      <ReactSnackBar
        Icon={
          <span>
            <TiMessages size={25} />
          </span>
        }
        Show={showSnackBar}
      >
        {SnackMessage}
      </ReactSnackBar>

      <Loader
        loaded={loaded}
        lines={13}
        length={10}
        width={5}
        radius={30}
        corners={1}
        rotate={0}
        direction={1}
        color="#2774f6"
        speed={1}
        trail={60}
        shadow={false}
        hwaccel={false}
        className="spinner"
        zIndex={2e9}
        top="50%"
        left="50%"
        scale={1.0}
        loadedClassName="loadedContent"
      />

      <Table responsive striped className="tablesorter table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);

            return (
              <tr
                {...row.getRowProps()}
                className={
                  row?.original?.iswhitelisted === 1 &&
                    row?.original?.fail === 0 &&
                    row?.original?.assignTo == null
                    ? "table-row-highlight"
                    : ""
                }
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <nav>
        <div style={{ textAlign: "end" }}>
          <Button
            color="btn-simple active btn btn-info btn-sm"
            type="button"
            disabled={selectedData.length === 0}
            onClick={() => openModalBox("WhiteList")}
          >
            WhiteList
          </Button>
          <Button
            color="btn-simple active btn btn-info btn-sm"
            type="button"
            disabled={selectedData.length === 0}
            onClick={() => openModalBox("Assign")}
          >
            Assign
          </Button>
        </div>

        <h6 className={`text-center ${data.length > 0 ? "d-none" : ""}`}>
          No Match Found
        </h6>
        <Pagination>
          <PaginationItem>
            <PaginationLink
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              <span aria-hidden={true}>
                <i aria-hidden={true} className="tim-icons icon-double-left" />
              </span>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <span aria-hidden={true}>
                <i aria-hidden={true} className="tim-icons icon-minimal-left" />
              </span>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{pageIndex + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => nextPage()} disabled={!canNextPage}>
              <span aria-hidden={true}>
                <i
                  aria-hidden={true}
                  className="tim-icons icon-minimal-right"
                />
              </span>
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <span aria-hidden={true}>
                <i aria-hidden={true} className="tim-icons icon-double-right" />
              </span>
            </PaginationLink>{" "}
          </PaginationItem>
          <Col lg="2" md="3" sm="2">
            <Select
              className="react-select info"
              classNamePrefix="react-select"
              name="singleSelect"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.value));
              }}
              options={[
                { value: 10, label: "Show 10" },
                { value: 20, label: "Show 20" },
                { value: 40, label: "Show 40" },
                { value: 100, label: "Show 100" },
              ]}
            ></Select>
          </Col>
        </Pagination>
      </nav>

      {/* Modal data */}
      <Row>
        <Col className="text-center" md="12">
          {ModalToggle ? (
            selectedData.length === 1 ? (
              <BulkModel
                ModalToggle={ModalToggle}
                setModalToggle={setModalToggle}
                data={selectedData}
                hostData={hostData}
                getCisData={getCisData}
                type={type}
                checkboxSelectData={checkboxSelectData}
                whiteListFailCount={whiteListFailCount}
              />
            ) : (
              <BulkModel
                ModalToggle={ModalToggle}
                setModalToggle={setModalToggle}
                data={selectedData}
                hostData={hostData}
                getCisData={getCisData}
                type={type}
                checkboxSelectData={checkboxSelectData}
                whiteListFailCount={whiteListFailCount}
              />
            )
          ) : null}
        </Col>
      </Row>
      {PolicyPopupShow ? (
        <WhiteListedModel
          AssignPopupcallback={AssignPopupcallback}
          id={policyId}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default CisHostDetailsTable;
