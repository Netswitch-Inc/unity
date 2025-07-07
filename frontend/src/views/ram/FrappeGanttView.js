// ** React Imports
import { useNavigate } from "react-router-dom";

// ** Reactstrap Imports
import {
    Button,
    ButtonGroup
} from "reactstrap";

// ** Third Party Components
import { FrappeGantt, ViewMode } from "frappe-gantt-react";

// ** Constant
import { isEmptyBlankDataDisplay } from "utility/reduxConstant";

const FrappeGanttView = () => {
    const navigate = useNavigate();

    const tasks = [
        {
            id: "1",
            name: "Review Ordering system contract ",
            start: new Date(2022, 3, 1),
            end: new Date(2022, 5, 21),
            progress: 34,
            dependencies: "",
        },
        {
            id: "2",
            name: "Review SIEM Tools",
            start: new Date(2022, 5, 1),
            end: new Date(2022, 7, 14),
            progress: 20,
            dependencies: "1",
        },
        {
            id: "3",
            name: "Deploy Pentest system in Tokyo",
            start: new Date(2022, 4, 1),
            end: new Date(2022, 6, 14),
            progress: 0,
            dependencies: "",
        },
        {
            id: "4",
            name: "Annual Compliance Audit",
            start: new Date(2022, 6, 1),
            end: new Date(2022, 8, 30),
            progress: 0,
            dependencies: "3",
        }
    ];

    return (<>
        <Button
            size="sm"
            className="btn btn-primary"
            onClick={() => navigate("/admin/project/add")}
        >
            Add Project
        </Button>

        {!isEmptyBlankDataDisplay ? (
            <ButtonGroup
                className="btn-group-toggle pull-right"
                data-toggle="buttons"
            >
                <Button id="0" size="sm" className="mr-2 btn btn-primary">
                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block ">
                        Day
                    </span>
                </Button>

                <Button id="1" size="sm" className="mr-2 btn btn-primary">
                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                        Month
                    </span>
                    <span className="d-block d-sm-none">
                        <i className="tim-icons icon-gift-2" />
                    </span>
                </Button>

                <Button id="1" size="sm" className="btn btn-primary">
                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                        Year
                    </span>
                    <span className="d-block d-sm-none">
                        <i className="tim-icons icon-gift-2" />
                    </span>
                </Button>
            </ButtonGroup>
        ) : null}

        {!isEmptyBlankDataDisplay ? (
            <div className="py-4">
                <FrappeGantt
                    tasks={tasks}
                    onClick={(task) => console.log(task, "click")}
                    onDateChange={(task, start, end) =>
                        console.log(task, start, end, "date")
                    }
                    onProgressChange={(task, progress) =>
                        console.log(task, progress, "progress")
                    }
                    onTasksChange={(tasks) => console.log(tasks, "tasks")}
                    viewMode={ViewMode.Month}
                />
            </div>
        ) : null}
    </>)
}

export default FrappeGanttView;
