export interface IWinData {
    symbol: number;
    symbolCount: number;
    lineIndex?: number;
    hasWildInWin?: boolean;
    totalWin: number;
    ways?: number;
    offsets: number[];
    positions?: position[];
}

export interface position {
    row: number;
    column: number;
}