import React from "react";
import { EyeSlash } from "components/SVGIcons";
import { Card } from "reactstrap";
import ExportPdf from "components/DashboardComp/Exportpdf";

// Higher-Order Component
const ToggleComp = (WrappedComponent) => {
  return (props) => {
    const { handleToggle, show, className } = props;

    return (<>
      {show ? (
        <Card className={className}>
          <div className="d-flex justify-content-between cursor-pointer defense-viewpdfbtn" onClick={() => handleToggle()}>
            <EyeSlash className="m-0" />
            <ExportPdf className="d-flex justify-content-end" />
          </div>
          
          <WrappedComponent {...props} />
        </Card>
      ) : null}
    </>)
  }
}

export default ToggleComp;
