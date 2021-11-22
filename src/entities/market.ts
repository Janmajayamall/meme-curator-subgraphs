import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { Market } from "../../generated/schema";
import { convertBigIntToDecimal } from "../helpers";
import { Oracle as OracleContract } from "../../generated/OracleFactory/Oracle";

export function loadMarket(marketIdentifier: Bytes): Market {
	var market = Market.load(marketIdentifier.toHex());
	if (!market) {
		market = new Market(marketIdentifier.toHex());
	}
	return market;
}

export function updateDetails(
	marketIdentifier: Bytes,
	creator: Address,
	eventIdentifier: Bytes,
	oracleAddress: Address,
	timestamp: BigInt
): void {
	const market = loadMarket(marketIdentifier);

	// update basic details
	market.oracle = oracleAddress.toHex();
	market.creator = creator;
	market.eventIdentifier = eventIdentifier;
	market.marketIdentifier = marketIdentifier;

	// update market details
	const details = OracleContract.bind(oracleAddress).marketDetails(
		marketIdentifier
	);
	market.tokenC = details.value0;
	market.feeNumerator = details.value1;
	market.feeDenominator = details.value2;
	market.fee = details.value1
		.toBigDecimal()
		.div(details.value2.toBigDecimal());

	// update token ids
	const oTokenIds = OracleContract.bind(oracleAddress).getOutcomeTokenIds(
		marketIdentifier
	);
	market.oToken0Id = oTokenIds.value0;
	market.oToken1Id = oTokenIds.value1;
	const sTokenIds = OracleContract.bind(oracleAddress).getReserveTokenIds(
		marketIdentifier
	);
	market.sToken0Id = sTokenIds.value0;
	market.sToken1Id = sTokenIds.value1;

	// update extra info
	market.timestamp = timestamp;

	market.save();
}
export function updateStateDetails(
	marketIdentifier: Bytes,
	oracleAddress: Address
): void {
	const details = OracleContract.bind(oracleAddress).stateDetails(
		marketIdentifier
	);
	const market = loadMarket(marketIdentifier);

	market.expireAtBlock = details.value0;
	market.donBufferEndsAtBlock = details.value1;
	market.resolutionEndsAtBlock = details.value2;
	market.donBufferBlocks = details.value3;
	market.resolutionBufferBlocks = details.value4;
	market.donEscalationCount = BigInt.fromI32(details.value5);
	market.donEscalationLimit = BigInt.fromI32(details.value6);
	market.outcome = BigInt.fromI32(details.value7);
	market.stage = BigInt.fromI32(details.value8);

	market.save();
}

export function updateOutcomeReserves(
	marketIdentifier: Bytes,
	oracleAddress: Address
): void {
	const reserves = OracleContract.bind(oracleAddress).outcomeReserves(
		marketIdentifier
	);
	const market = loadMarket(marketIdentifier);

	market.outcomeReserve0 = convertBigIntToDecimal(reserves.value0);
	market.outcomeReserve1 = convertBigIntToDecimal(reserves.value1);
	// calculate probability for both outcomes
	const denom: BigDecimal = convertBigIntToDecimal(reserves.value0).plus(
		convertBigIntToDecimal(reserves.value1)
	);
	market.probability1 = convertBigIntToDecimal(reserves.value0).div(denom);
	market.probability0 = convertBigIntToDecimal(reserves.value1).div(denom);
	// update trade volume

	market.save();
}

export function updateStakingReserves(
	marketIdentifier: Bytes,
	oracleAddress: Address
): void {
	const reserves = OracleContract.bind(oracleAddress).stakingReserves(
		marketIdentifier
	);
	const market = loadMarket(marketIdentifier);

	market.stakingReserve0 = convertBigIntToDecimal(reserves.value0);
	market.stakingReserve1 = convertBigIntToDecimal(reserves.value1);

	market.save();
}

export function updateStaking(
	marketIdentifier: Bytes,
	oracleAddress: Address
): void {
	const stakingInfo = OracleContract.bind(oracleAddress).staking(
		marketIdentifier
	);
	const market = loadMarket(marketIdentifier);

	market.lastAmountStaked = convertBigIntToDecimal(stakingInfo.value0);
	market.staker0 = stakingInfo.value1;
	market.staker1 = stakingInfo.value2;
	market.lastOutcomeStaked = BigInt.fromI32(stakingInfo.value3);

	market.save();
}

export function updateTradeVolume(
	marketIdentifier: Bytes,
	increaserBy: BigInt,
	timestamp: BigInt
): void {
	const market = loadMarket(marketIdentifier);
	market.tradeVolume = market.tradeVolume.plus(
		convertBigIntToDecimal(increaserBy)
	);
	market.totalVolume = market.tradeVolume.plus(market.stakeVolume);
	market.lastActionTimestamp = timestamp;
	market.save();
}

export function updateStakeVolume(
	marketIdentifier: Bytes,
	oracleAddress: Address,
	timestamp: BigInt
): void {
	const market = loadMarket(marketIdentifier);
	const reserves = OracleContract.bind(oracleAddress).stakingReserves(
		marketIdentifier
	);

	market.stakeVolume = convertBigIntToDecimal(reserves.value0).plus(
		convertBigIntToDecimal(reserves.value1)
	);
	market.lastActionTimestamp = timestamp;
	market.totalVolume = market.stakeVolume.plus(market.tradeVolume);

	market.save();
}
