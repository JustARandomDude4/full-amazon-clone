import nc from "next-connect";
import cloudinary from "cloudinary";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { imgMiddleware } from "../../../middleware/imgMiddleware";
import fs from "fs";

cloudinary.config({
    cloud_name: "dl3mxscxh",
    api_key: "522772239751192",
    api_secret: "8qXohydKXJ4Hlix6cPdkrnWO_I0",
});

const handler = nc()
    .use(
        fileUpload({
            useTempFiles: true
        })
    )
    .use(imgMiddleware);

export const config = {
    api: {
        bodyParser: false,
    },
};

handler.post(async (req, res) => {
    try {
        const { path } = req.body;
        let files = Object.values(req.files).flat();
        let images = [];

        for (const file of files) {
            const img = await uploadToCloudinaryHandler(file, path);
            images.push(img);
            // removeTmp(file.tempFilePath);
        }
        

        res.json(images);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default handler;

handler.delete(async (req, res) => {
    let image_id = req.body.public_id;
    cloudinary.v2.uploader.destory(image_id, (err, res) => {
        if (err) return res.status(400).json({ success: false, err });
        res.json({ success: api});
    });
});

const uploadToCloudinaryHandler = async (file, path) => {
    console.log('file adddress: ', file.tempFilePath)
    
    return new Promise((reslove) => {
        cloudinary.v2.uploader.upload(
            file.tempFilePath,
            {
                folder: path,
            },
            (err, res) => {
                if (err) {
                    // removeTmp(file.tempFilePath);
                    console.log(err);
                    return res.status(400).json({ message: "upload image failed." });
                }
                reslove({
                    url: res.secure_url,
                    public_url: res.public_id,
                });
            }
        )
    });
};

// const removeTmp = (path) => {

//     fs.unlink(path, (err) => {
//         if (err) throw err;
//     });
// };