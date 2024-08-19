"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../constants/enums");
const GridHelper_1 = require("../helper/GridHelper");
class WaysWinEvaluation {
    constructor(info) {
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
    generateWins(screen, bet, skipEvalFor, wildCollection, ways, displayCombinedWin, screenType, multiplier, wildMultiplier) {
        const cloneScreen = [...screen]; //clone the grid
        let slotWin = 0;
        const evaluationGrid = screenType === enums_1.ScreenTypes.ROWxCOLUMN ? (0, GridHelper_1.transposeArray)(cloneScreen) : cloneScreen;
        let payoutDetails;
        switch (ways) {
            case enums_1.Ways.LTR: {
                payoutDetails = this.waysEvaluatorPayout(evaluationGrid, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
                break;
            }
            case enums_1.Ways.RTL: {
                payoutDetails = this.evaluateWinsFromRightToLeft(evaluationGrid, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
                break;
            }
            case enums_1.Ways.BOTH: {
                payoutDetails = this.evaluateBothWaysWin(evaluationGrid, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
                break;
            }
        }
        const winDescription = this.calculateIWinDescription(payoutDetails);
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
    waysEvaluatorPayout(screen, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin) {
        const numOfColumns = screen.length;
        const symbolGrid = JSON.parse(JSON.stringify(screen));
        const symbolList = this.getSymbolList(symbolGrid, wildCollection);
        let payoutDetails = [];
        for (let symbol of symbolList) { //start the loop with symbolgrid
            if (!skipEvalFor.includes(symbol)) {
                const winSymbolsStops = [];
                const currentWinSymbolsStops = [];
                let flag = false;
                for (let j = 0; j < numOfColumns; j++) {
                    const numOfRows = symbolGrid[j].length;
                    for (let k = 0; k < numOfRows; k++) {
                        const nextSymbol = symbolGrid[j][k];
                        const nextSymbolOffset = numOfColumns * k + j;
                        if (nextSymbol === symbol || wildCollection.includes(nextSymbol)) {
                            if (j === 0) {
                                if (wildCollection.includes(nextSymbol)) {
                                    currentWinSymbolsStops.push(`${nextSymbolOffset}/${nextSymbolOffset}`);
                                }
                                else {
                                    currentWinSymbolsStops.push(`/${nextSymbolOffset}`);
                                }
                            }
                            else {
                                winSymbolsStops.forEach((winStops) => {
                                    let stops = winStops;
                                    if (wildCollection.includes(nextSymbol)) {
                                        if (winStops.split('/')[0].length > 0) {
                                            stops = `${winStops.split('/')[0]},${nextSymbolOffset}/${winStops.split('/')[1]}`;
                                        }
                                        else {
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
                        const splitArry = symbolStops.split('/');
                        if (splitArry[0] != splitArry[1]) {
                            return symbolStops;
                        }
                    });
                }
                else {
                    updatedWinSymbolsStops.push(...winSymbolsStops);
                }
                let symbolsPayoutDetailsList = (displayCombinedWin) ?
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
    evaluateWinsFromRightToLeft(screen, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin) {
        let screenLength = screen.length;
        const mirroredGrid = (0, GridHelper_1.getMirroredGridColumnToRow)(screen);
        const rightToLeftPayoutDetails = this.waysEvaluatorPayout(mirroredGrid, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
        const updatedRightToLeftWinList = rightToLeftPayoutDetails
            .filter((win) => win.symbolCount !== screenLength)
            .map((win) => {
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
    evaluateBothWaysWin(screen, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin) {
        const leftToRightPayoutDetails = this.waysEvaluatorPayout(screen, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
        const rightToLeftPayoutDetails = this.evaluateWinsFromRightToLeft(screen, bet, skipEvalFor, wildCollection, displayCombinedWin, multiplier, wildMultiplier, slotWin);
        let bothPayoutDetails = [];
        bothPayoutDetails.push(...leftToRightPayoutDetails);
        bothPayoutDetails.push(...rightToLeftPayoutDetails);
        return bothPayoutDetails;
    }
    /**
     *
     * @param winData contains the payoutDetails of waysWin.
     * @returns the IWinDescription of the WaysWins.
     */
    calculateIWinDescription(winData) {
        const payoutDetails = {
            waysWins: winData,
            totalWin: winData.reduce((acc, cur) => acc + cur.totalWin, 0),
        };
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
    getCombineSymbolWinPayoutDetails(screen, bet, winSymbolsStops, symbol, multiplier, wildMultiplier, slotWin) {
        const symbolsPayoutDetailsList = [];
        let isWildPresent = false;
        const winSymbolOffsets = new Set();
        let winSymbolCount = 0;
        let winSymbolPayout = 0;
        const winSymbolWithWildOffsets = new Set();
        let winSymbolWithWildCount = 0;
        let winSymbolWithWildPayout = 0;
        let symbolCount = 0;
        for (const stops of winSymbolsStops) {
            const winSymbolPos = stops.split('/')[1];
            const winWildSymbolPos = stops.split('/')[0];
            symbolCount = winSymbolPos.split(',').length;
            let wildCounts = 0;
            if (winWildSymbolPos !== '') {
                wildCounts = winWildSymbolPos.split(',').length;
            }
            let payout = this.getPayoutAsPerSymbol(symbol, symbolCount);
            if (payout > 0) {
                let isMultiplierApplied = false;
                if (wildCounts > 0) {
                    if (!isMultiplierApplied) {
                        payout = payout * bet * (multiplier || 1) * (wildMultiplier || 1);
                        isMultiplierApplied = true;
                    }
                    else {
                        payout = payout * bet * (multiplier || 1);
                    }
                    isWildPresent = true;
                }
                else {
                    payout = payout * bet * (multiplier || 1);
                }
                if (wildCounts > 0 && wildMultiplier !== 1) {
                    winSymbolWithWildPayout += payout;
                    winSymbolPos.split(',').forEach(offset => winSymbolWithWildOffsets.add(parseInt(offset)));
                    isWildPresent = true;
                    winSymbolWithWildCount++;
                }
                else {
                    winSymbolPayout += payout;
                    winSymbolPos.split(',').forEach(offset => winSymbolOffsets.add(parseInt(offset)));
                    winSymbolCount++;
                }
            }
        }
        if (winSymbolPayout > 0) {
            slotWin += winSymbolPayout;
            const payoutWinSate = {
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
            const payoutWinSate = {
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
    getSymbolWinPayoutDetails(screen, bet, winSymbolsStops, symbol, multiplier, wildMultiplier, wildCollection, slotWin) {
        const symbolsPayoutDetailsList = [];
        let isWildPresent = false;
        for (const stops of winSymbolsStops) {
            const winSymbolPos = stops.split('/')[1];
            const symbolCount = winSymbolPos.split(',').length;
            const wildCounts = stops.split('/')[0] !== '' ? stops.split('/')[0].split(',').length : 0;
            let payout = this.getPayoutAsPerSymbol(symbol, symbolCount);
            let winLineId = -1;
            let isMultiplierApplied = false;
            if (wildCounts > 0) {
                if (!isMultiplierApplied) {
                    payout = payout * bet * (multiplier || 1) * (wildMultiplier || 1);
                    isMultiplierApplied = true;
                }
                else {
                    payout = payout * bet * (multiplier || 1);
                }
                isWildPresent = true;
            }
            else {
                payout = payout * bet * (multiplier || 1);
            }
            if (payout > 0) {
                slotWin += payout;
                const payoutWinSate = {
                    symbol: symbol,
                    offsets: winSymbolPos.split(',').map((sym) => parseInt(sym)).sort((a, b) => a - b),
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
    getPayoutAsPerSymbol(symbol, symbolCount) {
        let payout = 0;
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
    updateOffsetsRightToLeft(payoutDetailsListRightToLeft, gridLength) {
        const payoutOffset = payoutDetailsListRightToLeft.offsets;
        const updatedOffsets = [];
        for (const offsetRightToLeft of payoutOffset) {
            const row = Math.floor(offsetRightToLeft / gridLength);
            const col = offsetRightToLeft % gridLength;
            const offsetLeftToRight = gridLength + gridLength * row - 1 - col;
            updatedOffsets.push(offsetLeftToRight);
        }
        updatedOffsets.sort((a, b) => a - b);
        payoutDetailsListRightToLeft.offsets = updatedOffsets;
        return payoutDetailsListRightToLeft;
    }
    /**
     *
     * @param grid this is a 3X5 grid
     * @returns the set of unique symbols which is on grid
     */
    getSymbolList(screen, wildCollection) {
        const list = [...wildCollection];
        for (const reel of screen) {
            let wildIncluded = false;
            for (const symbol of reel) {
                if (wildCollection.includes(symbol)) {
                    wildIncluded = true;
                }
                else if (!list.includes(symbol)) {
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
exports.default = WaysWinEvaluation;
//# sourceMappingURL=WaysWinEvaluation.js.map