import { forcedPositions, rngUsed } from "../../routes/game";
import { GameConstants } from "../constants/GameConstants";
import { ReelSet, Symbols } from "../math/gameInfo";
import { IFeatureWeight } from "../random/IFeatureWeight";
import { IResponse, IWinDetails } from "../response/IResponse";

export async function getSelectedFeature(
    featureWeight: IFeatureWeight[],
): Promise<IFeatureWeight> {
    let sumOfWeight = 0;
    featureWeight.forEach((featureWeight) => {
        sumOfWeight += featureWeight.weight;
    });
    const randomNumber: number =
        forcedPositions.length > 0
            ? forcedPositions.pop() as number
            : Math.floor(Math.random() * sumOfWeight);
    
    rngUsed.push(randomNumber);
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
}

export function addWildAtMiddlePos(grid: number[][]) {
    grid[2][1] = Symbols.WILD;
}

export async function createScreenSymbolSet(symbolSet: IFeatureWeight[][]):
    Promise<{ screen: number[][] }> {
    let screen: number[][] = [];
    for (let i = 0; i < GameConstants.REELS; i++) {
        let reel: number[] = [];
        for (let j = 0; j < GameConstants.ROWS; j++) {
            let result = await getSelectedFeature(symbolSet[i]);
            reel.push(result.params.symbol);
        }
        screen.push(reel);
    }
    return { screen }
}


/**
 * This method will create an updated screen by adding cascade symbols.
 * @param response 
 * @returns 
 */
export async function generateCascadeScreenWithNoWin(response: IResponse): Promise<number[][]> {
    const screen = response.symbolGrid;
    const uniqueOffsets = getUniqueOffsetList(response.winDetails);

    // Create sets for quick lookups
    const reel1Symbols = new Set(screen[0]);
    const reel2Symbols = new Set(screen.slice(1).flat());

    for (const offset of uniqueOffsets) {
        const reel = offset % 5;
        const row = Math.floor(offset / 5);

        // Fetch the symbol once per iteration
        const symbol = (await getSelectedFeature(ReelSet[reel])).params.symbol;

        // Update symbolGrid based on reel index
        if (reel === 0 && !reel2Symbols.has(symbol)) {
            screen[reel][row] = symbol;
        } else if (reel !== 0 && !reel1Symbols.has(symbol)) {
            reel2Symbols.add(symbol);
            screen[reel][row] = symbol;
        }
    }

    return screen;
}

/**
 * This method return a list of all unique offsets in a single list.
 * @param winDetails 
 * @returns 
 */

export function getUniqueOffsetList(winDetails: IWinDetails[]): number[] {
    const allOffsets: number[] = [];
    winDetails.forEach((winDetail) => {
        winDetail.waysWins?.forEach((win) => {
            allOffsets.push(...win.offsets); // Spread the offsets into the allOffsets array
        })
    })
    return allOffsets;
}


/**
 * This method returns a list of unique winning symbols.
 * @param winDetails 
 * @returns 
 */
export function getWinningSymbolsList(winDetails: IWinDetails) {
    let winningSymbols: number[] = [];
    winDetails.waysWins?.forEach((waysWin) => {
        if (!winningSymbols.includes(waysWin.symbol)) {
            winningSymbols.push(waysWin.symbol)
        }
        if (waysWin.hasWildInWin && !winningSymbols.includes(Symbols.WILD)) {
            winningSymbols.push(Symbols.WILD);
        }
    })
    return winningSymbols;
}

/**
 * This method creats the updated cascade grid based on winnig Symbols.
 * @param screen 
 * @param winningSymbols 
 * @returns 
 */
export async function cascadeReels(screen: number[][], winningSymbols: number[]): Promise<number[][]> {
    const rows = GameConstants.ROWS;
    const cols = GameConstants.REELS;

    // Step 1: Iterate over each column
    for (let col = 0; col < cols; col++) {
        let newColumn: number[] = [];

        // Step 2:  Collect non-winning symbols by iterating from bottom to top
        for (let row = rows - 1; row >= 0; row--) {
            if (!winningSymbols.includes(screen[col][row])) {
                newColumn.unshift(screen[col][row]); // Add to the top of the new column
            }
        }

        // Step 3: Fill the rest with new symbols
        while (newColumn.length < rows) {
            let addUpdatedSymbol = (await getSelectedFeature(ReelSet[col])).params.symbol;
            newColumn.unshift(addUpdatedSymbol);
        }

        // Step 4:  Update the column in the original screen
        for (let row = 0; row < rows; row++) {
            screen[col][row] = newColumn[row];
        }
    }

    return screen;
}
