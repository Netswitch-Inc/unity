import React from "react";
import { useTable, useExpanded } from "react-table";
import { Table } from "reactstrap";

function ReactTable({ columns: userColumns, data, renderRowSubComponent }) {
  const {
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    // state: {expanded}
  } = useTable(
    {
      columns: userColumns,
      data,
    },
    useExpanded // We can useExpanded to track the expanded state
    // for sub components too!
  );

  return (
    <>
      <div className="flex-column">
        <div>
          <div className="mb-2" style={{ textAlign: "end" }}>
            Showing the first {rows.length >= 20 ? 20 : rows.length} results of{" "}
            {rows.length} rows
          </div>
        </div>

        <div className="PopupSrollingEffect">
          <Table striped className="table">
            <thead className="thead-fixed">
              {headerGroups.map((headerGroup, headerRowIndex) => (
                <tr key={`${headerRowIndex}-header`}>
                  {headerGroup.headers.map((column, headerIndex) => (
                    <th
                      {...column.getHeaderProps({
                        style: {
                          maxWidth: column.maxWidth,
                          minWidth: column.minWidth,
                          padding: column.padding,
                        },
                      })}
                      key={`${headerIndex}-header`}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.map((row, i) => {
                prepareRow(row);
                const rowProps = row.getRowProps();
                const rowKey = rowProps.key ?? `row-${i}`;

                return (
                  // Use a React.Fragment here so the table markup is still valid
                  <React.Fragment key={`${rowProps?.key}-${i}`}>
                    <tr key={`${rowKey}-row`}>
                      {row.cells.map((cell, cellIndex) => {
                        return (
                          <td
                            {...cell.getCellProps({
                              style: {
                                minWidth: cell.column.minWidth,
                                maxWidth: cell.column.maxWidth,
                                padding: cell.column.padding,
                              },
                            })}
                            key={`${rowProps?.key}-${cellIndex}-cell`}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                    {/* We could pass anything into this */}
                    {row.isExpanded &&
                      renderRowSubComponent({
                        row,
                        rowProps,
                        visibleColumns,
                        data,
                      })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default ReactTable;
