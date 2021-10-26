import {
	OutcomeSet,
	OutcomeStaked,
	OutcomeTraded,
	StakedRedeemed,
	WinningRedeemed,
} from "../../generated/templates/Market/Market";

import {
	updateMarketDetails,
	updateMarketReserves,
	updateMarketStaking,
	updateStake,
} from "../entities/index";

export function handleOutcomeSet(event: OutcomeSet): void {
	updateMarketDetails(event.params.market);
}

export function handleOutcomeStaked(event: OutcomeStaked): void {
	updateMarketStaking(event.params.market);
	updateStake(event.params.market, event.params.by);
}

export function handleOutcomeTraded(event: OutcomeTraded): void {
	updateMarketReserves(event.params.market);
	updateMarketDetails(event.params.market);
}

export function handleStakedRedeemed(event: StakedRedeemed): void {
	updateMarketReserves(event.params.market);
}

export function handleWinningRedeemed(event: WinningRedeemed): void {
	updateMarketReserves(event.params.market);
}
