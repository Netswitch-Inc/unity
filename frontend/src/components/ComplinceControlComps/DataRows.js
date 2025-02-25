import React from "react";
import { Col, Row } from "reactstrap";
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
  };
  return Array.from({ length: numRow }, (_, rowIndex) => {
    const columns = data && data
      .slice(rowIndex * columnsPerRow, rowIndex * columnsPerRow + columnsPerRow)
      .map((item, colIndex) => (
        <Col
          className="dial-div-framwork-card test"
          // sm="6"
          key={`${item?.name}-${colIndex}`}
        >
          <DialDiv
            text={item.name ? item.name : defaultData?.name}
            des={item.description ? item.description : defaultData?.description}
            value={item?._id}
            handlePassControlData={() => handlePassControlData(item)}
            defaultData={defaultData?._id}
          />
        </Col>
      ));

    return (
      <Row className="border-light ml-2 mr-2" key={rowIndex.toString()}>
        {columns}
      </Row>
    );
  });
};

export const GenerateFrameworkRows = (
  data,
  columnsPerRow,
  handleControllerLists
) => {
  const numRow = Math.ceil(data.length / columnsPerRow);
  const handlePassFramework = (id) => {
    const idArr = [];
    idArr.push(id);
    handleControllerLists(idArr);
  };

  return Array.from({ length: numRow }, (_, rowIndex) => {
    const columns = data && data
      .slice(rowIndex * columnsPerRow, rowIndex * columnsPerRow + columnsPerRow)
      .map((item, colIndex) => (
        <Col
          className="dial-div-framwork-card"
          sm="6"
          key={`${item?.name}-${colIndex}`}
          onClick={() => handlePassFramework(item._id)}
        >
          <DialDivFrameworks
            text={item.label}

          // des={item.description}
          // handlePassControlData={() => handlePassControlData(item)}
          />
        </Col>
      ));

    return (
      <Row className="border-light ml-2 mr-2" key={rowIndex.toString()}>
        {columns}
      </Row>
    );
  });
};

// export default GenerateRows;
