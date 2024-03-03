import http from "http";
import myname, { myname1, myname2 } from "./feature.js";
import { chargePercentage } from "./feature.js";
import fs from "fs";
// const { log } = require("console");
// const http = require("http");
// const myname = require("./feature");

fs.readFile("./index.html", () => {
  console.log("File accessed !");
});

const home = fs.readFileSync("./index.html");

console.log(myname1);
console.log(chargePercentage());

const server = http.createServer((req, res, next) => {
  if (req.url === "/about") {
    res.end("<h1>Noice</h1>");
  }
  if (req.url === "/contact") {
    res.end("<h1>Contact</h1>");
  }
  if (req.url === "/") {
    // res.end(`<h1>Deviced is ${chargePercentage()} charged ! </h1>`);
    res.end(home);
  } else {
    res.end("Page not found");
  }
});

server.listen(5000, () => {
  console.log("Server is working 2");
});
