import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { StakeHistory } from "../../generated/schema";
import { convertBigIntToDecimal } from "../helpers";

/**
 * Update functions
 */
export function updateStakeHistory(
	userAddress: Address,
	marketIdentifier: Bytes,
	stakeIndex: BigInt,
	amountC: BigInt,
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
	stakeHistory.amountC = convertBigIntToDecimal(amountC);
	stakeHistory.outcomeStaked = outcomeStaked;
	stakeHistory.timestamp = timestamp;
	stakeHistory.stakeIndex = stakeIndex;
	stakeHistory.save();
}
