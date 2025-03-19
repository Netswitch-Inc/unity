// Getting  the Newly created Mongoose Model we just created
var User = require("../models/User.model");

var fs = require("fs");
var bcrypt = require("bcryptjs");
var publicPath = require("path").resolve("public");
var ImageService = require("../services/image.service");

const { createUpdateEventLog } = require("../helper");

// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the User List
exports.getUsers = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) {
        sorts[sortField] = sortType;
    }

    // Try Catch the awaited promise to handle the error
    try {
        var users = await User.find(query)
            .populate({ path: "role_id", select: "_id name" })
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        // Return the Userd list that was retured by the mongoose promise
        return users;
    } catch (e) {
        // return a Error message describing the reason
        throw Error(e.message, "Error while Paginating Users");
    }
}

exports.getUser = async function (id) {
    try {
        // Find the User
        var _details = await User.findOne({ _id: id })
            .populate({ path: "role_id", select: "_id name priviledge" })
            .populate({ path: "company_id", select: "_id name" });

        if (_details._id) {
            return _details;
        } else {
            throw Error("User not available");
        }
    } catch (e) {
        // return a Error message describing the reason
        throw Error("User not available");
    }
}

exports.getUserByEmail = async function (email) {
    try {
        // Find the User
        var _details = await User.findOne({ email: email });
        return _details;
    } catch (e) {
        // return a Error message describing the reason
        throw Error(e.message);
    }
}

exports.getUserByUserName = async function (userName) {
    try {
        // Find the User
        var _details = await User.findOne({ user_name: userName });
        return _details;
    } catch (e) {
        // return a Error message describing the reason
        throw Error(e.message);
    }
}

exports.getUserOne = async function (query) {
    try {
        if (query?.email) {
            query.email = query.email.toLowerCase();
        }

        if (query?.user_name) {
            query.user_name = query.user_name?.toLowerCase();
        }

        // Find the User
        var _details = await User.findOne(query);
        if (!_details) { return null; }

        return _details || null;
    } catch (e) {
        throw Error(e.message);
    }
}

const getUserDetail = async (query) => {
    try {
        // Find the User
        var user = await User.findOne(query)
            .populate({ path: "role_id", select: "_id name" })
            .populate({ path: "company_id", select: "_id name" });

        return user || null;
    } catch (e) {
        // return a Error message describing the reason
        return null;
    }
}

exports.createUser = async function (user) {
    if (!fs.existsSync(publicPath + "/images/users")) {
        fs.mkdirSync(publicPath + "/images/users", { recursive: true });
    }

    if (user?.image) {
        var isImage = await ImageService.saveImage(user.image, "/images/users/").then((data) => { return data; })

        if (typeof isImage != "undefined" && isImage != null && isImage != "") {
            user.image = isImage;
        }
    }

    if (!user?.name && user?.first_name && user?.last_name) {
        user.name = `${user.first_name} ${user.last_name}`;
    }

    if (user?.name && !user?.first_name) {
        var name = user.name.split(" ");
        if (name?.length) {
            user.first_name = name[0];
            if (name.length > 1) { user.last_name = name[name.length - 1]; }
        }
    }

    var newUser = new User({
        company_id: user.company_id ? user.company_id : null,
        role_id: user.role_id ? user.role_id : null,
        priviledges: user.priviledges ? user.priviledges : [],
        first_name: user.first_name ? user.first_name : "",
        last_name: user.last_name ? user.last_name : "",
        name: user.name ? user.name : "",
        user_name: user.user_name ? user.user_name.toLowerCase() : "",
        email: user?.email ? user.email?.toLowerCase() : "",
        password: user.password ? bcrypt.hashSync(user.password, 8) : "",
        country_code: user.country_code ? user.country_code : null,
        phone: user.phone ? user.phone : "",
        image: user.image ? user.image : "",
        retry_count: 0,
        weightIndex: user.weightIndex ? user.weightIndex : 1,
        status: user?.status ? 1 : 0,
        deletedAt: null
    })

    try {
        // Saving the User
        var savedUser = await newUser.save();
        if (savedUser?._id) {
            var currentData = await getUserDetail({ _id: savedUser._id });

            var updatedByName = user?.auth_user_name || currentData?.user_name || "";
            var description = `${savedUser?.name || "User"} created ${updatedByName ? `by ${updatedByName}` : ""
                }`;

            const payload = {
                reference_id: savedUser._id,
                company_id: currentData?.company_id?._id || currentData?.company_id,
                module_id: null,
                action_user_id: user?.auth_user_id || currentData._id,
                user_id: currentData._id,
                module_slug: "users",
                type: "users",
                action: "create",
                description,
                previous_data: null,
                current_data: currentData,
            };
            createUpdateEventLog(payload, "create", "users");
        }

        return savedUser;
    } catch (e) {
        // return a Error message describing the reason
        throw Error(e.message);
    }
}

exports.updateManyUsers = async function (query, user) {
    try {
        var users = await User.updateMany(query, user);
        return users;
    } catch (e) {
        // console.log("updateManyUsers catch >>> ", e);
        throw Error("Error occurred while updating the users");
    }
}

exports.getUserCount = async function (query) {
    try {
        var count = await User.find(query).count();

        return count;
    } catch (e) {
        throw Error("Error while Counting Company");
    }
}

exports.checkUserPassword = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User
        var _details = await User.findOne({ _id: user._id }).select("+password");
        var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
        if (!passwordIsValid) return null;
        return _details;
    } catch (e) {
        // return a Error message describing the reason
        throw Error("Error while Check User Password");
    }
}

