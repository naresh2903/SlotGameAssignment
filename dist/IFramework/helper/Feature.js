"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
const GameConstants_1 = require("../constants/GameConstants");
const helper_1 = require("./helper");
const gameInfo_1 = require("../math/gameInfo");
class Feature {
    static addWildAtMiddlePos(grid) {
        grid[2][1] = gameInfo_1.Symbols.WILD;
    }
    static createScreenSymbolSet(symbolSet) {
        return __awaiter(this, void 0, void 0, function* () {
            let screen = [];
            for (let i = 0; i < GameConstants_1.GameConstants.REELS; i++) {
                let reel = [];
                for (let j = 0; j < GameConstants_1.GameConstants.ROWS; j++) {
                    let result = yield (0, helper_1.getSelectedFeature)(symbolSet[i]);
                    reel.push(result.params.symbol);
                }
                screen.push(reel);
            }
            return { screen };
        });
    }
}
exports.Feature = Feature;
//# sourceMappingURL=Feature.js.map