import { Address, BigDecimal, Bytes, BigInt } from "@graphprotocol/graph-ts";
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
	updateOutcomeReserves,
	updateStaking,
	updateStakingReserves,
	updateStateDetails,
	updateDetails,
	updateTradeVolume,
	updateStakeVolume,
	getTokenCAddress,
	getTradesCount,
	getOutcomeTokenReserves,
	getOutcomeTokenReservesFromOracleContract,
	getStakingFromOracleContract,
	increaseTradesCount,
	getDonEscalationCount,
} from "../entities/market";
import {
	updateOracleDetails,
	getOracleCollateralToken,
} from "../entities/oracle";
import {
	getDeltaTokenCReserveForOracle,
	getTokenCReserve,
	getTokenCReserveFromOracleContract,
	updateOracleTokenCReserve,
} from "../entities/oracleTokenCReserve";
import { updateStakeHistory } from "../entities/stakeHistory";
import { updateStakePosition } from "../entities/stakePosition";
import { updateTradeHistory } from "../entities/tradeHistory";
import { updateTradePosition } from "../entities/tradePosition";
import { ONE_BI, ZERO_BD } from "../helpers";

/**
 * Calculates amountC, amount0, amount1 of a trade
 * @note Whether it was buy or sell trade is indicated by
 * amountC. If amountC > 0, then it's a buy. If amountC < 0,
 * then it's a sell. Otherwise, there was no trade & someone just wasted
 * a bunch of money on fee.
 */
export function calculateTradeAmounts(
	marketIdentifier: Bytes,
	oracleAddress: Address
): { amountC: BigDecimal; amount0: BigDecimal; amount1: BigDecimal } {
	const tokenCAddress: Address = getTokenCAddress(marketIdentifier);
	const prevTokenCReserve: BigDecimal = getTokenCReserve(
		oracleAddress,
		tokenCAddress
	);
	const latestTokenCReserve: BigDecimal = getTokenCReserveFromOracleContract(
		oracleAddress,
		tokenCAddress
	);
	const amountC: BigDecimal = latestTokenCReserve.minus(prevTokenCReserve);

	const prevOutcomeTokenReserves: [
		BigDecimal,
		BigDecimal
	] = getOutcomeTokenReserves(marketIdentifier);
	const latestOutcomeTokenReserves: [
		BigDecimal,
		BigDecimal
	] = getOutcomeTokenReservesFromOracleContract(
		marketIdentifier,
		oracleAddress
	);

	let amount0: BigDecimal;
	let amount1: BigDecimal;

	/**
	 * delta > 0 -> buy side
	 * delta < 0 -> sell side
	 */
	if (amountC.gt(ZERO_BD)) {
		amount0 = prevOutcomeTokenReserves[0]
			.plus(amountC)
			.minus(latestOutcomeTokenReserves[0]);
		amount1 = prevOutcomeTokenReserves[1]
			.plus(amountC)
			.minus(latestOutcomeTokenReserves[1]);
	} else if (amountC.lt(ZERO_BD)) {
		amount0 = latestOutcomeTokenReserves[0]
			.minus(amountC)
			.minus(prevOutcomeTokenReserves[0]);
		amount1 = latestOutcomeTokenReserves[1]
			.minus(amountC)
			.minus(prevOutcomeTokenReserves[1]);
	}

	return {
		amountC: amountC,
		amount0: amount0,
		amount1: amount1,
	};
}

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

export function handleOutcomeTraded(event: OutcomeTraded): void {
	// calculate trade amounts
	const tradeAmounts = calculateTradeAmounts(
		event.params.marketIdentifier,
		event.address
	);

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
		tradeAmounts.amount0,
		tradeAmounts.amount1,
		tradeAmounts.amountC,
		event.block.timestamp
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
		tradeAmounts.amountC,
		event.block.timestamp
	);
	increaseTradesCount(event.params.marketIdentifier, ONE_BI);

	// update oracle tokenC reserves
	const tokenCAddress: Address = getTokenCAddress(
		event.params.marketIdentifier
	);
	updateOracleTokenCReserve(event.address, tokenCAddress);
}

export function handleOutcomeStaked(event: OutcomeStaked): void {
	// latest amount staked
	const latestStaking = getStakingFromOracleContract(
		event.params.marketIdentifier,
		event.address
	);
	const lastAmountStaked = latestStaking.lastAmountStaked;
	const lastOutcomeStaked = latestStaking.lastOutcomeStaked;

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
		lastAmountStaked,
		lastOutcomeStaked,
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

	// update tokenC reserve
	const tokenCAddress: Address = getOracleCollateralToken(event.address);
	updateOracleTokenCReserve(event.address, tokenCAddress);
}

export function handleDelegateChanged(event: DelegateChanged): void {
	updateOracleDetails(event.address);
}
