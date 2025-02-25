const Projectservice = require("../services/projects.service");
const projectHistoryService = require("../services/projecthistories.service")
exports.getProjects = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  try {
    var page = Number(req.query?.page || 1);
    var limit = Number(req.query?.limit || 100);
    var sort = req.query?.sort == "asc" ? 1 : -1;
    var sortColumn = req.query.sortColumn ? req.query.sortColumn : "_id";
    var search = req.query?.search || "";
    var pageIndex = 0;
    var startIndex = 0;
    var endIndex = 0;

    var query = { deletedAt: null };
    // if (search) {
    //   query["$or"] = [
    //     { name: { $regex: ".*" + search + ".*", $options: "i" } },
    //     // { affected_risk: { $regex: ".*" + search + ".*", $options: "i" } },
    //     // { affected_scope: { $regex: ".*" + search + ".*", $options: "i" } },
    //     // { cost_of_risk: { $regex: ".*" + search + ".*", $options: "i" } },
    //     { fix_projected_cost: { $regex: ".*" + search + ".*", $options: "i" } },
    //   ];
    // }

    if (search) {
      const parsedCost = parseFloat(search);
      const isNumberSearch = !isNaN(parsedCost);
      query["$or"] = [
        { name: { $regex: ".*" + search + ".*", $options: "i" } }
      ];

      if (isNumberSearch) {
        query["$or"].push({ fix_projected_cost: parsedCost });
        query["$or"].push({ cost_of_risk: parsedCost });
        query["$or"].push({ affected_scope: parsedCost });
        query["$or"].push({ affected_risk: parsedCost });
        query["$or"].push({ fix_projected_cost: parsedCost });
      } else {
        query["$or"].push({ name: { $regex: ".*" + search + ".*", $options: "i" } });
      }
    }

    if (req.query?.company_id) {
      query.company_id = req.query.company_id;
    }

    if (req.query?.status) {
      query.status = req.query.status;
    }

    if (req.query?.priority) {
      query.priority = req.query.priority;
    }

    var count = await Projectservice.getProjectsCount(query);
    var Projects = await Projectservice.getProjects(
      query,
      page,
      limit,
      sortColumn,
      sort
    );
    if (!Projects || !Projects.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        Projects = await Projectservice.getProjects(
          query,
          page,
          limit,
          sortColumn,
          sort
        );
      }
    }

    if (Projects && Projects.length) {
      pageIndex = page - 1;
      startIndex = pageIndex * limit + 1;
      endIndex = Math.min(startIndex - 1 + limit, count);
    }

    var pagination = {
      pages: Math.ceil(count / limit),
      total: count,
      pageIndex,
      startIndex,
      endIndex,
    };

    // Return the Projects list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: Projects,
      pagination,
      message: "Projects received successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
};

exports.getProject = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var id = req.params.id;
  try {
    var Project = await Projectservice.getProject(id);

    // Return the Projects with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: Project,
      message: "Projects received successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
};

exports.createProject = async function (req, res, next) {
  try {
    req.body.auth_user_name = req?.userName || "";
    req.body.auth_user_id = req?.userId || "";

    var createdProject = await Projectservice.createProject(req.body);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: createdProject,
      message: "Project created successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
};

exports.updateProject = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body._id) {
    return res.status(200).json({ status: 200, flag: false, message: "Id must be present!" });
  }

  try {
    req.body.auth_user_name = req?.userName || "";
    req.body.auth_user_id = req?.userId || "";

    // Calling the Service function with the new object from the Request Body
    var updatedProject = await Projectservice.updateProject(req.body);
    if (updatedProject?._id && req.body?.type) {
      const description = req.body?.projectHistoryDescription
      await projectHistoryService.createProjectHistory({ ...req.body, description, project_id: req.body?._id })
    }

    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedProject,
      message: "Project updated successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
};

exports.removeProject = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res.status(200).json({ status: 200, flag: true, message: "Id must be present" });
  }

  try {
    var deleted = await Projectservice.updateProject({ _id: id, deletedAt: new Date() });

    return res.status(200).send({
      status: 200,
      flag: true,
      message: "Project deleted successfully.",
    });
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}
