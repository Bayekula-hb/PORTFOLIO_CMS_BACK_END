const http = require("http");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 4050;
app.set("port", PORT);

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Serveur sur le port ${PORT} `);
});