import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import { Group, Market } from "../../generated/schema";
import { Group as GroupContract } from "../../generated/GroupFactory/Group";
import { convertBigIntToDecimal, ZERO_BI } from "../helpers";

// TODO - change market ID to {marketIdentifier}-{groupAddress}
export function loadMarket(marketIdentifier: Bytes): Market {
	var market = Market.load(marketIdentifier.toHex());
	if (!market) {
		market = new Market(marketIdentifier.toHex());
	}

	return market;
}

export function updateCommonInfo(
	marketIdentifier: Bytes,
	groupAddress: Address
): void {
	const market = loadMarket(marketIdentifier);

	// update common info
	market.group = groupAddress.toHex();
	market.marketIdentifier = marketIdentifier;
	market.donEscalationCount = ZERO_BI;

	market.save();
}

export function updateReserves(
	marketIdentifier: Bytes,
	groupAddress: Address
): void {
	const groupContract = GroupContract.bind(groupAddress);
	const market = loadMarket(marketIdentifier);

	const reserves = groupContract.marketReserves(marketIdentifier);
	market.reserve0 = convertBigIntToDecimal(reserves.value0);
	market.reserve1 = convertBigIntToDecimal(reserves.value1);

	market.save();
}

export function updateState(
	marketIdentifier: Bytes,
	groupAddress: Address
): void {
	const groupContract = GroupContract.bind(groupAddress);
	const market = loadMarket(marketIdentifier);

	const marketState = groupContract.marketStates(marketIdentifier);
	market.donBufferEndsAt = marketState.value0;
	market.resolutionBufferEndsAt = marketState.value1;
	market.donBuffer = marketState.value2;
	market.resolutionBuffer = marketState.value3;

	market.save();
}

export function updateStakeInfo(
	marketIdentifier: Bytes,
	groupAddress: Address
): void {
	const groupContract = GroupContract.bind(groupAddress);
	const market = loadMarket(marketIdentifier);

	const stakeInfo = groupContract.marketStakeInfo(marketIdentifier);
	market.staker0 = stakeInfo.value0;
	market.staker1 = stakeInfo.value1;
	market.lastAmountStaked = convertBigIntToDecimal(stakeInfo.value2);

	market.save();
}

export function updateDetails(
	marketIdentifier: Bytes,
	groupAddress: Address
): void {
	const groupContract = GroupContract.bind(groupAddress);
	const market = loadMarket(marketIdentifier);

	const details = groupContract.marketDetails(marketIdentifier);
	market.tokenC = details.value0;
	market.fee = convertBigIntToDecimal(details.value1);
	market.outcome = BigInt.fromI32(details.value2);

	market.save();
}

export function increaseDONEscalationCount(
	marketIdentifier: Bytes,
	by: BigInt
): void {
	const market = loadMarket(marketIdentifier);
	market.donEscalationCount = market.donEscalationCount.plus(by);
	market.save();
}
