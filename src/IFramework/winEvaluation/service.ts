import { ISlotInfo, IWinDescription } from "../../models/interfaces";
import { Ways } from "../constants/enums";
import { GameConstants } from "../constants/GameConstants";
import WaysWinEvaluation from "../evaluation/WaysWinEvaluation";
import { Symbols } from "../math/gameInfo";


class SlotGameService {
    private slotInfo: ISlotInfo;

    constructor(slotInfo: ISlotInfo) {
        this.slotInfo = slotInfo;
    }

    public evaluateWins(screen: number[][], bet: number, currentWildMultiplier: number): IWinDescription {
        const skipEvalFor: number[] = [];  // Populate with appropriate symbols to skip
        const wildCollection: number[] = [Symbols.WILD]; // Populate with appropriate wild symbols
        const ways = Ways.LTR; // e.g., Ways.LTR
        const screenType = GameConstants.SCREEN_TYPE; // e.g., ScreenTypes.ROWxCOLUMN
        const multiplier = GameConstants.MULTIPLIER; // e.g., 1
        const wildMultiplier = currentWildMultiplier; // e.g., 1

        const waysWinEvaluator = new WaysWinEvaluation(this.slotInfo);
        const baseGameWin = waysWinEvaluator.generateWins(
            screen,
            bet,
            skipEvalFor,
            wildCollection,
            ways,
            GameConstants.DISPLAY_COMBINE_WINS,
            screenType,
            multiplier,
            wildMultiplier
        );
        return baseGameWin;
    }
}

export default SlotGameService;
