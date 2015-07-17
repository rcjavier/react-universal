import koa from "koa";
import serveStatic from "koa-static";
import compress from "koa-compress";
import bodyparser from "koa-bodyparser";
import path from "path";
import http from "http";
import proxy from "koa-proxy";
import errors from "./middleware/errors";
import react from "./middleware/react";
import ws from "./utils/ws-server";

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";
const app = koa();

if (ENV !== "production") {
  app.use(proxy({
    host: "http://localhost:8080",
    match: /^\/build\//
  }));
}

app.use(errors());
app.use(compress());
app.use(bodyparser());
app.use(serveStatic(path.join(__dirname, "../public")));
app.use(react());

const server = http.createServer(app.callback());
const socket = ws(server);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