exports.updateUser = async function (user) {
    var id = user._id;
    try {
        // Find the old User Object by the Id
        var oldUser = await User.findById(id);
    } catch (e) {
        throw Error("Error occurred while Finding the User");
    }

    // If no old User Object exists return false
    if (!oldUser) { return false; }

    var oldData = null;
    if (oldUser?._id) {
        oldData = await getUserDetail({ _id: oldUser._id });
    }

    if (user.company_id) {
        oldUser.company_id = user.company_id;
    }

    if (user.role_id) {
        oldUser.role_id = user.role_id;
    }

    if (user.priviledges) {
        oldUser.priviledges = user.priviledges;
    }

    if (user.first_name) {
        oldUser.first_name = user.first_name;
    }

    if (user.last_name) {
        oldUser.last_name = user.last_name;
    }

    if (!user?.name && user?.first_name && user?.last_name) {
        user.name = `${user.first_name} ${user.last_name}`;
    }

    if (user?.name && !user?.first_name) {
        var name = user.name.split(" ");
        if (name?.length) {
            user.first_name = name[0];
            if (name.length > 1) { user.last_name = name[name.length - 1]; }
        }
    }

    if (user.image) {
        if (!fs.existsSync(publicPath + "/images/users")) {
            fs.mkdirSync(publicPath + "/images/users", { recursive: true });
        }

        var isImage = await ImageService.saveImage(user.image, "/images/users/").then((data) => { return data; })

        if (typeof isImage != "undefined" && isImage != null && isImage != "") {
            if (oldUser.image != "images/users/default_profile_img.png") {
                try {
                    var filePath = publicPath + "/" + oldUser.image;
                    //console.log("\n filePath >>>>>>",filePath,"\n");
                    fs.unlinkSync(filePath);
                } catch (e) {
                    //console.log("\n\nImage Remove Issues >>>>>>>>>>>>>>\n\n");
                }
            }

            oldUser.image = isImage;
        }
    }

    if (user.name) {
        oldUser.name = user.name;
    }

    if (user.user_name) {
        oldUser.user_name = user.user_name.toLowerCase();
    }

    if (user.email) {
        oldUser.email = user.email;
    }

    if (user.password) {
        oldUser.password = bcrypt.hashSync(user.password, 8);
    }

    if (user.country_code) {
        oldUser.country_code = user.country_code;
    }

    if (user.phone) {
        oldUser.phone = user.phone;
    }

    if (user?.retry_count || user.retry_count == 0) {
        oldUser.retry_count = user?.retry_count || 0;
    }

    if (user.weightIndex) {
        oldUser.weightIndex = user.weightIndex;
    }

    if (user?.status || user.status == 0) {
        oldUser.status = user?.status || 0;
    }

    if (user?.deletedAt || user.deletedAt == "") {
        oldUser.deletedAt = user?.deletedAt || null;
    }

    try {
        var savedUser = await oldUser.save();
        if (savedUser?._id) {
            var action = "update";

            var currentData = await getUserDetail({ _id: savedUser._id });
            var updatedByName = user?.auth_user_name || currentData?.user_name || "";
            var description = `${savedUser?.name || "User"} updated ${updatedByName ? `by ${updatedByName}` : ""
                }`;
            if (savedUser?.deletedAt) {
                action = "delete";
                description = `${savedUser?.name || "User"} deleted ${updatedByName ? `by ${updatedByName}` : ""
                    }`;
            }

            const payload = {
                reference_id: savedUser._id,
                company_id: currentData?.company_id?._id || currentData?.company_id,
                module_id: null,
                action_user_id: user?.auth_user_id || currentData._id,
                user_id: currentData._id,
                module_slug: "users",
                type: "users",
                action: action,
                description,
                previous_data: oldData,
                current_data: currentData,
            };
            createUpdateEventLog(payload, action, "users");
        }

        return savedUser;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.deleteUser = async function (id) {
    // Delete the User
    try {
        var deleted = await User.remove({ _id: id });
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("User Could not be deleted.");
        }

        return deleted;
    } catch (e) {
        throw Error("Error occurred while deleting the user.");
    }
}

exports.loginUser = async function (user) {
    try {
        // Find the User
        var _details = await User.findOne({
            user_name: user.user_name,
            deletedAt: null,
        }).select("+password");

        if (!_details) {
            throw new Error("Invalid username or your account is deleted.");
        }

        if (_details.retry_count > 4) {
            await User.updateOne(
                { user_name: user.user_name },
                { $set: { status: 0 } }
            );
            throw new Error("Your account is deactivated, Please reach to support.");
        }

        var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
        if (!passwordIsValid) {
            const newRetryCount = _details.retry_count + 1;
            await User.updateOne(
                { user_name: user.user_name },
                { $set: { retry_count: newRetryCount } }
            );
            throw new Error("Invalid user password.");
        }

        // Reset retryCount on successful login
        await User.updateOne(
            { user_name: user.user_name },
            { $set: { retry_count: 0 } }
        );
        return _details;
    } catch (e) {
        // Return an error message describing the reason
        throw new Error(e.message || "Error while logging in user.");
    }
}

exports.softDeleteUser = async function (id) {
    // Delete the User
    try {
        var deleted = await User.updateOne(
            { _id: id },
            { $set: { deletedAt: new Date(), status: 0 } }
        );

        return deleted;
    } catch (e) {
        throw Error("Error occurred while deleting the user.");
    }
}
