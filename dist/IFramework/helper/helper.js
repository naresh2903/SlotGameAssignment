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
exports.getSelectedFeature = getSelectedFeature;
exports.addWildAtMiddlePos = addWildAtMiddlePos;
exports.createScreenSymbolSet = createScreenSymbolSet;
exports.generateCascadeScreenWithNoWin = generateCascadeScreenWithNoWin;
exports.getUniqueOffsetList = getUniqueOffsetList;
exports.getWinningSymbolsList = getWinningSymbolsList;
exports.cascadeReels = cascadeReels;
const game_1 = require("../../routes/game");
const GameConstants_1 = require("../constants/GameConstants");
const gameInfo_1 = require("../math/gameInfo");
function getSelectedFeature(featureWeight) {
    return __awaiter(this, void 0, void 0, function* () {
        let sumOfWeight = 0;
        featureWeight.forEach((featureWeight) => {
            sumOfWeight += featureWeight.weight;
        });
        const randomNumber = game_1.forcedPositions.length > 0
            ? game_1.forcedPositions.pop()
            : Math.floor(Math.random() * sumOfWeight);
        game_1.rngUsed.push(randomNumber);
        // console.log(randomNumber)
        let randomIndex = 0;
        let sum = 0;
        for (const element of featureWeight) {
            sum += element.weight;
            if (sum > randomNumber) {
                break;
            }
            randomIndex++;
        }
        return featureWeight[randomIndex];
    });
}
function addWildAtMiddlePos(grid) {
    grid[2][1] = gameInfo_1.Symbols.WILD;
}
function createScreenSymbolSet(symbolSet) {
    return __awaiter(this, void 0, void 0, function* () {
        let screen = [];
        for (let i = 0; i < GameConstants_1.GameConstants.REELS; i++) {
            let reel = [];
            for (let j = 0; j < GameConstants_1.GameConstants.ROWS; j++) {
                let result = yield getSelectedFeature(symbolSet[i]);
                reel.push(result.params.symbol);
            }
            screen.push(reel);
        }
        return { screen };
    });
}
/**
 * This method will create an updated screen by adding cascade symbols.
 * @param response
 * @returns
 */
function generateCascadeScreenWithNoWin(response) {
    return __awaiter(this, void 0, void 0, function* () {
        const screen = response.symbolGrid;
        const uniqueOffsets = getUniqueOffsetList(response.winDetails);
        // Create sets for quick lookups
        const reel1Symbols = new Set(screen[0]);
        const reel2Symbols = new Set(screen.slice(1).flat());
        for (const offset of uniqueOffsets) {
            const reel = offset % 5;
            const row = Math.floor(offset / 5);
            // Fetch the symbol once per iteration
            const symbol = (yield getSelectedFeature(gameInfo_1.ReelSet[reel])).params.symbol;
            // Update symbolGrid based on reel index
            if (reel === 0 && !reel2Symbols.has(symbol)) {
                screen[reel][row] = symbol;
            }
            else if (reel !== 0 && !reel1Symbols.has(symbol)) {
                reel2Symbols.add(symbol);
                screen[reel][row] = symbol;
            }
        }
        return screen;
    });
}
/**
 * This method return a list of all unique offsets in a single list.
 * @param winDetails
 * @returns
 */
function getUniqueOffsetList(winDetails) {
    const allOffsets = [];
    winDetails.forEach((winDetail) => {
        var _a;
        (_a = winDetail.waysWins) === null || _a === void 0 ? void 0 : _a.forEach((win) => {
            allOffsets.push(...win.offsets); // Spread the offsets into the allOffsets array
        });
    });
    return allOffsets;
}
/**
 * This method returns a list of unique winning symbols.
 * @param winDetails
 * @returns
 */
function getWinningSymbolsList(winDetails) {
    var _a;
    let winningSymbols = [];
    (_a = winDetails.waysWins) === null || _a === void 0 ? void 0 : _a.forEach((waysWin) => {
        if (!winningSymbols.includes(waysWin.symbol)) {
            winningSymbols.push(waysWin.symbol);
        }
        if (waysWin.hasWildInWin && !winningSymbols.includes(gameInfo_1.Symbols.WILD)) {
            winningSymbols.push(gameInfo_1.Symbols.WILD);
        }
    });
    return winningSymbols;
}
/**
 * This method creats the updated cascade grid based on winnig Symbols.
 * @param screen
 * @param winningSymbols
 * @returns
 */
function cascadeReels(screen, winningSymbols) {
    return __awaiter(this, void 0, void 0, function* () {
        const rows = GameConstants_1.GameConstants.ROWS;
        const cols = GameConstants_1.GameConstants.REELS;
        // Step 1: Iterate over each column
        for (let col = 0; col < cols; col++) {
            let newColumn = [];
            // Step 2:  Collect non-winning symbols by iterating from bottom to top
            for (let row = rows - 1; row >= 0; row--) {
                if (!winningSymbols.includes(screen[col][row])) {
                    newColumn.unshift(screen[col][row]); // Add to the top of the new column
                }
            }
            // Step 3: Fill the rest with new symbols
            while (newColumn.length < rows) {
                let addUpdatedSymbol = (yield getSelectedFeature(gameInfo_1.ReelSet[col])).params.symbol;
                newColumn.unshift(addUpdatedSymbol);
            }
            // Step 4:  Update the column in the original screen
            for (let row = 0; row < rows; row++) {
                screen[col][row] = newColumn[row];
            }
        }
        return screen;
    });
}
//# sourceMappingURL=helper.js.map