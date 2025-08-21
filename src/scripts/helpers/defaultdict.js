"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultDict = createDefaultDict;
function createDefaultDict(factory) {
    return new Proxy({}, {
        get: function (target, name) {
            if (name === 'then') {
                return undefined;
            }
            ;
            if (!(name in target)) {
                target[name] = factory();
            }
            return target[name];
        }
    });
}
