import { Address, BigDecimal, log } from "@graphprotocol/graph-ts";
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
	getTokenCAddress,
	getDeltaOutcomeTokenReserves,
	getOutcomeTokenReserves,
	getOutcomeTokenReservesFromOracleContract,
} from "../entities/market";
import {
	updateOracleDetails,
	getOracleCollateralToken,
} from "../entities/oracle";
import {
	getDeltaTokenCReserveForOracle,
	updateOracleTokenCReserve,
} from "../entities/oracleTokenCReserve";

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
	// calculate amountIn, amountOut0, amountOut1
	const tokenCAddress: Address = getTokenCAddress(
		event.params.marketIdentifier
	);
	const deltaTokenCReserve: BigDecimal = getDeltaTokenCReserveForOracle(
		event.address,
		tokenCAddress
	);
	const prevOutcomeTokenReserves: [
		BigDecimal,
		BigDecimal
	] = getOutcomeTokenReserves(event.params.marketIdentifier);
	const latestOutcomeTokenReserves: [
		BigDecimal,
		BigDecimal
	] = getOutcomeTokenReservesFromOracleContract(
		event.params.marketIdentifier,
		event.address
	);
	const amountOut0: BigDecimal = prevOutcomeTokenReserves[0]
		.plus(deltaTokenCReserve)
		.minus(latestOutcomeTokenReserves[0]);
	const amountOut1: BigDecimal = prevOutcomeTokenReserves[1]
		.plus(deltaTokenCReserve)
		.minus(latestOutcomeTokenReserves[1]);

	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
	updateTradeVolume(
		event.params.marketIdentifier,
		event.params.amount,
		event.block.timestamp
	);

	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);
}

export function handleOutcomeSold(event: OutcomeSold): void {
	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
	updateTradeVolume(
		event.params.marketIdentifier,
		event.params.amount,
		event.block.timestamp
	);

	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);
}

export function handleOutcomeStaked(event: OutcomeStaked): void {
	updateStakingReserves(event.params.marketIdentifier, event.address);
	updateStaking(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
	updateStakeVolume(
		event.params.marketIdentifier,
		event.address,
		event.block.timestamp
	);

	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
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
