import { ISlotInfo } from "../../models/interfaces";
import { Ways } from "../constants/enums";
import { IFeatureWeight } from "../random/IFeatureWeight";


export const Symbols = {
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


export const Paytable: number[][] = [
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

export const ReelSet: IFeatureWeight[][] = [
    [
        { weight: 3, params: { symbol: Symbols["1"] } },
        { weight: 3, params: { symbol: Symbols["2"] } },
        { weight: 7, params: { symbol: Symbols["3"] } },
        { weight: 5, params: { symbol: Symbols["4"] } },
        { weight: 11, params: { symbol: Symbols["5"] } },
        { weight: 7, params: { symbol: Symbols["6"] } },
        { weight: 12, params: { symbol: Symbols["7"] } },
        { weight: 5, params: { symbol: Symbols["8"] } },
        { weight: 12, params: { symbol: Symbols["9"] } }
    ],
    [
        { weight: 2, params: { symbol: Symbols["1"] } },
        { weight: 6, params: { symbol: Symbols["2"] } },
        { weight: 4, params: { symbol: Symbols["3"] } },
        { weight: 8, params: { symbol: Symbols["4"] } },
        { weight: 6, params: { symbol: Symbols["5"] } },
        { weight: 12, params: { symbol: Symbols["6"] } },
        { weight: 7, params: { symbol: Symbols["7"] } },
        { weight: 12, params: { symbol: Symbols["8"] } },
        { weight: 5, params: { symbol: Symbols["9"] } }
    ],
    [
        { weight: 3, params: { symbol: Symbols["1"] } },
        { weight: 3, params: { symbol: Symbols["2"] } },
        { weight: 7, params: { symbol: Symbols["3"] } },
        { weight: 5, params: { symbol: Symbols["4"] } },
        { weight: 11, params: { symbol: Symbols["5"] } },
        { weight: 7, params: { symbol: Symbols["6"] } },
        { weight: 12, params: { symbol: Symbols["7"] } },
        { weight: 5, params: { symbol: Symbols["8"] } },
        { weight: 12, params: { symbol: Symbols["9"] } }
    ],
    [
        { weight: 2, params: { symbol: Symbols["1"] } },
        { weight: 6, params: { symbol: Symbols["2"] } },
        { weight: 4, params: { symbol: Symbols["3"] } },
        { weight: 8, params: { symbol: Symbols["4"] } },
        { weight: 6, params: { symbol: Symbols["5"] } },
        { weight: 12, params: { symbol: Symbols["6"] } },
        { weight: 7, params: { symbol: Symbols["7"] } },
        { weight: 12, params: { symbol: Symbols["8"] } },
        { weight: 5, params: { symbol: Symbols["9"] } }
    ],
    [
        { weight: 3, params: { symbol: Symbols["1"] } },
        { weight: 3, params: { symbol: Symbols["2"] } },
        { weight: 7, params: { symbol: Symbols["3"] } },
        { weight: 8, params: { symbol: Symbols["4"] } },
        { weight: 11, params: { symbol: Symbols["5"] } },
        { weight: 7, params: { symbol: Symbols["6"] } },
        { weight: 12, params: { symbol: Symbols["7"] } },
        { weight: 5, params: { symbol: Symbols["8"] } },
        { weight: 12, params: { symbol: Symbols["9"] } }
    ]
];

export const wildMultiplierInfo: IFeatureWeight[] = [
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
]


export const ways: Ways = Ways.LTR;
interface ISlotInfoGame extends ISlotInfo {
    version: string;
    skipEvalFor: number[];
    wildSymbol: number[];
    ways: Ways;
}

export const TempleTwistInfo: ISlotInfoGame = {
    SlotName: "Assignment",
    SlotId: 1,
    LinesNumber: 3,
    ReelsNumber: 5,
    Paytable: Paytable,
    version: "0.0.1",
    Paylines: [],
    ReelLengths: [3, 3, 3, 3, 3],
    skipEvalFor: [0],
    wildSymbol: [0],
    ways: ways
};