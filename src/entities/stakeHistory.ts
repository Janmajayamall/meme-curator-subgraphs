import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { StakeHistory } from "../../generated/schema";

export function updateStakeHistory(
	userAddress: Address,
	marketIdentifier: Bytes,
	stakeIndex: BigInt,
	amountC: BigDecimal,
	outcomeStaked: BigInt,
	timestamp: BigInt
): void {
	const id =
		userAddress.toHex() +
		"-" +
		marketIdentifier.toHex() +
		"-" +
		stakeIndex.toHex();
	var stakeHistory = StakeHistory.load(id);
	if (!stakeHistory) {
		stakeHistory = new StakeHistory(id);
	}
	stakeHistory.user = userAddress.toHex();
	stakeHistory.market = marketIdentifier.toHex();
	stakeHistory.amountC = amountC;
	stakeHistory.outcomeStaked = outcomeStaked;
	stakeHistory.timestamp = timestamp;
	stakeHistory.save();
}
