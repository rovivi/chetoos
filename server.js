const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".wasm": "application/wasm",
    ".wasm": "application/wasm",

    ".memgz": "application/octet-stream",
    ".datagz": "application/octet-stream",
    ".unity3dgz": "application/octet-stream",
    ".jsgz": "application/javascript",
    ".*": "application/octet-stream"
};

const server = http.createServer(function (req, res) {
    let parsedUrl = url.parse(req.url);
    let pathname = `./public${parsedUrl.pathname}`;
    if (pathname === './public/') {
        pathname = './public/index.html';
    }

    fs.exists(pathname, function (exist) {
        if (!exist) {
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }

        if (fs.statSync(pathname).isDirectory()) {
            pathname += '/index.html';
        }

        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                const ext = path.parse(pathname).ext;
                let mimeType = mimeTypes[ext] || 'text/plain';

                // Serve gzipped files with the correct headers
                if (ext.endsWith('gz')) {
                    res.setHeader('Content-Encoding', 'gzip');
                    mimeType = mimeTypes[ext.slice(0, -2)] || mimeType;
                }

                res.setHeader('Content-type', mimeType);
                res.end(data);
            }
        });
    });
});

const PORT = 3000; // Puedes cambiar el puerto si lo deseas
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
