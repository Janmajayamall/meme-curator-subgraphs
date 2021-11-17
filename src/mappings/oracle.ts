import {
	DelegateChanged,
	MarketCreated,
	OracleConfigUpdated,
	OutcomeSet,
	OutcomeStaked,
	OutcomeTraded,
	StakedRedeemed,
	WinningRedeemed,
} from "../../generated/OracleFactory/Oracle";
import { saveUser, saveUserMarket } from "../entities";
import {
	updateBasicDetails,
	updateOutcomeReserves,
	updateStaking,
	updateStakingReserves,
	updateStateDetails,
} from "../entities/market";
import { updateOracleDetails } from "../entities/oracle";

export function handleMarketCreated(event: MarketCreated): void {
	updateBasicDetails(
		event.params.marketIdentifier,
		event.params.creator,
		event.params.eventIdentifier,
		event.address
	);

	saveUser(event.params.creator);
	saveUserMarket(event.params.creator, event.params.marketIdentifier);
}

export function handleOutcomeTraded(event: OutcomeTraded): void {
	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);

	saveUser(event.params.by);
	saveUserMarket(event.params.by, event.params.marketIdentifier);
}

export function handleOutcomeStaked(event: OutcomeStaked): void {
	updateStakingReserves(event.params.marketIdentifier, event.address);
	updateStaking(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);

	saveUser(event.params.by);
	saveUserMarket(event.params.by, event.params.marketIdentifier);
}

export function handleOutcomeSet(event: OutcomeSet): void {
	updateStakingReserves(event.params.marketIdentifier, event.address);
	updateStaking(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
}

export function handleWinningRedeemed(event: WinningRedeemed): void {
	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);

	saveUser(event.params.by);
	saveUserMarket(event.params.by, event.params.marketIdentifier);
}

export function handleStakedRedeemed(event: StakedRedeemed): void {
	updateStakingReserves(event.params.marketIdentifier, event.address);
	updateStaking(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);

	saveUser(event.params.by);
	saveUserMarket(event.params.by, event.params.marketIdentifier);
}

export function handleOracleConfigUpdated(event: OracleConfigUpdated): void {
	updateOracleDetails(event.address);
}

export function handleDelegateChanged(event: DelegateChanged): void {
	updateOracleDetails(event.address);
}
