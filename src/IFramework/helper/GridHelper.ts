import { IWinData, position } from "../../models/winData";
import { ScreenTypes } from "../constants/enums";


/**
    * @param array 
    * @returns transposed Array
*/
export function transposeArray<T>(array: T[][]): T[][] {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

/**
   * @param array 
   * @returns boolean
*/
export function symbolIdExists(screen: number[][], symbolId: number): boolean {
    for (let row of screen) {
        if (row.includes(symbolId)) {
            return true;
        }
    }
    return false;
}

/**
    * @param screen grid
    * @returns the mirrored grid
*/
export function getMirroredGridColumnToRow(symbolGrid: number[][]): number[][] {
    let mirrorGrid: number[][] = [];
    for (let i = symbolGrid.length - 1; i >= 0; i--) {
        mirrorGrid.push(symbolGrid[i]);
    }
    return mirrorGrid
}

/**
 * 
 * @param payoutDetails 
 * @param numColumns 
 * @param screenType 
 */
export function addPositionsIWinData(payoutDetails: IWinData[], numColumns: number, screenType: ScreenTypes) {
    for (let i = 0; i < payoutDetails.length; i++) {
        let offsets: any = payoutDetails[i].offsets;
        let positionsOffsets: position[] = [];
        for (let j = 0; j < offsets.length; j++) {
            const position: position = (screenType == ScreenTypes.ROWxCOLUMN) ? {
                row: Math.floor(offsets[j] / numColumns),
                column: (offsets[j] % numColumns)
            } : {
                row: (offsets[j] % numColumns),
                column: Math.floor(offsets[j] / numColumns)
            };
            positionsOffsets.push(position);
        }
        payoutDetails[i].positions = positionsOffsets;
    }
}
