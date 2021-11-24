import { Address } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";

/**
 * Update functions
 */
export function loadUser(userAddress: Address): User {
	const id = userAddress.toHex();
	var user = User.load(id);
	if (!user) {
		user = new User(id);
	}
	return user;
}

export function saveUser(userAddress: Address): void {
	const user = loadUser(userAddress);
	user.save();
}
