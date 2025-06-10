// ** Thrid Party library
import moment from "moment";

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";

// ** Checks if an object is empty (returns boolean)
const isObjEmpty = (obj) => Object.keys(obj).length === 0;

// ** Returns K format from a number
const kFormatter = (num) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num);

// ** Converts HTML to string
const htmlToString = (html) => html?.replace(/<\/?[^>]+(>|$)/g, "");

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
const formatDate = (value, formatting = { month: "short", day: "numeric", year: "numeric" }) => {
  if (!value) return value;
  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
}

const getFormatDate = (date, format = "MM-DD-YYYY") => {
  if (!date) { date = new Date(); }

  return moment(new Date(date)).format(format);
}

// ** Returns short month of passed date
const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: "short", day: "numeric" };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" };
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
}

const isUserLoggedIn = () => localStorage.getItem("userData");
const getUserData = () => JSON.parse(localStorage.getItem("userData"));

/* Get logged user from local storage */
const getCurrentUser = () => {
  let user = null;
  try {
    user = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;
  } catch (error) {
    console.log(">>>>: src/utility/Utils.js  : getCurrentUser -> error", error);
    user = null;
  }

  return user;
}

/* Set logged user on local storage  */
const setCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      localStorage.removeItem("userData");
    }
  } catch (error) {
    console.log(">>>>: src/utility/Utils.js : setCurrentUser -> error", error);
  }
}

/* Get logged user from local storage */
const logoutCurrentUser = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.log(">>>>: src/utility/Utils.js  : getCurrentUser -> error", error);
  }
}

/* Get access token or token from local storage */
const getAccessToken = () => {
  let token = null;
  try {
    token = localStorage.getItem("accessToken") !== null ? JSON.parse(localStorage.getItem("accessToken")) : null;
  } catch (error) {
    console.log(">>>>: src/utility/Utils.js  : getAccessToken -> error", error);
    token = null;
  }

  return token
}

/* Set access token or token on local storage */
const setAccessToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("accessToken", JSON.stringify(token));
    } else {
      localStorage.removeItem("accessToken");
    }
  } catch (error) {
    console.log(">>>>: src/utility/Utils.js : setAccessToken -> error", error);
  }
}

/* Get app setting from local storage */
const getLocalAppSetting = () => {
  let appSetting = null;
  try {
    appSetting = localStorage.getItem("lcl_app_setting") !== null ? JSON.parse(localStorage.getItem("lcl_app_setting")) : null;
  } catch (error) {
    console.log(">>>>: src/utility/Utils.js  : getLocalAppSetting -> error", error);
    appSetting = null;
  }

  return appSetting
}

/* Set app setting on local storage */
const setLocalAppSetting = (item = null) => {
  try {
    if (item) {
      localStorage.setItem("lcl_app_setting", JSON.stringify(item));
    } else {
      localStorage.removeItem("lcl_app_setting");
    }
  } catch (error) {
    console.log(">>>>: src/utility/Utils.js : setLocalAppSetting -> error", error);
  }
}

/* Return default image if server image not found */
const onImageSrcError = ({ currentTarget }, source = null) => {
  if (currentTarget) {
    currentTarget.onerror = null;
    currentTarget.src = source ?? defaultAvatar;
  }
}

const splitWithPipe = (value = "") => {
  if (value) {
    return value.split("|").filter(function (e) { return e !== "" })
  }

  return ""
}

const arrayJoinWithPipe = (values = []) => {
  if (values?.length) {
    return values?.join("|") || "";
  }

  return ""
}

/* Permission helper */
const getModulePermissionData = (permissions = null, moduleKey = "", groupModuleKey = "") => {
  let result = null;
  if (permissions && !isObjEmpty(permissions)) {
    result = { group: "", module: "", read: false, create: false, update: false, delete: false }

    if (groupModuleKey && moduleKey && permissions[groupModuleKey]) {
      result.group = groupModuleKey;
      result.module = moduleKey;
      const groupModule = permissions[groupModuleKey];
      if (groupModule && groupModule?.length) {
        const module = groupModule.find((x) => x.slug === moduleKey);
        if (module && module?._id) {
          result.read = module?.can_read || false;
          result.create = module?.can_create || false;
          result.update = module?.can_update || false;
          result.delete = module?.can_delete || false;
        }
      }
    }
  }

  return result;
}
/* /Permission helper */

// const scrollTop = () => {
//   window.scrollTo({ top: 0, behavior: "smooth" });
// };

const scrollTop = () => {
  window.requestAnimationFrame(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  })
}

function getExtension(filename) {
  return filename.split('.').pop()
}

const timeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 30) {
    return `${days} days ago`;
  } else if (months < 12) {
    return `${months} months ago`;
  } else {
    return `${years} years ago`;
  }
}

const bytesToMB = (bytes) => {
  if (typeof bytes !== 'number' || bytes < 0) {
    throw new Error('Input must be a non-negative number');
  }
  return (bytes / (1024 * 1024)).toFixed(2);
}

const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number' || bytes < 0) {
    throw new Error('Input must be a non-negative number');
  }

  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`; // Convert to KB
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`; // Convert to MB
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`; // Convert to GB
  }
}

const getDomailUrl = () => {
  let url = window?.location?.origin || "";
  if (!url && window?.location) {
    const protocol = window.location?.protocol || "";
    const host = window.location?.host || "";
    if (protocol && host) {
      url = `${protocol}//${host}`;
    }
  }

  return url
}

const getLastWeekTimestamp = () => {
  const currentDate = new Date();

  // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDay = currentDate.getDay();

  // Calculate how many days back we need to go to find Monday of last week
  const daysToLastMonday = currentDay + 6; // Start of last week (Monday)
  const lastMonday = new Date(currentDate);
  lastMonday.setDate(currentDate.getDate() - daysToLastMonday);

  // Set the time to 00:00:00 for the start of the day
  lastMonday.setHours(0, 0, 0, 0);

  // Get the end of last week (Sunday) by adding 6 days to last Monday
  const lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastMonday.getDate() + 6);
  lastSunday.setHours(23, 59, 59, 999); // Set time to the last moment of Sunday

  // Get the timestamps for the start (Monday) and end (Sunday) of last week
  const lastMondayTimestamp = lastMonday.getTime();
  const lastSundayTimestamp = lastSunday.getTime();

  return {
    gte: lastMondayTimestamp.toString(),  // Greater than or equal to last Monday
    lte: lastSundayTimestamp.toString()  // Less than or equal to last Sunday
  }
}

/* Return html value inside inner html */
const setInnerHtml = (value = "", classValue = "m-0") => {
  return (
    <div className={classValue} dangerouslySetInnerHTML={{ __html: value }} />
  )
}

/* Export functions */
export {
  isObjEmpty,
  kFormatter,
  htmlToString,
  formatDate,
  getFormatDate,
  formatDateToMonthShort,
  isUserLoggedIn,
  getUserData,
  getCurrentUser,
  setCurrentUser,
  logoutCurrentUser,
  getAccessToken,
  setAccessToken,
  getLocalAppSetting,
  setLocalAppSetting,
  onImageSrcError,
  getModulePermissionData,
  scrollTop,
  splitWithPipe,
  getExtension,
  timeAgo,
  bytesToMB,
  formatFileSize,
  getDomailUrl,
  getLastWeekTimestamp,
  arrayJoinWithPipe,
  setInnerHtml
}
