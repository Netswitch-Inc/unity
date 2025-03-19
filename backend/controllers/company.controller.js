var CompanyService = require("../services/company.service");
var UserService = require("../services/user.service");

// Saving the context of this module inside the _the variable
_this = this;

var superAdminRole = process.env?.SUPER_ADMIN_ROLE || "6694b16dc2bc754ae7c64e0a";
var companyAdminRole = process.env?.COMPANY_ADMIN_ROLE || "";

exports.getCompanies = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    try {
        var page = Number(req.query?.page || 1);
        var limit = Number(req.query?.limit || 100);
        var sort = req.query?.sort == "asc" ? 1 : -1;
        var sortColumn = req.query.sortColumn ? req.query.sortColumn : '_id';
        var search = req.query?.search || "";
        var pageIndex = 0;
        var startIndex = 0;
        var endIndex = 0;

        var query = { deletedAt: null };
        if (req.query?.search == "active") {
            query.status = 1;
        }

        if (search) {
            search = search.trim()
            query["$or"] = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        var count = await CompanyService.getCompanyCount(query);
        var companies = await CompanyService.getCompanies(query, page, limit, sortColumn, sort);
        if (!companies || !companies.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                companies = await CompanyService.getCompanies(query, page, limit, sortColumn, sort);
            }
        }

        if (companies && companies.length) {
            pageIndex = page - 1;
            startIndex = (pageIndex * limit) + 1;
            endIndex = Math.min(startIndex - 1 + limit, count);
        }

        var pagination = {
            pages: Math.ceil(count / limit),
            total: count,
            pageIndex,
            startIndex,
            endIndex
        }

        // Return the Roles list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: companies, pagination, message: "Company received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getCompany = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var Company = await CompanyService.getCompany(id);
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: Company, message: "Company received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createCompany = async function (req, res, next) {
    try {
        const { user_name, email, password } = req.body;
        if (!email || !user_name || !password) {
            return res.status(200).json({ status: 200, flag: false, message: "Email, username and password must be present" })
        }

        if (email) {
            var query = { email };
            var user = await UserService.getUserOne(query);
            if (user && user?._id) {
                return res.status(200).json({ status: 200, flag: false, message: "Email already taken." });
            }
        }

        if (user_name) {
            var query = { user_name };
            var user = await UserService.getUserOne(query);
            if (user && user?._id) {
                return res.status(200).json({ status: 200, flag: false, message: "Username already taken." });
            }
        }

        req.body.auth_user_name = req?.userName || "";
        req.body.auth_user_id = req?.userId || "";

        var createdCompany = await CompanyService.createCompany(req.body);
        if (createdCompany?._id) {
            const data = {
                name: req.body?.name || "",
                user_name: user_name,
                email: email,
                country_code: req.body?.country_code,
                phone: req.body?.contact_no,
                password: password,
                company_id: createdCompany._id,
                role_id: companyAdminRole,
                status: 1,
                auth_user_name: req?.userName || "",
                auth_user_id: req?.userId || ""
            }
            const creatUser = await UserService.createUser(data);
            if (creatUser?._id) {
                const payload = {
                    _id: createdCompany._id,
                    user_id: creatUser._id,
                    auth_user_name: req?.userName || "",
                    auth_user_id: req?.userId || ""
                }

                createdCompany = await CompanyService.updateCompany(payload);
                return res.status(200).json({ status: 200, flag: true, data: createdCompany, message: "Company created successfully." })
            }
        }
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.updateCompany = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present" })
    }

    if (!req.body?.email) {
        return res.status(200).json({ status: 200, flag: false, message: "Email must be present" })
    }

    try {
        if (req.body?.email) {
            var query = { email: req.body.email };
            if (req.body?.user_id) {
                var userId = req.body?.user_id?._id || req.body?.user_id;
                query._id = { $ne: userId };
            }

            var user = await UserService.getUserOne(query);
            if (user && user?._id) {
                return res.status(200).json({ status: 200, flag: false, message: "Email already taken." });
            }
        }

        req.body.auth_user_name = req?.userName || "";
        req.body.auth_user_id = req?.userId || "";

        var updatedCompany = await CompanyService.updateCompany(req.body);
        return res.status(200).json({ status: 200, flag: true, data: updatedCompany, message: "Company updated successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.softDeleteCompany = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present." });
    }
    try {
        var payload = { _id: id, deletedAt: new Date(), status: 0 }
        if (req?.userName) { payload.auth_user_name = req.userName; }
        if (req?.userId) { payload.auth_user_id = req.userId; }

        var deleted = await CompanyService.updateCompany(payload);
        if (deleted?._id && deleted?.deletedAt) {
            await UserService.updateManyUsers({
                company_id: id,
                role_id: { $ne: superAdminRole },
                status: 1,
                deletedAt: null
            }, {
                status: 0,
                deletedAt: new Date()
            });
        }

        return res.status(200).send({ status: 200, flag: true, message: "Company deleted successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}
