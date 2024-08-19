"use strict";
// import { IFeatureWeight } from "../random/IFeatureWeight";
// export function getSelectedFeatureNoCheatLocalRNG(
//     featureWeight: IFeatureWeight[]
// ): IFeatureWeight {
//     let sumOfWeight = 0;
//     featureWeight.forEach((featureWeight) => {
//         sumOfWeight += featureWeight.weight;
//     });
//     const randomNumber: number = getRandomNumber(0, sumOfWeight - 1);
//     let randomIndex = 0;
//     let sum = 0;
//     for (let i = 0; i < featureWeight.length; i++) {
//         sum += featureWeight[i].weight;
//         if (sum > randomNumber) {
//             break;
//         }
//         randomIndex++;
//     }
//     return featureWeight[randomIndex];
// }
// export function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
// export function replaceGridSymbol(grid: number[][], symbolToReplace: number, newSymbol: string[] | number[]): any[][] {
//     const symbols = [...newSymbol]; // Create a copy of the newSymbol array
//     let lastAvailableSymbol: number | string | null = null; // Initialize lastAvailableSymbol
//     return grid.map(element => {
//         return element.map(ele => {
//             if (ele === symbolToReplace) {
//                 if (symbols.length > 0) {
//                     const nextSymbol = typeof symbols[0] === "number" ? symbols.shift() : symbols.shift()?.toString();
//                     lastAvailableSymbol = nextSymbol; // Update lastAvailableSymbol
//                     return nextSymbol;
//                 } else {
//                     // Use the last available symbol
//                     return lastAvailableSymbol;
//                 }
//             } else {
//                 return ele;
//             }
//         });
//     });
// }
//# sourceMappingURL=RandomHelpers.js.map