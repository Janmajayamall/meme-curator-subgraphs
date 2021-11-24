import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { TradeHistory } from "../../generated/schema";
import { convertBigIntToDecimal } from "../helpers";

/**
 * Update functions
 */
export function updateTradeHistory(
	userAddress: Address,
	marketIdentifier: Bytes,
	tradeIndex: BigInt,
	amount0: BigInt,
	amount1: BigInt,
	amountC: BigInt,
	timestamp: BigInt,
	buy: boolean
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
	tradeHistory.amount0 = convertBigIntToDecimal(amount0);
	tradeHistory.amount1 = convertBigIntToDecimal(amount1);
	tradeHistory.amountC = convertBigIntToDecimal(amountC);
	tradeHistory.timestamp = timestamp;
	tradeHistory.tradeIndex = tradeIndex;
	tradeHistory.buy = buy;
	tradeHistory.save();
}
