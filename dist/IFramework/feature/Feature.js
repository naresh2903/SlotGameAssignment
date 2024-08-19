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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playCascade = playCascade;
const GameConstants_1 = require("../constants/GameConstants");
const helper_1 = require("../helper/helper");
const gameInfo_1 = require("../math/gameInfo");
const service_1 = __importDefault(require("../winEvaluation/service"));
/**
 * Executes the cascading feature of the slot game.
 *
 * This function processes the slot game cascades by evaluating the current screen for wins, updating the screen
 * based on the wins, and accumulating the total win. It continues processing until no more wins are detected
 * or the maximum number of cascades is reached. The function also generates the final response including
 * symbol grids, total wins, and win details for each cascade.
 *
 * @param {number[][]} screen - The initial 2D array representing the slot machine grid. Each element in the array
 *                              represents a symbol on the reel.
 * @param {number} bet - The bet amount for each spin. This is used to calculate the win amounts.
 * @param {IResponse[]} response - An array of response objects, each containing details of a cascade, including
 *                                  symbol grids, total win, and win details. This array is updated with new
 *                                  cascades as the function processes each one.
 *
 * @returns {Promise<IResponse[]>} - A promise that resolves to an array of response objects. Each response object
 *                                    contains the updated symbol grid, total win, and win details for a cascade.
 */
function playCascade(screen, bet, response) {
    return __awaiter(this, void 0, void 0, function* () {
        // Step 1: Inilialise the info
        const slotInfo = {
            Paytable: gameInfo_1.Paytable, // Add the appropriate paytable here
            LinesNumber: 3,
            ReelsNumber: 5,
            SlotName: 'Assignment',
            SlotId: 1
        };
        let currentWin = 0;
        let cascadeIndex = 1;
        let accumulatedWin = 0;
        let nextScreenForEvaluation = screen;
        const winDetails = [];
        // Step 2: Perform cascading logic
        do {
            let wildMultiplier = 1;
            const slotGameService = new service_1.default(slotInfo);
            const baseGameWin = slotGameService.evaluateWins(nextScreenForEvaluation, bet, wildMultiplier);
            currentWin = baseGameWin.totalWin;
            accumulatedWin += currentWin;
            // Step 3: Select Random WILD multiplier
            if (screen.some(row => row.includes(gameInfo_1.Symbols.WILD))) {
                wildMultiplier = (yield (0, helper_1.getSelectedFeature)(gameInfo_1.wildMultiplierInfo)).params.multiplier;
            }
            // Step 4: Create a new winDetail object for each cascade
            let winDetail = {
                wildMultiplier: wildMultiplier,
                win: currentWin,
                accumulatedWin: accumulatedWin,
                cascadeIndex: cascadeIndex,
                waysWins: baseGameWin.waysWins
            };
            // Step 5: Adding win details for the cascade wins.
            winDetails.push(winDetail);
            // Step 6: Creating the response object
            let spinResponse = {
                symbolGrid: nextScreenForEvaluation.map(row => [...row]), // Clone the screen
                totalWin: accumulatedWin,
                winDetails: [winDetail] // Push only the latest win detail
            };
            // Step 7: Push the current cascade response into response array
            response.push(spinResponse);
            const winningSymbolsList = (0, helper_1.getWinningSymbolsList)(winDetail); // generate the Winning symbols List
            if (currentWin > 0) {
                // Step 8: Updating cascadeIndex for each cascade when there is win.
                cascadeIndex++;
                // Step 9: Updating the symbolGrid with newly created grid with adding cascade symbols
                nextScreenForEvaluation = yield (0, helper_1.cascadeReels)(nextScreenForEvaluation, winningSymbolsList);
            }
        } while (currentWin > 0 && cascadeIndex <= 5); // when here is winning and there are max 5 cascades.
        // Step 10: calculating the cascade Index 
        const cascadeLastindex = response[response.length - 1].winDetails[0].cascadeIndex;
        // Step 11: When cascadeLastindex is 5 then we have to reset if there are winning and also reset the symbol grid with no Win case.
        if (cascadeLastindex === 5 && response[GameConstants_1.GameConstants.MAX_CASCADE_INDEX].winDetails && response[GameConstants_1.GameConstants.MAX_CASCADE_INDEX].winDetails[0].win > 0) {
            const generate5thGrid = yield (0, helper_1.generateCascadeScreenWithNoWin)(response[0]);
            response[response.length - 1].symbolGrid = generate5thGrid;
            response[response.length - 1].totalWin = response[response.length - 2].totalWin;
            let lastWinDetail = {
                wildMultiplier: 1,
                win: 0,
                waysWins: [],
                accumulatedWin: response[response.length - 1].totalWin,
                cascadeIndex: cascadeLastindex,
            };
            response[response.length - 1].winDetails = [lastWinDetail];
        }
        // Step 12: Return updated complete response.
        return response;
    });
}
//# sourceMappingURL=Feature.js.map