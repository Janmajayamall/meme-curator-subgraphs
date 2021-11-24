import {
	Address,
	BigDecimal,
	Bytes,
	BigInt,
	log,
} from "@graphprotocol/graph-ts";
import {
	DelegateChanged,
	MarketCreated,
	OracleConfigUpdated,
	OutcomeBought,
	OutcomeSet,
	OutcomeSold,
	OutcomeStaked,
	StakedRedeemed,
	WinningRedeemed,
} from "../../generated/OracleFactory/Oracle";
import { saveUser, saveUserMarket } from "../entities";
import {
	updateOutcomeReserves,
	updateStaking,
	updateStakingReserves,
	updateStateDetails,
	updateDetails,
	updateTradeVolume,
	updateStakeVolume,
	increaseTradesCount,
	getTradesCount,
	getDonEscalationCount,
} from "../entities/market";
import {
	updateOracleDetails,
	getOracleCollateralToken,
} from "../entities/oracle";
import { updateStakeHistory } from "../entities/stakeHistory";
import { updateStakePosition } from "../entities/stakePosition";
import { updateTradeHistory } from "../entities/tradeHistory";
import { updateTradePosition } from "../entities/tradePosition";
import { ONE_BD, ONE_BI, Staking, ZERO_BD, TradeAmount } from "../helpers";

export function handleMarketCreated(event: MarketCreated): void {
	updateDetails(
		event.params.marketIdentifier,
		event.params.creator,
		event.params.eventIdentifier,
		event.address,
		event.block.timestamp
	);

	updateStateDetails(event.params.marketIdentifier, event.address);
	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStakingReserves(event.params.marketIdentifier, event.address);
	updateStaking(event.params.marketIdentifier, event.address);

	saveUser(event.params.creator);
	saveUserMarket(
		event.params.creator,
		event.params.marketIdentifier,
		event.block.timestamp
	);
}

export function handleOutcomeBought(event: OutcomeBought): void {
	// update user interaction
	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update trade history
	const tradeIndex: BigInt = getTradesCount(
		event.params.marketIdentifier
	).plus(ONE_BI);
	updateTradeHistory(
		event.params.by,
		event.params.marketIdentifier,
		tradeIndex,
		event.params.amount0,
		event.params.amount1,
		event.params.amountC,
		event.block.timestamp,
		true
	);

	// update trade positions
	updateTradePosition(
		event.params.by,
		event.params.marketIdentifier,
		event.address,
		event.block.timestamp
	);

	// update market
	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
	updateTradeVolume(
		event.params.marketIdentifier,
		event.params.amountC,
		event.block.timestamp
	);
	increaseTradesCount(event.params.marketIdentifier, ONE_BI);
}

export function handleOutcomeSold(event: OutcomeSold): void {
	// update user interaction
	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update trade history
	const tradeIndex: BigInt = getTradesCount(
		event.params.marketIdentifier
	).plus(ONE_BI);
	updateTradeHistory(
		event.params.by,
		event.params.marketIdentifier,
		tradeIndex,
		event.params.amount0,
		event.params.amount1,
		event.params.amountC,
		event.block.timestamp,
		false
	);

	// update trade positions
	updateTradePosition(
		event.params.by,
		event.params.marketIdentifier,
		event.address,
		event.block.timestamp
	);

	// update market
	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
	updateTradeVolume(
		event.params.marketIdentifier,
		event.params.amountC,
		event.block.timestamp
	);
	increaseTradesCount(event.params.marketIdentifier, ONE_BI);
}

export function handleOutcomeStaked(event: OutcomeStaked): void {
	// update user interaction
	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update staking history
	const stakeIndex = getDonEscalationCount(
		event.params.marketIdentifier
	).plus(ONE_BI);
	updateStakeHistory(
		event.params.by,
		event.params.marketIdentifier,
		stakeIndex,
		event.params.amount,
		BigInt.fromI32(event.params.outcome),
		event.block.timestamp
	);

	// update stake position
	updateStakePosition(
		event.params.by,
		event.params.marketIdentifier,
		event.address,
		event.block.timestamp
	);

	// update market
	updateStakingReserves(event.params.marketIdentifier, event.address);
	updateStaking(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
	updateStakeVolume(
		event.params.marketIdentifier,
		event.address,
		event.block.timestamp
	);
}

export function handleOutcomeSet(event: OutcomeSet): void {
	updateStateDetails(event.params.marketIdentifier, event.address);
}

export function handleWinningRedeemed(event: WinningRedeemed): void {
	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);

	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);
}

export function handleStakedRedeemed(event: StakedRedeemed): void {
	updateStakingReserves(event.params.marketIdentifier, event.address);
	updateStaking(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);

	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);
}

export function handleOracleConfigUpdated(event: OracleConfigUpdated): void {
	updateOracleDetails(event.address);
}

export function handleDelegateChanged(event: DelegateChanged): void {
	updateOracleDetails(event.address);
}
