"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
exports.default = {
    authorizationGenerator: function (username, accessKey) {
        return function (body, path) {
            var hash = crypto.createHash('sha256').update("" + body + path + accessKey).digest('hex');
            return "SharedKey " + Buffer.from(username + ":" + hash).toString('base64');
        };
    }
};
