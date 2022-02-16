import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { User, UserStake } from "../../generated/schema";
import { convertBigIntToDecimal } from "../helpers";

export function loadUserStake(
	userAddress: Address,
	marketIdentifier: Bytes,
	groupAddress: Address,
	donEscalationIndex: BigInt
): UserStake {
	const id =
		userAddress.toHex() +
		"-" +
		marketIdentifier.toHex() +
		"-" +
		groupAddress.toHex() +
		"-" +
		donEscalationIndex.toHex();

	var userStake = UserStake.load(id);
	if (!userStake) {
		userStake = new UserStake(id);
		userStake.user = userAddress.toHex();
		userStake.market = marketIdentifier.toHex();
		userStake.group = groupAddress.toHex();
		userStake.donEscalationIndex = donEscalationIndex;
	}
	return userStake;
}

export function updateUserStake(
	userAddress: Address,
	marketIdentifier: Bytes,
	groupAddress: Address,
	donEscalationIndex: BigInt,
	amount: BigDecimal,
	outcome: BigInt
): void {
	const userStake = loadUserStake(
		userAddress,
		marketIdentifier,
		groupAddress,
		donEscalationIndex
	);

	userStake.amount = amount;
	userStake.outcome = outcome;

	userStake.save();
}
