// Saving the context of this module inside the _the variable
var base64ToImage = require('base64-to-image');

_this = this

// Async function to get the Test List
exports.saveImage = async function (imgString, imgSavePath) {
    try {
        const url = imgString;
        const imgName = "img-" + new Date().getTime() + '.jpg';
        const path = imagePath + imgName;

        var root_path = require('path').resolve('public');
        var imagePath = root_path + imgSavePath;

        console.log("\n root_path >>>>>>>>>>", imagePath, "\n");
        console.log("\n imagePath >>>>>>>>>>", imagePath, "\n");

        var isImage = await this.isValidUrl(imgString).then(data => {
            return data;
        });

        console.log("\n IsImage >>>>>>>>>>", isImage, "\n");

        if (isImage) {
            const url = imgString;
            const imgName = "img-" + new Date().getTime() + '.jpg';
            const path = imagePath + imgName;

            const fs = require('fs');
            const fetch = require('node-fetch');
            const response = await fetch(url);
            const buffer = await response.buffer();
            fs.writeFile(path, buffer, () =>
                console.log('finished downloading!', path));
            return (imgSavePath + imgName).replace(/^\/|\/$/g, '');
        } else {
            // Create New User image       
            var imageInfo = base64ToImage(imgString, imagePath);
            return (imgSavePath + imageInfo.fileName).replace(/^\/|\/$/g, '');
        }
    } catch (e) {
        console.log("\n\nImage update Issue >>>>>>>>>>>>>>\n\n");
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
