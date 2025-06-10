import React from "react";
import { DialDiv, DialDivFrameworks } from "./DialDiv";
/**
 * Generates an array of Row components containing Column components with DialDivs.
 *
 * @param {Array} data - The data array to be used for generating columns.
 * @param {number} columnsPerRow - The number of columns per row.
 * @returns {Array} An array of Row components.
 */

export const GenerateRows = (
  data,
  columnsPerRow,
  handleSelectedControlData,
  defaultData
) => {

  const numRow = Math.ceil(data.length / columnsPerRow);
  const handlePassControlData = (item) => {
    handleSelectedControlData(item);
  }

  return Array.from({ length: numRow }, (_, rowIndex) => {
    const columns = data ? (
      data.slice(rowIndex * columnsPerRow, rowIndex * columnsPerRow + columnsPerRow)
        .map((item, colIndex) => (
          <div key={`${item?.name}-${colIndex}`} className="dial-div-framwork-card">
            <DialDiv
              value={item?._id}
              name={item.name ? item.name : defaultData?.name}
              identifier={item?.identifier || defaultData?.identifier || ""}
              framework_name={item?.framework_id?.label || defaultData?.framework_id?.label || ""}
              description={item.description ? item.description : defaultData?.description}
              handlePassControlData={() => handlePassControlData(item)}
              defaultData={defaultData?._id}
            />
          </div>
        ))
    ) : null

    return (
      <div className="border-light frame-box resilience-index" key={rowIndex.toString()}>
        {columns}
      </div>
    )
  })
}

export const GenerateFrameworkRows = (
  data,
  columnsPerRow,
  handleControllerLists
) => {
  const numRow = Math.ceil(data.length / columnsPerRow);
  const handlePassFramework = (id) => {
    const idArr = [];
    idArr.push(id);
    handleControllerLists(idArr)
  }

  return Array.from({ length: numRow }, (_, rowIndex) => {
    const columns = data ? (
      data.slice(rowIndex * columnsPerRow, rowIndex * columnsPerRow + columnsPerRow)
        .map((item, colIndex) => (
          <div
            key={`${item?.name}-${colIndex}`}
            className="dial-div-framwork-card"
            onClick={() => handlePassFramework(item._id)}
          >
            <DialDivFrameworks
              text={item.label}
            // des={item.description}
            // handlePassControlData={() => handlePassControlData(item)}
            />
          </div>
        ))
    ) : null

    return (
      <div className="border-light frame-box" key={rowIndex.toString()}>
        {columns}
      </div>
    )
  })
}
