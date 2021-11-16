import { Address, Bytes } from "@graphprotocol/graph-ts";
import { Market } from "../../generated/schema";
import {
	OracleMarkets as OracleMarketsContract,
	OracleMarkets__marketConfigResult,
} from "../../generated/OracleFactory/OracleMarkets";
import { convertBigIntToDecimal } from "../helpers";

export function loadMarket(marketIdentifier: Bytes): Market {
	var market = Market.load(marketIdentifier.toHex());
	if (!market) {
		market = new Market(marketIdentifier.toHex());
	}
	return market;
}

export function updateMarketDetails(
	marketIdentifier: Bytes,
	oracleMarketsAddress: Address
): void {
	const details = OracleMarketsContract.bind(
		oracleMarketsAddress
	).marketDetails(marketIdentifier);
	const market = loadMarket(marketIdentifier);

	market.tokenC = details.value0;
	market.feeNumerator = details.value1;
	market.feeDenominator = details.value2;
	market.fee = details.value1
		.toBigDecimal()
		.div(details.value2.toBigDecimal());

	market.save();
}

export function updateStateDetails(
	marketIdentifier: Bytes,
	oracleMarketsAddress: Address
): void {
	const details = OracleMarketsContract.bind(
		oracleMarketsAddress
	).stateDetails(marketIdentifier);
	const market = loadMarket(marketIdentifier);

	market.expireAtBlock = details.value0;
	market.donBufferEndsAtBlock = details.value1;
	market.resolutionEndsAtBlock = details.value2;
	market.donBufferBlocks = details.value3;
	market.resolutionBufferBlocks = details.value4;
	market.donEscalationCount = details.value5;
	market.donEscalationLimit = details.value6;
	market.outcome = details.value7;
	market.stage = details.value8;

	market.save();
}

export function updateBasicDetails(
	marketIdentifier: Bytes,
	creator: Address,
	eventIdentifier: Address,
	oracleMarketsAddress: Address
): void {
	const market = loadMarket(marketIdentifier);
	market.oracle = oracleMarketsAddress.toHex();
	market.creator = creator;
	market.eventIdentifier = eventIdentifier;
	market.marketIdentifier = marketIdentifier;

	market.save();
}

export function updateOutcomeReserves(
	marketIdentifier: Bytes,
	oracleMarketsAddress: Address
): void {
	const reserves = OracleMarketsContract.bind(
		oracleMarketsAddress
	).outcomeReserves(marketIdentifier);
	const market = loadMarket(marketIdentifier);

	market.outcomeReserve0 = convertBigIntToDecimal(reserves.value0);
	market.outcomeReserve1 = convertBigIntToDecimal(reserves.value1);

	market.save();
}

export function updateStakingReserves(
	marketIdentifier: Bytes,
	oracleMarketsAddress: Address
): void {
	const reserves = OracleMarketsContract.bind(
		oracleMarketsAddress
	).stakingReserves(marketIdentifier);
	const market = loadMarket(marketIdentifier);

	market.stakingReserve0 = convertBigIntToDecimal(reserves.value0);
	market.stakingReserve1 = convertBigIntToDecimal(reserves.value1);

	market.save();
}

export function updateStaking(
	marketIdentifier: Bytes,
	oracleMarketsAddress: Address
): void {
	const stakingInfo = OracleMarketsContract.bind(
		oracleMarketsAddress
	).staking(marketIdentifier);
	const market = loadMarket(marketIdentifier);

	market.lastAmountStaked = convertBigIntToDecimal(stakingInfo.value0);
	market.staker0 = stakingInfo.value1;
	market.staker1 = stakingInfo.value2;
	market.lastOutcomeStaked = stakingInfo.value3;

	market.save();
}
