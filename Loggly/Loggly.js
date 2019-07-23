const winston = require('winston');
const {Loggly} = require('winston-loggly-bulk');

module.exports = winston.add(new Loggly({
    token: "bef6e76d-bb36-40b6-83a7-bb17ec7b81ca",
    subdomain: "yimycifuentes",
    tags: ["Winston-NodeJS"],
    json: true
}));




