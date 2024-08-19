"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transposeArray = transposeArray;
exports.symbolIdExists = symbolIdExists;
exports.getMirroredGridColumnToRow = getMirroredGridColumnToRow;
exports.addPositionsIWinData = addPositionsIWinData;
const enums_1 = require("../constants/enums");
/**
    * @param array
    * @returns transposed Array
*/
function transposeArray(array) {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}
/**
   * @param array
   * @returns boolean
*/
function symbolIdExists(screen, symbolId) {
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
function getMirroredGridColumnToRow(symbolGrid) {
    let mirrorGrid = [];
    for (let i = symbolGrid.length - 1; i >= 0; i--) {
        mirrorGrid.push(symbolGrid[i]);
    }
    return mirrorGrid;
}
/**
 *
 * @param payoutDetails
 * @param numColumns
 * @param screenType
 */
function addPositionsIWinData(payoutDetails, numColumns, screenType) {
    for (let i = 0; i < payoutDetails.length; i++) {
        let offsets = payoutDetails[i].offsets;
        let positionsOffsets = [];
        for (let j = 0; j < offsets.length; j++) {
            const position = (screenType == enums_1.ScreenTypes.ROWxCOLUMN) ? {
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
//# sourceMappingURL=GridHelper.js.map