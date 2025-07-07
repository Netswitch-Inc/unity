// ** React Imports
import React from "react";

// ** Reactstrap Imports
import { Table } from "reactstrap";
import { useTable, useExpanded } from "react-table";

// ** Third Party Components
import classnames from "classnames";

// ** Icons
import editIcon from "assets/img/edit.svg";

// Define this inside the file
const renderRowSubComponent = ({ row, visibleColumns, projectStatus, projectItemData, aiServiceEnabled, handleOpenAIWriteModal }) => {
  return (
    <tr className="expanded-row">
      <td colSpan={visibleColumns.length}>
        <div className="my-expanded-content">
          <p className="description-text">Type: <span className="font-weight-light">{row.original?.security_function}</span></p>
        </div>

        <div className="my-expanded-content">
          <p className="description-text">
            Description
            {!projectItemData || (projectItemData && projectStatus.includes(projectItemData?.status)) ? (
              <img
                width={18}
                height={18}
                alt="Edit"
                title="Edit"
                src={editIcon}
                className="cursor-pointer mx-2"
                onClick={() => handleOpenAIWriteModal(`sub-edit-dec@${row.original?._id}`)}
              />
            ) : null}
          </p>
          <p>{row.original?.description}</p>
        </div>

        {aiServiceEnabled && (!projectItemData || (projectItemData && projectStatus?.includes(projectItemData?.status))) ? (
          <div className="my-expanded-content buttons">
            <button type="button" className="btnprimary mt-2" onClick={() => handleOpenAIWriteModal(`cis@${row.original?._id}`)}>Rewrite with Sara</button>
          </div>
        ) : null}
      </td>
    </tr>
  )
}

function ReactTable({ columns: userColumns, data, projectStatus, projectItemData, aiServiceEnabled, handleOpenAIWriteModal }) {
  const {
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable(
    {
      columns: userColumns,
      data
    },
    useExpanded
  )

  return (<>
    <div className="flex-column">
      <div>
        <div className="mb-2" style={{ textAlign: "end" }}>
          Showing the first {rows.length >= 20 ? 20 : rows.length} results of {rows.length} rows
        </div>
      </div>

      <div className="PopupSrollingEffect sub-resilience-table">
        <Table className="table">
          <thead className="thead-fixed">
            {headerGroups.slice(1).map((headerGroup, headerRowIndex) => (
              <tr key={`${headerRowIndex}-header`} className="table-header-row">
                {headerGroup.headers.map((column, headerIndex) => (
                  <th
                    {...column.getHeaderProps({
                      style: {
                        maxWidth: column.maxWidth,
                        minWidth: column.minWidth,
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
                <React.Fragment key={`${rowProps?.key}-${i}`}>
                  <tr key={`${rowKey}-row`} className={classnames("table-data-row", {
                    "expanded-main": row.isExpanded
                  })}>
                    {row.cells.map((cell, cellIndex) => (
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
                    ))}
                  </tr>
                  {row.isExpanded ? (
                    renderRowSubComponent({ row, rowProps, visibleColumns, data, projectStatus, projectItemData, aiServiceEnabled, handleOpenAIWriteModal })
                  ) : null}
                </React.Fragment>
              )
            })}
          </tbody>
        </Table>
      </div>
    </div>
  </>)
}

export default ReactTable;
