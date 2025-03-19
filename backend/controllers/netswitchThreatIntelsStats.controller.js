var NetSwitchThreatIntelStatsService = require("../services/netswitchThreatIntelStats.service");

// Saving the context of this module inside the _the variable
_this = this;

exports.getNetswitchThreatIntelsStats = async (req, res) => {
  try {
    var page = Number(req.query?.page || 1);
    var limit = Number(req.query?.limit || 100);
    var sort = req.query?.sort == "asc" ? 1 : -1;
    var sortColumn = req.query.sortColumn ? req.query.sortColumn : "_id";
    var pageIndex = 0;
    var startIndex = 0;
    var endIndex = 0;

    var search = req.query?.search || "";
    var country = req.query?.country || "";

    var query = { deletedAt: null };

    var countries = await NetSwitchThreatIntelStatsService.getNetswitchThreatIntelsDistinctStats("country") || []
    if (!country && countries?.length) { country = countries[0]; }

    if (country) { query.country = country; }

    if (search) {
      search = search.trim();
      query["$or"] = [
        { ip_address: { $regex: search, $options: "i" } },
        { as_number: { $regex: search, $options: "i" } },
        { comapny: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } }
      ]
    }

    var count = await NetSwitchThreatIntelStatsService.getNetswitchThreatIntelCountStats(query)

    var netSwitchThreatIntels = await NetSwitchThreatIntelStatsService.getNetswitchThreatIntelsStats(query, page, limit, sortColumn, sort)
    if (!netSwitchThreatIntels || !netSwitchThreatIntels.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        netSwitchThreatIntels = await NetSwitchThreatIntelStatsService.getNetswitchThreatIntelsStats(query, page, limit, sortColumn, sort)
      }
    }

    if (netSwitchThreatIntels && netSwitchThreatIntels.length) {
      pageIndex = page - 1;
      startIndex = pageIndex * limit + 1;
      endIndex = Math.min(startIndex - 1 + limit, count);
    }

    var pagination = {
      pages: Math.ceil(count / limit),
      total: count,
      pageIndex,
      startIndex,
      endIndex
    }

    return res.status(200).json({
      status: 200,
      flag: true,
      data: netSwitchThreatIntels,
      selectedCountry: country,
      countries,
      pagination,
      message: "NetSwitch Threat Intels received successfully.",
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.getNetswitchThreatIntelStats = async (req, res) => {
  try {
    var id = req.params.id;
    var netswitchThreatIntel = await NetSwitchThreatIntelStatsService.getNetswitchThreatIntelStats(id);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: netswitchThreatIntel,
      message: "Netswitch threat intel received successfully."
    });
  } catch (error) {
    return res.status(200).json({ message: error.message, flag: false, status: 200 });
  }
}

exports.createNetswitchThreatIntelStats = async (req, res) => {
  try {
    var newNetSwitchThreatIntel = await NetSwitchThreatIntelStatsService.createNetswitchThreatIntelStats(req.body);

    return res.status(201).json({
      status: 200,
      flag: true,
      data: newNetSwitchThreatIntel,
      message: "Netswitch threat intel created successfully."
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.createNetswitchThreatIntelBulkStats = async (req, res) => {
  try {
    var netSwitchThreatIntel = await NetSwitchThreatIntelStatsService.createManyNetswitchThreatIntelStats(req.body)

    return res.status(201).json({
      status: 200,
      flag: true,
      data: netSwitchThreatIntel,
      message: "Netswitch threat intel bulk created successfully."
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, error: error.message });
  }
}

exports.updateNetSwitchThreatIntelStats = async (req, res) => {
  if (!req.body?._id) {
    return res.status(200).json({ status: 200, flag: false, message: "Id must be present." });
  }

  try {
    var updateNetSwitchThreatIntel = await NetSwitchThreatIntelStatsService.updateNetSwitchThreatIntelStats(req.body);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: updateNetSwitchThreatIntel,
      message: "Netswitch threat intel updated successfully."
    })
  } catch (error) {
    return res.status(200).json({ status: 200, message: error.message, flag: false })
  }
}

exports.softDeleteNetSwitchThreatIntelStats = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res.status(200).json({ status: 200, flag: true, message: "Id must be present." });
  }

  try {
    var deleted = await NetSwitchThreatIntelStatsService.softDeleteNetSwitchThreatIntelStats(id);
    return res.status(200).send({
      status: 200,
      flag: true,
      message: "Netswitch threat intel deleted successfully."
    })
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.deleteManyNetSwitchThreatIntelStats = async (req, res, next) => {
  try {
    var query = {};
    var deleted = await NetSwitchThreatIntelStatsService.deleteManyNetSwitchThreatIntelStats(query);

    return res.status(200).json({ flag: true, status: 200, message: "Multiple records deleted successfully." });
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.getCountBasedOnCountryStats = async (req, res, next) => {
  try {
    var netSwitchThreatIntels = await NetSwitchThreatIntelStatsService.getTotalCountBasedOnCountryStats();
    return res.status(200).json({ status: 200, flag: true, data: netSwitchThreatIntels, message: "Counted All Data Successfully" })
  } catch (error) {
    console.log(error)
    return res.status(200).json({ status: 200, message: error.message, flag: false });
  }
}
