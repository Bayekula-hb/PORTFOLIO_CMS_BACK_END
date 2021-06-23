const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 4000;
app.set("port", PORT);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Serveur sur le port ${PORT} `);
});