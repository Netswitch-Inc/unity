// ** Reactstrap Imports
import { Spinner } from "reactstrap";

// ** Constant
import { spinnerColor } from "utility/reduxConstant";

const SimpleSpinner = ({ color = "", className = "" }) => {
    if (!className) {
        className = "d-flex justify-content-center position-fixed zindex-2";
    }

    return (
        <div className={`spinner-content ${className}`}>
            <Spinner color={color || spinnerColor} />
        </div>
    )
}

export default SimpleSpinner;
