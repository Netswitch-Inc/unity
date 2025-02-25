import React, { useState } from "react";
import { useTable, usePagination } from "react-table";
import {
  Table,
  Col,
  Pagination,
  PaginationLink,
  PaginationItem,
} from "reactstrap";
import Select from "react-select";
import CVEModal from "./CVEModal";

const CVELookUpTable = (props) => {
  let columns = props.columnsName;
  let data = props.CVEdata;

  const [modalClassic, setModalClassic] = useState(false);
  const [cell, setCell] = useState({});

  const toggleModalClassic = (cell) => {
    setModalClassic(!modalClassic);
    if (!modalClassic) {
      setCellValue(data[cell.row.index]);
    }
  };

  const setCellValue = (cell) => {
    var temp = {};
    temp.ID = cell.CVE_ID;
    temp.baseScore = cell.baseScore;
    temp.description = cell.description;
    temp.publishedDate = cell.publishedDate;
    temp.reference = cell.reference;
    setCell(temp);
  };

  const {
    page,
    gotoPage,
    nextPage,
    pageCount,
    prepareRow,
    canNextPage,
    setPageSize,
    headerGroups,
    previousPage,
    canPreviousPage,
    getTableBodyProps,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  return (<>
    <div>
      <CVEModal
        ModalToggle={modalClassic}
        setModalToggle={setModalClassic}
        data={cell}
      />
    </div>

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
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    onClick={() => toggleModalClassic(cell)}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>

    <nav>
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
              console.log(e);
              setPageSize(Number(e.value));
            }}
            options={[
              { value: 10, label: "Show 10" },
              { value: 20, label: "Show 20" },
              { value: 40, label: "Show 40" },
              { value: 100, label: "Show 100" },
            ]}
          />
        </Col>
      </Pagination>
    </nav>
  </>)
}

export default CVELookUpTable;
