import { ISlotInfo, IWinDescription } from "../../models/interfaces";
import { IWinData } from "../../models/winData";
import { Ways, ScreenTypes } from "../constants/enums";
import { transposeArray, getMirroredGridColumnToRow } from "../helper/GridHelper";

export default class WaysWinEvaluation {
    public info: ISlotInfo;
    constructor(info: ISlotInfo) {
        this.info = info;
    }
    /**
     * 
     * @param screen 
     * @param bet 
     * @param skipEvalFor those symbols which are not participate in the winning
     * @param wildCollection contains the wild symbol's id.
     * @param ways type of ways game(LTR,RTL,BOTH)
     * @param displayCombinedWin 
     * @param multiplier 
     * @param wildMultiplier 
     * @returns payout details of all the symbols.
     */
    public generateWins(screen: number[][], bet: number, skipEvalFor: number[], wildCollection: number[], ways: Ways, displayCombinedWin: boolean, screenType: ScreenTypes, multiplier: number, wildMultiplier: number): IWinDescription {
        const cloneScreen: number[][] = [...screen]; //clone the grid
        let slotWin: number = 0;
        const evaluationGrid = screenType === ScreenTypes.ROWxCOLUMN ? transposeArray(cloneScreen) : cloneScreen;
        let payoutDetails
        switch (ways) {
            case Ways.LTR: {
                payoutDetails = this.waysEvaluatorPayout(evaluationGrid, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
                break;
            }
            case Ways.RTL: {
                payoutDetails = this.evaluateWinsFromRightToLeft(evaluationGrid, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
                break;
            }
            case Ways.BOTH: {
                payoutDetails = this.evaluateBothWaysWin(evaluationGrid, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
                break;
            }
        }
        const winDescription: IWinDescription = this.calculateIWinDescription(payoutDetails);
        return winDescription;
    }

    /**
     * evaluate the left to right payout ways
     * @param screen 
     * @param bet 
     * @param skipEvalFor 
     * @param wildCollection 
     * @param displayCombinedWin 
     * @param multiplier 
     * @param wildMultiplier 
     * @param slotWin 
     * @returns 
     */
    protected waysEvaluatorPayout(screen: number[][], bet: number, skipEvalFor: number[], wildCollection: number[], displayCombinedWin: boolean, multiplier: number, wildMultiplier: number, slotWin: number): IWinData[] {
        const numOfColumns: number = screen.length;
        const symbolGrid: number[][] = JSON.parse(JSON.stringify(screen));
        const symbolList: IterableIterator<number> = this.getSymbolList(symbolGrid, wildCollection);
        let payoutDetails: IWinData[] = [];
        for (let symbol of symbolList) { //start the loop with symbolgrid
            if (!skipEvalFor.includes(symbol)) {
                const winSymbolsStops: string[] = [];
                const currentWinSymbolsStops: string[] = [];
                let flag: boolean = false;
                for (let j = 0; j < numOfColumns; j++) {
                    const numOfRows: number = symbolGrid[j].length;

                    for (let k = 0; k < numOfRows; k++) {
                        const nextSymbol: number = symbolGrid[j][k];
                        const nextSymbolOffset: number = numOfColumns * k + j;

                        if (nextSymbol === symbol || wildCollection.includes(nextSymbol)) {
                            if (j === 0) {
                                if (wildCollection.includes(nextSymbol)) {
                                    currentWinSymbolsStops.push(`${nextSymbolOffset}/${nextSymbolOffset}`);
                                } else {
                                    currentWinSymbolsStops.push(`/${nextSymbolOffset}`);
                                }
                            } else {
                                winSymbolsStops.forEach((winStops: string) => {
                                    let stops: string = winStops;
                                    if (wildCollection.includes(nextSymbol)) {
                                        if (winStops.split('/')[0].length > 0) {
                                            stops = `${winStops.split('/')[0]},${nextSymbolOffset}/${winStops.split('/')[1]}`;
                                        } else {
                                            stops = `${nextSymbolOffset}/${winStops.split('/')[1]}`;
                                        }
                                    }
                                    stops += `,${nextSymbolOffset}`;
                                    currentWinSymbolsStops.push(stops);
                                });
                            }
                            flag = true;
                        }
                    }

                    if (!flag) {
                        break;
                    }

                    winSymbolsStops.length = 0;
                    winSymbolsStops.push(...currentWinSymbolsStops);
                    currentWinSymbolsStops.length = 0;
                    flag = false;
                }
                let updatedWinSymbolsStops = [];
                if (!wildCollection.includes(symbol)) {
                    updatedWinSymbolsStops = winSymbolsStops.filter(symbolStops => {
                        const splitArry: string[] = symbolStops.split('/');
                        if (splitArry[0] != splitArry[1]) {
                            return symbolStops;
                        }
                    })
                } else {
                    updatedWinSymbolsStops.push(...winSymbolsStops);
                }
                let symbolsPayoutDetailsList: IWinData[] = (displayCombinedWin) ?
                    this.getCombineSymbolWinPayoutDetails(screen, bet, updatedWinSymbolsStops, symbol, multiplier, wildMultiplier, slotWin) :
                    this.getSymbolWinPayoutDetails(screen, bet, updatedWinSymbolsStops, symbol, multiplier, wildMultiplier, wildCollection, slotWin);
                if (symbolsPayoutDetailsList.length > 0) {
                    payoutDetails.push(...symbolsPayoutDetailsList);
                }
            }
        }
        return payoutDetails;
    }

    /**
     * this method evaluate RTL ways win.
     * @param screen 
     * @param bet 
     * @param skipEvalFor 
     * @param wildCollection 
     * @param displayCombinedWin 
     * @param multiplier 
     * @param wildMultiplier 
     * @param slotWin 
     * @returns 
     */
    protected evaluateWinsFromRightToLeft(screen: number[][], bet: number, skipEvalFor: number[], wildCollection: number[], displayCombinedWin: boolean, multiplier: number, wildMultiplier: number, slotWin: number): IWinData[] {
        let screenLength = screen.length;
        const mirroredGrid: number[][] = getMirroredGridColumnToRow(screen);
        const rightToLeftPayoutDetails: IWinData[] = this.waysEvaluatorPayout(mirroredGrid, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
        const updatedRightToLeftWinList: IWinData[] = rightToLeftPayoutDetails
            .filter((win: IWinData) => win.symbolCount !== screenLength)
            .map((win: IWinData) => {
                this.updateOffsetsRightToLeft(win, screenLength);
                return win;
            });
        return updatedRightToLeftWinList;
    }

    /**
     *  this method evaluate both ways win (RTL and LTR)
     * @param screen 
     * @param bet 
     * @param skipEvalFor 
     * @param wildCollection 
     * @param displayCombinedWin 
     * @param multiplier 
     * @param wildMultiplier 
     * @param slotWin 
     * @returns 
     */
    protected evaluateBothWaysWin(screen: number[][], bet: number, skipEvalFor: number[], wildCollection: number[], displayCombinedWin: boolean, multiplier: number, wildMultiplier: number, slotWin: number): IWinData[] {
        const leftToRightPayoutDetails: IWinData[] = this.waysEvaluatorPayout(screen, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
        const rightToLeftPayoutDetails: IWinData[] = this.evaluateWinsFromRightToLeft(screen, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
        let bothPayoutDetails: IWinData[] = [];
        bothPayoutDetails.push(...leftToRightPayoutDetails);
        bothPayoutDetails.push(...rightToLeftPayoutDetails);
        return bothPayoutDetails;
    }

    /**
     * 
     * @param winData contains the payoutDetails of waysWin.
     * @returns the IWinDescription of the WaysWins.
     */
    private calculateIWinDescription(winData: IWinData[]): IWinDescription {
        const payoutDetails: IWinDescription = {
            waysWins: winData,
            totalWin: winData.reduce((acc, cur) => acc + cur.totalWin, 0),
        }
        return payoutDetails;
    }


    /**
     * 
     * @param screen 
     * @param bet 
     * @param winSymbolsStops 
     * @param symbol 
     * @param multiplier 
     * @param wildMultiplier 
     * @param slotWin 
     * @returns the combined wins of each symbol.
     */

    protected getCombineSymbolWinPayoutDetails(screen: number[][], bet: number, winSymbolsStops: string[], symbol: number, multiplier: number, wildMultiplier: number | undefined, slotWin: number): IWinData[] {
        const symbolsPayoutDetailsList: IWinData[] = [];
        let isWildPresent: boolean = false;
        const winSymbolOffsets: Set<number> = new Set();
        let winSymbolCount: number = 0;
        let winSymbolPayout: number = 0;
        const winSymbolWithWildOffsets: Set<number> = new Set();
        let winSymbolWithWildCount: number = 0;
        let winSymbolWithWildPayout: number = 0;
        let symbolCount: number = 0;

        for (const stops of winSymbolsStops) {
            const winSymbolPos: string = stops.split('/')[1];
            const winWildSymbolPos: string = stops.split('/')[0];
            symbolCount = winSymbolPos.split(',').length;
            let wildCounts: number = 0;
            if (winWildSymbolPos !== '') {
                wildCounts = winWildSymbolPos.split(',').length;
            }
            let payout: number = this.getPayoutAsPerSymbol(symbol, symbolCount);
            if (payout > 0) {
                let isMultiplierApplied = false;

                if (wildCounts > 0) {
                    if (!isMultiplierApplied) {
                        payout = payout * bet * (multiplier || 1) * (wildMultiplier || 1);
                        isMultiplierApplied = true;
                    } else {
                        payout = payout * bet * (multiplier || 1);
                    }
                    isWildPresent = true;
                } else {
                    payout = payout * bet * (multiplier || 1);
                }

                if (wildCounts > 0 && wildMultiplier !== 1) {
                    winSymbolWithWildPayout += payout;
                    winSymbolPos.split(',').forEach(offset => winSymbolWithWildOffsets.add(parseInt(offset)));
                    isWildPresent = true;
                    winSymbolWithWildCount++;
                } else {
                    winSymbolPayout += payout;
                    winSymbolPos.split(',').forEach(offset => winSymbolOffsets.add(parseInt(offset)));
                    winSymbolCount++;
                }
            }
        }

        if (winSymbolPayout > 0) {
            slotWin += winSymbolPayout;
            const payoutWinSate: IWinData = {
                symbol: symbol,
                offsets: [...winSymbolOffsets].sort((a, b) => a - b),
                hasWildInWin: isWildPresent,
                totalWin: winSymbolPayout,
                ways: winSymbolCount,
                symbolCount: symbolCount
            };
            symbolsPayoutDetailsList.push(payoutWinSate);
        }

        if (winSymbolWithWildPayout > 0) {
            slotWin += winSymbolWithWildPayout;
            const payoutWinSate: IWinData = {
                symbol: symbol,
                offsets: [...winSymbolWithWildOffsets].sort((a, b) => a - b),
                hasWildInWin: isWildPresent,
                totalWin: winSymbolWithWildPayout,
                ways: winSymbolWithWildCount,
                symbolCount: symbolCount
            };
            symbolsPayoutDetailsList.push(payoutWinSate);
        }





        return symbolsPayoutDetailsList;
    }

    /**
     * 
     * @param screen 
     * @param bet 
     * @param winSymbolsStops 
     * @param symbol 
     * @param multiplier 
     * @param wildMultiplier 
     * @param wildCollection 
     * @param slotWin 
     * @returns 
     */
    protected getSymbolWinPayoutDetails(screen: number[][], bet: number, winSymbolsStops: string[], symbol: number, multiplier: number | undefined, wildMultiplier: number | undefined, wildCollection: number[], slotWin: number): IWinData[] {
        const symbolsPayoutDetailsList: IWinData[] = [];
        let isWildPresent: boolean = false;

        for (const stops of winSymbolsStops) {
            const winSymbolPos: string = stops.split('/')[1];
            const symbolCount: number = winSymbolPos.split(',').length;
            const wildCounts: number = stops.split('/')[0] !== '' ? stops.split('/')[0].split(',').length : 0;
            let payout: number = this.getPayoutAsPerSymbol(symbol, symbolCount);
            let winLineId: number = -1;

            let isMultiplierApplied = false;

            if (wildCounts > 0) {
                if (!isMultiplierApplied) {
                    payout = payout * bet * (multiplier || 1) * (wildMultiplier || 1);
                    isMultiplierApplied = true;
                } else {
                    payout = payout * bet * (multiplier || 1);
                }
                isWildPresent = true;
            } else {
                payout = payout * bet * (multiplier || 1);
            }

            if (payout > 0) {
                slotWin += payout;
                const payoutWinSate: IWinData =
                {
                    symbol: symbol,
                    offsets: winSymbolPos.split(',').map((sym: string) => parseInt(sym)).sort((a, b) => a - b),
                    hasWildInWin: isWildPresent,
                    totalWin: payout,
                    ways: 1,
                    symbolCount: symbolCount
                };

                symbolsPayoutDetailsList.push(payoutWinSate);
            }
        }
        return symbolsPayoutDetailsList;
    }

    /**
     * 
     * @param symbol 
     * @param symbolCount 
     * @returns 
     */
    private getPayoutAsPerSymbol(symbol: number, symbolCount: number): number {
        let payout: number = 0;
        for (let i = 0; i < this.info.Paytable.length; i++) {
            if (i === symbol) {
                payout += this.info.Paytable[i][symbolCount];
            }
        }
        return payout;
    }

    /**
     * 
     * @param payoutDetailsListRightToLeft 
     * @param gridLength 
     * @returns 
     */
    protected updateOffsetsRightToLeft(payoutDetailsListRightToLeft: IWinData, gridLength: number): IWinData {
        const payoutOffset: number[] = payoutDetailsListRightToLeft.offsets;
        const updatedOffsets: number[] = [];

        for (const offsetRightToLeft of payoutOffset) {
            const row: number = Math.floor(offsetRightToLeft / gridLength);
            const col: number = offsetRightToLeft % gridLength;
            const offsetLeftToRight: number = gridLength + gridLength * row - 1 - col;
            updatedOffsets.push(offsetLeftToRight);
        }
        updatedOffsets.sort((a, b) => a - b)
        payoutDetailsListRightToLeft.offsets = updatedOffsets;
        return payoutDetailsListRightToLeft;
    }


    /**
     * 
     * @param grid this is a 3X5 grid
     * @returns the set of unique symbols which is on grid
     */
    protected getSymbolList(screen: number[][], wildCollection: number[]): IterableIterator<number> {
        const list: number[] = [...wildCollection];

        for (const reel of screen) {
            let wildIncluded: boolean = false;
            for (const symbol of reel) {
                if (wildCollection.includes(symbol)) {
                    wildIncluded = true;
                } else if (!list.includes(symbol)) {
                    list.push(symbol);
                }
            }
            if (!wildIncluded) {
                break;
            }
        }
        list.sort((a, b) => a - b);
        return list[Symbol.iterator]();
    }
}