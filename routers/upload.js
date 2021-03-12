const express = require("express");
const multer = require("multer");
const { authentication } = require("../helpers/authentication");

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination: "img",
        filename(req, file, done) {
            const name = Date.now() + "-" + file.originalname;
            done(null, name);
        },
    }),
});

router.post(
    "/upload/avatar",
    authentication(),
    upload.single("data"),
    async (req, res) => {
        const { path } = req.file;
        req.user.profile.avatar = path;
        const result = await req.user.save();
        res.send(result);
    }
);

module.exports = router;
