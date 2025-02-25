// const fs = require('fs');
// const path = require('path');

// exports.savefile = async function (fileString, fileSavePath, ext) {
//     try {
//         // Check if the fileString is a URL or base64 data
//         const isUrl = await this.isValidUrl(fileString);

//         // Create the file name and path
//         const fileName = "file-" + new Date().getTime() + `.${ext}`;
//         const rootPath = path.resolve('public');
//         const fullPath = path.join(rootPath, fileSavePath);
//         const filePath = path.join(fullPath, fileName);

//         // Ensure the directory exists
//         if (!fs.existsSync(fullPath)) {
//             fs.mkdirSync(fullPath, { recursive: true });
//         }

//         if (isUrl) {
//             // Download the file from the URL
//             const fetch = require('node-fetch');

//             const response = await fetch(fileString);
//             if (!response.ok) throw new Error('Failed to fetch file from URL');
//             const buffer = await response.buffer();
//             await fs.promises.writeFile(filePath, buffer);
//             console.log('Finished downloading!', filePath);
//         }
//         // Return the relative path of the saved file
//         return path.join(fileSavePath, fileName).replace(/^\/|\/$/g, '');
//     } catch (e) {
//         console.error('File update issue:', e.message);
//         throw e; // Rethrow the error after logging it
//     }
// }

// exports.isValidUrl = function (string) {
//     try {
//         const url = new URL(string);
//         return url.protocol === "http:" || url.protocol === "https:";
//     } catch (_) {
//         return false;
//     }
// }






// Saving the context of this module inside the _the variable

_this = this

// Async function to get the Test List
exports.savefile = async function (fileString, fileSavePath) {
    try {
        const url = fileString;
        const fileName = "file-" + new Date().getTime() + '.jpg';
        const path = filePath + fileName;

        var root_path = require('path').resolve('public');
        var filePath = root_path + fileSavePath;

        console.log("\n root_path >>>>>>>>>>", filePath, "\n");
        console.log("\n filePath >>>>>>>>>>", filePath, "\n");

        var isfile = await this.isValidUrl(fileString).then(data => {
            return data;
        });

        console.log("\n Isfile >>>>>>>>>>", isfile, "\n");
        var base64Tofile = require('base64-to-file');

        if (isfile) {
            const url = fileString;
            const fileName = "file-" + new Date().getTime() + '.jpg';
            const path = filePath + fileName;

            const fs = require('fs');
            const fetch = require('node-fetch');
            const response = await fetch(url);
            const buffer = await response.buffer();
            fs.writeFile(path, buffer, () =>
                console.log('finished downloading!', path));
            return (fileSavePath + fileName).replace(/^\/|\/$/g, '');
        } else {
            // Create New User file       
            var fileInfo = base64Tofile(fileString, filePath);
            return (fileSavePath + fileInfo.fileName).replace(/^\/|\/$/g, '');
        }
    } catch (e) {
        console.log("\n\nfile update Issue >>>>>>>>>>>>>>\n\n");
    }
}

exports.isValidUrl = async function (string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}
