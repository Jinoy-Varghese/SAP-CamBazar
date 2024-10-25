const cds = require('@sap/cds');
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

cds.on('bootstrap', app => {
    app.use(fileUpload());

    app.post('/upload', (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        let uploadedFile = req.files.file;
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const filePath = path.join(uploadDir, uploadedFile.name);
        uploadedFile.mv(filePath, err => {
            if (err) return res.status(500).send(err);

            res.status(200).send({ file_url: filePath });
        });
    });
});

module.exports = cds.server;
