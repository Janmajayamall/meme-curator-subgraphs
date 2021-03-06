import {
	Address,
	Bytes,
	BigInt,
	BigDecimal,
	ByteArray,
} from "@graphprotocol/graph-ts";
import { UserPosition } from "../../generated/schema";
import { Group as GroupContract } from "../../generated/GroupFactory/Group";
import { convertBigIntToDecimal } from "../helpers";

export function loadUserPosition(
	userAddress: Address,
	marketIdentifier: Bytes,
	groupAddress: Address
): UserPosition {
	const id =
		userAddress.toHex() +
		"-" +
		marketIdentifier.toHex() +
		"-" +
		groupAddress.toHex();

	var userPosition = UserPosition.load(id);
	if (!userPosition) {
		userPosition = new UserPosition(id);
		userPosition.user = userAddress.toHex();
		userPosition.market = marketIdentifier.toHex();
		userPosition.group = groupAddress.toHex();
	}
	return userPosition;
}

export function updateUserPosition(
	userAddress: Address,
	marketIdentifier: Bytes,
	groupAddress: Address
): void {
	const userPosition = loadUserPosition(
		userAddress,
		marketIdentifier,
		groupAddress
	);

	// get user stakes
	const groupContract = GroupContract.bind(groupAddress);
	const stakingIds = groupContract.getStakingIds(
		marketIdentifier,
		userAddress
	);
	userPosition.stakeId0 = stakingIds.value0;
	userPosition.stakeId1 = stakingIds.value1;
	userPosition.amount0 = convertBigIntToDecimal(
		groupContract.stakes(userPosition.stakeId0)
	);
	userPosition.amount1 = convertBigIntToDecimal(
		groupContract.stakes(userPosition.stakeId1)
	);

	userPosition.save();
}
