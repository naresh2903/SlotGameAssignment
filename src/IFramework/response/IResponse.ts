import { IWinDescription } from "../../models/interfaces";
import { IWinData } from "../../models/winData";

export interface IResponse {
    symbolGrid: number[][];
    totalWin: number,
    winDetails: IWinDetails[],
}

export interface IWinDetails {
    waysWins?: IWinData[];
    wildMultiplier: number,
    win: number,
    accumulatedWin: number,
    cascadeIndex: number
}