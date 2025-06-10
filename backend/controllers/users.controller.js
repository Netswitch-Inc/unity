var UserService = require('../services/user.service');
var jwt = require('jsonwebtoken');
var config = require('../config');

const { sendPlatformTypeEmail } = require('../helper');

// Saving the context of this module inside the _the variable
_this = this;

var superAdminRole = process.env?.SUPER_ADMIN_ROLE || "";
var companyAdminRole = process.env?.COMPANY_ADMIN_ROLE || "";
var frontWebUrl = process.env?.FRONT_WEB_URL || "";

exports.getUsers = async function (req, res, next) {
    try {
        var sort = req.query?.sort == "asc" ? 1 : -1;
        var sortColumn = req.query.sortColumn ? req.query.sortColumn : '_id';
        var page = Number(req.query?.page || 1);
        var limit = Number(req.query?.limit || 100);
        var search = req.query?.search || "";
        var pageIndex = 0;
        var startIndex = 0;
        var endIndex = 0;

        var query = { deletedAt: null };
        if (req.roleId) {
            if (req.roleId == superAdminRole) {
                query.role_id = { $ne: req.roleId };
            } else {
                var roleIds = [req.roleId];
                if (superAdminRole) { roleIds.push(superAdminRole); }
                if (companyAdminRole != req.roleId) {
                    roleIds.push(companyAdminRole);
                }

                roleIds = [... new Set(roleIds)];
                query.role_id = { $nin: roleIds };
            }
        }

        if (req.userId) {
            query._id = { $ne: req.userId };
        }
        if (req.query?.company_id) {
            query.company_id = req.query?.company_id;
        }

        if (search) {
            search = search.trim();
            query["$or"] = [
                { user_name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        var count = await UserService.getUserCount(query);
        var users = await UserService.getUsers(query, page, limit, sortColumn, sort)
        if (!users || !users.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                users = await UserService.getUsers(query, page, limit, sortColumn, sort)
            }
        }

        if (users && users.length) {
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

        return res.status(200).json({ status: 200, flag: true, data: users, pagination, message: "Users received successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getUser = async function (req, res, next) {
    var id = req.params.id;
    try {
        var User = await UserService.getUser(id);
        return res.status(200).json({ status: 200, flag: true, data: User, message: "User received successfully" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.checkIsEmailUnique = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var email = req.body.email;
    var id = req.body._id;
    try {
        var query = { email };
        if (id) { query._id = { $ne: id }; }
        var user = await UserService.getUserOne(query);
        if (user && user?._id) {
            return res.status(200).json({ status: 200, flag: false, message: "Email already taken." });
        } else {
            return res.status(200).json({ status: 200, flag: true, message: "Email is available." });
        }
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.checkIsUserUnique = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var user_name = req.body.user_name;
    var id = req.body?._id;

    try {
        var query = { user_name };
        if (id) { query._id = { $ne: id }; }
        var user = await UserService.getUserOne(query);
        if (user && user?._id) {
            return res.status(200).json({ status: 200, flag: false, message: "User name already taken." });
        } else {
            return res.status(200).json({ status: 200, flag: true, message: "User name is available." });
        }
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.checkUsernameExist = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    try {
        var userName = req.query?.user_name || "";
        var id = req.query?.id || "";
        if (!userName) {
            return res.status(200).json({ status: 200, flag: false, message: "Username must be present" });
        }

        var query = { user_name: userName };
        if (id) { query._id = { $ne: id }; }
        var user = await UserService.getUserOne(query);
        if (user && user?._id) {
            return res.status(200).json({ status: 200, flag: false, data: true, message: "User name already taken." });
        } else {
            return res.status(200).json({ status: 200, flag: true, data: false, message: "User name is available." });
        }
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, data: true, message: e.message });
    }
}

exports.checkEmailExist = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    try {
        var email = req.query?.email;
        var id = req.query?.id || "";
        if (!email) {
            return res.status(200).json({ status: 200, flag: false, message: "Email must be present" });
        }

        var query = { email };
        if (id) { query._id = { $ne: id }; }
        var user = await UserService.getUserOne(query);
        if (user && user?._id) {
            return res.status(200).json({ status: 200, flag: false, data: true, message: "Email already taken." });
        } else {
            return res.status(200).json({ status: 200, flag: true, data: false, message: "Email is available." });
        }
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, data: true, message: e.message });
    }
}

exports.createUser = async function (req, res, next) {
    try {
        var { email, user_name, password } = req.body;
        var companyId = req.companyId;
        if (!req.body?.company_id) {
            req.body.company_id = companyId;
        }

        if (!email || !user_name || !password) {
            return res.status(200).json({ status: 200, flag: false, message: "Email, username and password must be present" });
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

        var createdUser = await UserService.createUser(req.body);
        return res.status(200).json({ flag: true, data: createdUser, message: "User created successfully." })
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.updateUser = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present." });
    }

    try {
        if (req.body?.email) {
            var query = { email: req.body.email };
            if (req.body?._id) { query._id = { $ne: req.body._id } }
            var user = await UserService.getUserOne(query);
            if (user && user?._id) {
                return res.status(200).json({ status: 200, flag: false, message: "Email already taken." });
            }
        }

        if (req.body?.user_name) {
            var query = { user_name: req.body.user_name };
            if (req.body?._id) { query._id = { $ne: req.body._id } }
            var user = await UserService.getUserOne(query);
            if (user && user?._id) {
                return res.status(200).json({ status: 200, flag: false, message: "Username already taken." });
            }
        }

        req.body.auth_user_name = req?.userName || "";
        req.body.auth_user_id = req?.userId || "";

        var updatedUser = await UserService.updateUser(req.body);
        return res.status(200).json({ status: 200, flag: true, data: updatedUser, message: "User updated successfully." })
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.registerUser = async function (req, res, next) {
    try {
        var email = req.body.email;

        if (!email) {
            return res.status(200).json({ status: 200, flag: false, message: "Email must be present" })
        }
        var User = await UserService.getUserByEmail(email);

        if (User && User._id) {
            return res.status(200).json({ status: 200, flag: false, message: "Email already present" })
        } else {
            // Create User
            req.body.status = 1;
            var createdUser = await UserService.createUser(req.body);
            var createdUserData = await UserService.getUser(createdUser._id);

            var token1 = jwt.sign({
                id: createdUserData._id,
                user_name: createdUserData?.user_name || "",
                role_id: createdUserData?.role_id?._id || createdUserData?.role_id,
                company_id: createdUserData?.company_id?._id || createdUserData?.company_id
            }, process.env.SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });

            return res.status(200).json({ flag: true, new_user: true, data: createdUserData, token: token1, message: "User created successfully" })
        }
    } catch (e) {
        console.log(e)
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

// "Reset Password Instruction"
exports.forgotPassword = async function (req, res, next) {
    // console.log("forgotPassword ",req.body);
    var email = req.body.email;
    if (!email) {
        return res.status(200).json({ status: 200, flag: false, message: "Email must be present" });
    }

    try {
        var query = { email: email, status: 1 };
        var user = await UserService.getUserOne(query);
        if (user && user._id) {
            const token1 = jwt.sign({
                id: user._id,
                user_name: user?.user_name || "",
                role_id: user?.role_id?._id || user?.role_id,
                company_id: user?.company_id?._id || user?.company_id
            }, process.env.SECRET, {
                expiresIn: "15m"
            });

            if (user && user._id) {
                let mailItem = {
                    to: user?.email,
                    name: user?.first_name,
                    subject: "Reset Password request",
                    content: `<strong>Welcome to Unity</strong><p>Click below to reset your password. Note: Your link will be expired in 15 minutes. </p> <a href="${frontWebUrl}/resetpassword/${token1}">CLICK HERE</a>`
                }

                await sendPlatformTypeEmail(mailItem);
            }

            return res.status(200).json({
                status: 200,
                flag: true,
                data: { email: user.email },
                message: "Forgot password request initiated, please check your email.",
            });
        } else {
            flag = false;
            message = "This email is not registered with us.";
        }

        return res.status(200).json({ status: 200, flag: flag, message: message });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.resetPassword = async function (req, res, next) {
    const data = req.body;
    let flag = false;
    let message = '';

    try {
        // Verify the JWT token
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(data.token, config.SECRET, (err, decoded) => {
                if (err) {
                    return res.status(200).json({
                        status: 200,
                        flag: false,
                        message: 'Token is expired or not valid.'
                    });
                } else {
                    resolve(decoded);
                }
            });
        });

        // Set user details from decoded token
        req.userId = decoded.id;
        req.roleId = decoded.role_id;
        req.companyId = decoded?.company_id;

        // Fetch user
        const User = await UserService.getUser(req.userId);
        if (User && User._id) {
            // Update user's password
            const updatedUser = await UserService.updateUser({
                _id: User._id,
                password: data.password
            });

            // Fetch updated user to confirm password update
            const freshUser = await UserService.getUser(updatedUser._id);
            if (freshUser && freshUser._id) {
                return res.status(200).json({
                    status: 200,
                    flag: true,
                    message: "Password reset successfully",
                });
            } else {
                message = "Failed to reset password.";
            }
        } else {
            message = "User not found";
        }
    } catch (e) {
        // Handle errors
        message = 'Token is expired or not valid.';
    }

    // Send response
    return res.status(400).json({
        status: 400,
        flag: flag,
        message: message
    });
}

exports.loginUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    try {
        var User = {
            user_name: req.body?.user_name?.toLowerCase(),
            password: req.body.password
        }

        var loginUser = await UserService.loginUser(User);
        loginUser = await UserService.getUser(loginUser?._id);

        var token1 = jwt.sign({
            id: loginUser._id,
            user_name: loginUser?.user_name || "",
            role_id: loginUser?.role_id?._id || loginUser?.role_id,
            company_id: loginUser?.company_id?._id || loginUser?.company_id
        }, process.env.SECRET, {
            expiresIn: 86400
        });

        return res.status(200).json({ status: 200, flag: true, data: loginUser, token: token1, message: "User logged successfully." })
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.changePassword = async function (req, res, next) {
    var data = req.body;
    var id = req.userId
    if (!data.old_password || !data.password) {
        return res.status(200).json({
            status: 200,
            flag: false,
            message: "old password and new password must be present",
        })
    }

    try {
        var User = await UserService.checkUserPassword({ _id: id, password: data.old_password })
        if (User && User._id) {
            var updatedUser = await UserService.updateUser({ _id: User._id, password: data.password })
            updatedUser = await UserService.getUser(updatedUser._id);
            flag = true;
            message = "Password updated successfully!";
        } else {
            flag = false;
            message = "old password not matched!";
        }

        return res.status(200).json({ status: 200, flag: flag, message: message });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.updateUserProfile = async function (req, res, next) {
    // Id is necessary for the update
    try {
        req.body._id = req.userId;

        if (req.body?.email) {
            var query = { email: req.body.email };
            if (req.body?._id) { query._id = { $ne: req.body._id }; }
            var user = await UserService.getUserOne(query);
            if (user && user?._id) {
                throw new Error("Email already exists");
            }
        }

        if (req.body?.user_name) {
            var query = { user_name: req.body.user_name };
            if (req.body?._id) { query._id = { $ne: req.body._id }; }
            var user = await UserService.getUserOne(query);
            if (user && user?._id) {
                throw new Error("Username already exists");
            }
        }

        var updatedUser = await UserService.updateUser(req.body);
        updatedUser = await UserService.getUser(req.body._id);
        return res.status(200).json({ status: 200, flag: true, data: updatedUser, message: "User updated successfully" })
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.getUserProfile = async function (req, res, next) {
    try {
        var id = req.userId;
        var User = await UserService.getUser(id);
        return res.status(200).json({ status: 200, flag: true, data: User, message: "User received successfully" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.removeUser = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present" })
    }

    try {
        var payload = { _id: id, deletedAt: new Date(), status: 0 }
        if (req?.userName) { payload.auth_user_name = req.userName; }
        if (req?.userId) { payload.auth_user_id = req.userId; }

        var deleted = await UserService.updateUser(payload);
        return res.status(200).send({ status: 200, flag: true, message: "User deleted successfully" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}
