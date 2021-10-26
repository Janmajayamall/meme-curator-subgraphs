import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Market } from "../../generated/schema";
import { Market as MarketContract } from "../../generated/templates/Market/Market";
import {
	convertBigIntToDecimal,
	FACTORY_ADDRESS,
	ONE_BI,
	ZERO_BD,
	ZERO_BI,
} from "./../helpers";

export function loadMarket(marketAddress: Address): Market {
	var market = Market.load(marketAddress.toHex());
	if (!market) {
		market = new Market(marketAddress.toHex());
	}
	return market;
}

export function updateMarketDetails(marketAddress: Address) {
	const marketDetails = MarketContract.bind(marketAddress).getMarketDetails();
	const market = loadMarket(marketAddress);

	market.expireAtBlock = marketDetails[0];
	market.donBufferEndsAtBlock = marketDetails[1];
	market.resolutionEndsAtBlock = marketDetails[2];
	market.expireBufferBlocks = marketDetails[3];
	market.donBufferBlocks = marketDetails[4];
	market.resolutionBufferBlocks = marketDetails[5];
	market.donEscalationCount = marketDetails[6];
	market.donEscalationLimit = marketDetails[7];
	market.oracleFeeNumerator = marketDetails[8];
	market.oracleFeeDenominator = marketDetails[9];
	market.outcome = marketDetails[10];
	market.stage = marketDetails[11];

	market.save();
}

export function updateMarketBasicInfo(marketAddress: Address) {
	const marketInfo = MarketContract.bind(marketAddress).getMarketInfo();
	const tokenAddresses = MarketContract.bind(
		marketAddress
	).getTokenAddresses();
	const market = loadMarket(marketAddress);

	market.factory = FACTORY_ADDRESS;
	market.identifier = marketInfo.value0;
	market.creator = marketInfo.value1;
	market.oracle = marketInfo.value2;

	market.tokenC = tokenAddresses.value0;
	market.token0 = tokenAddresses.value1;
	market.token1 = tokenAddresses.value2;

	market.save();
}

export function updateMarketReserves(marketAddress: Address) {
	const tokenOReserves = MarketContract.bind(
		marketAddress
	).getOutcomeReserves();
	const tokenCReserves = MarketContract.bind(
		marketAddress
	).getTokenCReserves();
	const market = loadMarket(marketAddress);

	market.reserveC = convertBigIntToDecimal(tokenCReserves.value0);
	market.reserve0 = convertBigIntToDecimal(tokenOReserves.value0);
	market.reserve1 = convertBigIntToDecimal(tokenOReserves.value1);
	market.reserveDoN0 = convertBigIntToDecimal(tokenCReserves.value1);
	market.reserveDoN1 = convertBigIntToDecimal(tokenCReserves.value2);

	market.save();
}

export function updateMarketStaking(marketAddress: Address) {
	const staking = MarketContract.bind(marketAddress).getStaking();
	const market = loadMarket(marketAddress);
	market.lastAmountStaked = convertBigIntToDecimal(staking.value0);
	market.staker0 = staking.value1;
	market.staker1 = staking.value2;
	market.lastOutcomeStaked = staking.value3;

	market.save();
}

export function getStakes(
	marketAddress: Address,
	user: Address
): Array<BigDecimal> {
	var stakes: Array<BigDecimal> = [ZERO_BD, ZERO_BD];

	stakes[0] = convertBigIntToDecimal(
		MarketContract.bind(marketAddress).getStake(ZERO_BI, user)
	);
	stakes[1] = convertBigIntToDecimal(
		MarketContract.bind(marketAddress).getStake(ONE_BI, user)
	);

	return stakes;
}
