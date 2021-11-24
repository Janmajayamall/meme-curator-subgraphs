import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { TradePosition } from "../../generated/schema";
import { Oracle as OracleContract } from "../../generated/OracleFactory/Oracle";
import { convertBigIntToDecimal } from "../helpers";

export function loadTradePosition(
	userAddress: Address,
	marketIdentifier: Bytes
): TradePosition {
	const id = userAddress.toHex() + "-" + marketIdentifier.toHex();
	var tradePosition = TradePosition.load(id);
	if (!tradePosition) {
		tradePosition = new TradePosition(id);
		tradePosition.user = userAddress.toHex();
		tradePosition.market = marketIdentifier.toHex();
	}
	return tradePosition;
}

export function updateTradePosition(
	userAddress: Address,
	marketIdentifier: Bytes,
	oracleAddress: Address,
	timestamp: BigInt
): void {
	const tradePosition = loadTradePosition(userAddress, marketIdentifier);

	const contract = OracleContract.bind(oracleAddress);
	const outcomeTokenIds = contract.getOutcomeTokenIds(marketIdentifier);
	const amount0 = contract.balanceOf(userAddress, outcomeTokenIds.value0);
	const amount1 = contract.balanceOf(userAddress, outcomeTokenIds.value1);

	tradePosition.amount0 = convertBigIntToDecimal(amount0);
	tradePosition.amount1 = convertBigIntToDecimal(amount1);
	tradePosition.timestamp = timestamp;
	tradePosition.save();
}
