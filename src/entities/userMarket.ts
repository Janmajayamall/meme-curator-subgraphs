import { Address } from "@graphprotocol/graph-ts";
import { getStakes } from ".";
import { User, UserMarket } from "../../generated/schema";

export function loadUserMarket(
	userAddress: Address,
	marketAddress: Address
): UserMarket {
	const id = userAddress.toHex() + "-" + marketAddress.toHex();
	var userMarket = UserMarket.load(id);
	if (!userMarket) {
		userMarket = new UserMarket(id);
		userMarket.user = userAddress.toHex();
		userMarket.market = marketAddress.toHex();
	}
	return userMarket;
}

export function saveUserMarket(
	userAddress: Address,
	marketAddress: Address
): void {
	const userMarket = loadUserMarket(userAddress, marketAddress);
	userMarket.save();
}
