"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../constants/enums");
const GameConstants_1 = require("../constants/GameConstants");
const WaysWinEvaluation_1 = __importDefault(require("../evaluation/WaysWinEvaluation"));
const gameInfo_1 = require("../math/gameInfo");
class SlotGameService {
    constructor(slotInfo) {
        this.slotInfo = slotInfo;
    }
    evaluateWins(screen, bet, currentWildMultiplier) {
        const skipEvalFor = []; // Populate with appropriate symbols to skip
        const wildCollection = [gameInfo_1.Symbols.WILD]; // Populate with appropriate wild symbols
        const ways = enums_1.Ways.LTR; // e.g., Ways.LTR
        const screenType = GameConstants_1.GameConstants.SCREEN_TYPE; // e.g., ScreenTypes.ROWxCOLUMN
        const multiplier = GameConstants_1.GameConstants.MULTIPLIER; // e.g., 1
        const wildMultiplier = currentWildMultiplier; // e.g., 1
        const waysWinEvaluator = new WaysWinEvaluation_1.default(this.slotInfo);
        const baseGameWin = waysWinEvaluator.generateWins(screen, bet, skipEvalFor, wildCollection, ways, GameConstants_1.GameConstants.DISPLAY_COMBINE_WINS, screenType, multiplier, wildMultiplier);
        return baseGameWin;
    }
}
exports.default = SlotGameService;
//# sourceMappingURL=service.js.map