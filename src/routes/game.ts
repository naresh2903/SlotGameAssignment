import { Router, Request, Response } from 'express';
import { IResponse } from '../IFramework/response/IResponse';
import { ReelSet } from '../IFramework/math/gameInfo';
import { addWildAtMiddlePos, createScreenSymbolSet } from '../IFramework/helper/helper';
import { playCascade } from '../IFramework/feature/Feature';

const router = Router();

export let cheatTool = false;
export let isForcingPositions = false;
export let forcedPositions: number[] = [];
export let rngUsed: number[] = [];


function cheatToolForce(force: number[]): void {
    forcedPositions = [];
    if (cheatTool && Array.isArray(force)) {
        isForcingPositions = true;
        for (let i = force.length - 1; i >= 0; i--) {
            forcedPositions.push(force[i]);
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
router.post('/spin', async (req: Request, res: Response) => {
    rngUsed = [];
    const bet = req.body.bet;
    const force = req.body.force; // Extract the global array from the request

    // Enable the cheat tool if needed (could be set based on some condition or request)
    cheatTool = true;

    let response: IResponse[] = [];

    // Use the cheat tool force functionality to set forced positions
    cheatToolForce(force);

    // Step 1: Generate 5X3 grid and middle symbol 
    const grid = await createScreenSymbolSet(ReelSet);

    // Step 2: reel 3 and col 2 always have WILD symbols
    addWildAtMiddlePos(grid.screen);

    // Step 3: play cascade feature
    response = await playCascade(grid.screen, bet, response);

    // Final response
    res.json({ request: { bet }, response, rngUsed: rngUsed });
});

export default router;