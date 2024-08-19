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
exports.rngUsed = exports.forcedPositions = exports.isForcingPositions = exports.cheatTool = void 0;
const express_1 = require("express");
const gameInfo_1 = require("../IFramework/math/gameInfo");
const helper_1 = require("../IFramework/helper/helper");
const Feature_1 = require("../IFramework/feature/Feature");
const router = (0, express_1.Router)();
exports.cheatTool = false;
exports.isForcingPositions = false;
exports.forcedPositions = [];
exports.rngUsed = [];
function cheatToolForce(force) {
    exports.forcedPositions = [];
    if (exports.cheatTool && Array.isArray(force)) {
        exports.isForcingPositions = true;
        for (let i = force.length - 1; i >= 0; i--) {
            exports.forcedPositions.push(force[i]);
        }
    }
}
/**
 * Handles POST requests to the /spin endpoint of the game API.
 *
 * This is the entry point for initiating a spin in the slot game. The endpoint processes the spin request,
 * generates the initial slot machine grid, performs cascading based on the slot game rules, and returns
 * the updated game state including the symbol grid, total win, and win details.
 *
 * API Endpoint: `http://localhost:3000/game/spin`
 *
 * **Request Body:**
 * - `bet` (number): The amount of the bet for the spin. Example: `{ "bet": 1 }`
 *
 * **Response:**
 * - A JSON object containing the response from the game, including details such as:
 *   - `symbolGrid`: The updated 2D array representing the slot machine grid after processing the spin.
 *   - `totalWin`: The total win amount for the current spin.
 *   - `winDetails`: An array of win details for each cascade, including wild multipliers, win amounts, and other relevant information.
 *
 * @param {Request} req - The request object containing the bet amount in the body.
 * @param {Response} res - The response object used to send back the result of the spin.
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the response is sent.
 */
router.post('/spin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    exports.rngUsed = [];
    const bet = req.body.bet;
    const force = req.body.force; // Extract the global array from the request
    // Enable the cheat tool if needed (could be set based on some condition or request)
    exports.cheatTool = true;
    let response = [];
    // Use the cheat tool force functionality to set forced positions
    cheatToolForce(force);
    // Step 1: Generate 5X3 grid and middle symbol 
    const grid = yield (0, helper_1.createScreenSymbolSet)(gameInfo_1.ReelSet);
    // Step 2: reel 3 and col 2 always have WILD symbols
    (0, helper_1.addWildAtMiddlePos)(grid.screen);
    // Step 3: play cascade feature
    response = yield (0, Feature_1.playCascade)(grid.screen, bet, response);
    // Final response
    res.json({ request: { bet }, response, rngUsed: exports.rngUsed });
}));
exports.default = router;
//# sourceMappingURL=game.js.map