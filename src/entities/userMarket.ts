import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import { UserMarket } from "../../generated/schema";

/**
 * Update functions
 */
export function loadUserMarket(
	userAddress: Address,
	marketIdentifier: Bytes
): UserMarket {
	const id = userAddress.toHex() + "-" + marketIdentifier.toHex();
	var userMarket = UserMarket.load(id);
	if (!userMarket) {
		userMarket = new UserMarket(id);
		userMarket.user = userAddress.toHex();
		userMarket.market = marketIdentifier.toHex();
	}
	return userMarket;
}

export function saveUserMarket(
	userAddress: Address,
	marketIdentifier: Bytes
): void {
	const userMarket = loadUserMarket(userAddress, marketIdentifier);
	userMarket.save();
}
