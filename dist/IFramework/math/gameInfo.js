"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempleTwistInfo = exports.ways = exports.wildMultiplierInfo = exports.ReelSet = exports.Paytable = exports.Symbols = void 0;
const enums_1 = require("../constants/enums");
exports.Symbols = {
    WILD: 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
};
exports.Paytable = [
    [0, 0, 0, 0, 0, 0], //WILD
    [0, 0, 0, 40, 75, 150], // 1
    [0, 0, 0, 20, 40, 80], // 2
    [0, 0, 0, 15, 30, 60], // 3
    [0, 0, 0, 12, 25, 50], // 4
    [0, 0, 0, 10, 20, 40], // 5
    [0, 0, 0, 10, 20, 40], // 6
    [0, 0, 0, 8, 12, 25], // 7
    [0, 0, 0, 8, 12, 25], // 8
    [0, 0, 0, 4, 8, 16], // 9
];
exports.ReelSet = [
    [
        { weight: 3, params: { symbol: exports.Symbols["1"] } },
        { weight: 3, params: { symbol: exports.Symbols["2"] } },
        { weight: 7, params: { symbol: exports.Symbols["3"] } },
        { weight: 5, params: { symbol: exports.Symbols["4"] } },
        { weight: 11, params: { symbol: exports.Symbols["5"] } },
        { weight: 7, params: { symbol: exports.Symbols["6"] } },
        { weight: 12, params: { symbol: exports.Symbols["7"] } },
        { weight: 5, params: { symbol: exports.Symbols["8"] } },
        { weight: 12, params: { symbol: exports.Symbols["9"] } }
    ],
    [
        { weight: 2, params: { symbol: exports.Symbols["1"] } },
        { weight: 6, params: { symbol: exports.Symbols["2"] } },
        { weight: 4, params: { symbol: exports.Symbols["3"] } },
        { weight: 8, params: { symbol: exports.Symbols["4"] } },
        { weight: 6, params: { symbol: exports.Symbols["5"] } },
        { weight: 12, params: { symbol: exports.Symbols["6"] } },
        { weight: 7, params: { symbol: exports.Symbols["7"] } },
        { weight: 12, params: { symbol: exports.Symbols["8"] } },
        { weight: 5, params: { symbol: exports.Symbols["9"] } }
    ],
    [
        { weight: 3, params: { symbol: exports.Symbols["1"] } },
        { weight: 3, params: { symbol: exports.Symbols["2"] } },
        { weight: 7, params: { symbol: exports.Symbols["3"] } },
        { weight: 5, params: { symbol: exports.Symbols["4"] } },
        { weight: 11, params: { symbol: exports.Symbols["5"] } },
        { weight: 7, params: { symbol: exports.Symbols["6"] } },
        { weight: 12, params: { symbol: exports.Symbols["7"] } },
        { weight: 5, params: { symbol: exports.Symbols["8"] } },
        { weight: 12, params: { symbol: exports.Symbols["9"] } }
    ],
    [
        { weight: 2, params: { symbol: exports.Symbols["1"] } },
        { weight: 6, params: { symbol: exports.Symbols["2"] } },
        { weight: 4, params: { symbol: exports.Symbols["3"] } },
        { weight: 8, params: { symbol: exports.Symbols["4"] } },
        { weight: 6, params: { symbol: exports.Symbols["5"] } },
        { weight: 12, params: { symbol: exports.Symbols["6"] } },
        { weight: 7, params: { symbol: exports.Symbols["7"] } },
        { weight: 12, params: { symbol: exports.Symbols["8"] } },
        { weight: 5, params: { symbol: exports.Symbols["9"] } }
    ],
    [
        { weight: 3, params: { symbol: exports.Symbols["1"] } },
        { weight: 3, params: { symbol: exports.Symbols["2"] } },
        { weight: 7, params: { symbol: exports.Symbols["3"] } },
        { weight: 8, params: { symbol: exports.Symbols["4"] } },
        { weight: 11, params: { symbol: exports.Symbols["5"] } },
        { weight: 7, params: { symbol: exports.Symbols["6"] } },
        { weight: 12, params: { symbol: exports.Symbols["7"] } },
        { weight: 5, params: { symbol: exports.Symbols["8"] } },
        { weight: 12, params: { symbol: exports.Symbols["9"] } }
    ]
];
exports.wildMultiplierInfo = [
    { weight: 1, params: { multiplier: 1 } },
    { weight: 1, params: { multiplier: 2 } },
    { weight: 1, params: { multiplier: 3 } },
    { weight: 1, params: { multiplier: 4 } },
    { weight: 1, params: { multiplier: 5 } },
    { weight: 1, params: { multiplier: 6 } },
    { weight: 1, params: { multiplier: 7 } },
    { weight: 1, params: { multiplier: 8 } },
    { weight: 1, params: { multiplier: 9 } },
    { weight: 1, params: { multiplier: 10 } }
];
exports.ways = enums_1.Ways.LTR;
exports.TempleTwistInfo = {
    SlotName: "Assignment",
    SlotId: 1,
    LinesNumber: 3,
    ReelsNumber: 5,
    Paytable: exports.Paytable,
    version: "0.0.1",
    Paylines: [],
    ReelLengths: [3, 3, 3, 3, 3],
    skipEvalFor: [0],
    wildSymbol: [0],
    ways: exports.ways
};
//# sourceMappingURL=gameInfo.js.map