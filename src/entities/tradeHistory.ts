import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { TradeHistory } from "../../generated/schema";

export function updateTradeHistory(
	userAddress: Address,
	marketIdentifier: Bytes,
	tradeIndex: BigInt,
	amount0: BigDecimal,
	amount1: BigDecimal,
	amountC: BigDecimal,
	timestamp: BigInt
): void {
	const id =
		userAddress.toHex() +
		"-" +
		marketIdentifier.toHex() +
		"-" +
		tradeIndex.toHex();
	var tradeHistory = TradeHistory.load(id);
	if (!tradeHistory) {
		tradeHistory = new TradeHistory(id);
		tradeHistory.user = userAddress.toHex();
		tradeHistory.market = marketIdentifier.toHex();
	}
	tradeHistory.amount0 = amount0;
	tradeHistory.amount1 = amount1;
	tradeHistory.amountC = amountC;
	tradeHistory.timestamp = timestamp;
	tradeHistory.save();
}
