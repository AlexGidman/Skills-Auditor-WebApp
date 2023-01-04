const app = require("../app");
const http = require("http");

const port = process.env.PORT || "8900";
app.set("port", port);

const server = http.createServer(app);
server.listen(port);
