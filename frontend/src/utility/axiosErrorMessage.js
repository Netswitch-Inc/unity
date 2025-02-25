const axiosErrorMessage = (response) => {
    let axiosError = "";
    const error = (response) => {
        if (response === 400) {
            axiosError = 'Error 400: HTTP Bad Request';
            return axiosError
        } else if (response === 401) {
            axiosError = 'Error 401:  HTTP status code error  ';
            return axiosError
        } else if (response === 500) {
            axiosError = 'Error 500: Internal Server Error';
            return axiosError
        } else if (response === 404) {
            axiosError = 'Error 404: Page Not Found';
            return axiosError
        } else if (response === 403) {
            axiosError = 'Error 403: Forbidden Error';
            return axiosError
        } else if (response !== 200 || 202) {
            axiosError = 'Error Occurred in processing';
            return axiosError
        }
    };

    return error(response)
}

export default axiosErrorMessage
