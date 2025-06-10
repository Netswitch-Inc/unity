// ** React Imports
import { Fragment } from "react";

// ** Reactstrap Imports
import { Col, Label, Row } from "reactstrap";

// ** Third Party Components
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";

import { defaultPerPageRow, perPageRowItems } from "utility/reduxConstant";

const DatatablePagination = ({
  data = [],
  columns,
  customClass = "",
  loading = true,
  pagination,
  handleSort,
  rowsPerPage = defaultPerPageRow,
  handleRowPerPage,
  handlePagination,
  displayEntriesLabel = true
  // ...props
}) => {
  /* Page change function */
  const onPageChange = (page) => {
    if (handlePagination && (page?.selected || page?.selected === 0)) {
      handlePagination(page.selected);
    }
  }

  const onSortChange = (column, sortDirection) => {
    if (handleSort && column) {
      handleSort(column, sortDirection);
    }
  }

  const onChangePerPageRow = (value = "") => {
    if (handleRowPerPage) {
      handleRowPerPage(value);
    }
  }

  const DatatablePaginate = () => {
    return (
      <div className="pagination-content">
        <Row className="align-items-center">
          <Col sm={12} xl={6}>
            <div className="d-flex align-items-center justify-content-center justify-content-xl-start">
              <Label className="pr-2">Rows per page :</Label>
              <div className="select-wrapper">
                <select
                  id="formSelectPage"
                  value={rowsPerPage}
                  className="form-select form-select-page"
                  onChange={(event) => onChangePerPageRow(event?.target?.value)}
                >
                  {perPageRowItems?.map((item) => (
                    <option key={item?.value} value={item?.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {displayEntriesLabel ? (
                <div className="total-count text-center text-sm-start pl-3">
                  <Fragment>
                    {pagination?.startIndex || 0}-{pagination?.endIndex || 0} of{" "}
                    {pagination?.total || 0}
                  </Fragment>
                </div>
              ) : null}
            </div>
          </Col>

          <Col sm={12} xl={6}>
            <ReactPaginate
              nextLabel={<i className="tim-icons icon-minimal-right" />}
              breakLabel="..."
              previousLabel={<i className="tim-icons icon-minimal-left" />}
              pageCount={pagination?.pages ? pagination.pages : 1}
              activeClassName="active"
              breakClassName="page-item"
              pageClassName={"page-item"}
              breakLinkClassName="page-link"
              nextLinkClassName={"page-link"}
              pageLinkClassName={"page-link"}
              nextClassName={"page-item next next-btn"}
              previousLinkClassName={"page-link"}
              previousClassName={"page-item prev prev-btn"}
              onPageChange={(page) => onPageChange(page)}
              forcePage={pagination?.pageIndex ? pagination.pageIndex : 0}
              containerClassName={`pagination react-paginate  justify-content-center align-items-center mt-3 justify-content-xl-end mb-0 mt-xl-0`}
            />
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <div className={`datatable ${customClass}`}>
      <DataTable
        // noHeader={true}
        // {...props}
        data={data}
        columns={columns}
        pagination={pagination}
        sortServer={true}
        responsive={true}
        onSort={onSortChange}
        persistTableHead={true}
        paginationServer={true}
        progressPending={!loading}
        className="react-dataTable"
        noDataComponent={
          <div className="error-message">There are no records to display</div>
        }
        paginationComponent={DatatablePaginate}
        defaultSortFieldId={pagination?.sortColumn ? pagination.sortColumn : ""}
        paginationDefaultPage={pagination?.pageIndex ? pagination.pageIndex : 1}
      />
    </div>
  )
}

export default DatatablePagination;
