"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenTypes = exports.Ways = void 0;
var Ways;
(function (Ways) {
    Ways["LTR"] = "leftToRight";
    Ways["RTL"] = "rightToLeft";
    Ways["BOTH"] = "both"; // LTR + RTL
})(Ways || (exports.Ways = Ways = {}));
var ScreenTypes;
(function (ScreenTypes) {
    ScreenTypes["ROWxCOLUMN"] = "rowToColumn";
    ScreenTypes["COLUMNxROW"] = "columnToRow"; // Column to Row Screen => Arrays are formed reel Wise
})(ScreenTypes || (exports.ScreenTypes = ScreenTypes = {}));
//# sourceMappingURL=enums.js.map