import { IWinData } from "./winData";

export interface IGameInfo {
    SlotName: string;
    SlotId: number;
}
export interface ISlotInfo extends IGameInfo {
    LinesNumber: number;
    ReelsNumber: number;
    MaxPaylines?: number;
    ReelLengths?: number[];
    Reels?: number[][];
    Paytable: number[][];
    Paylines?: number[][];
}

export interface IWinDescription {
    totalWin: number;
    lineWins?: IWinData[];
    waysWins?: IWinData[];
    scatterWin?: IWinData[];
    bonusWin?: any[];
    gambleState?: any;
    rngs?: number[];
    additional?: any;
}
