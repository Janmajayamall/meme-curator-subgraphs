import { Address } from "@graphprotocol/graph-ts";
import { getStakes } from ".";
import { Stake } from "../../generated/schema";

export function loadStake(marketAddress: Address, by: Address): Stake {
	const id = by.toHex() + marketAddress.toHex();
	var stake = Stake.load(id);
	if (!stake) {
		stake = new Stake(id);
	}
	return stake;
}

export function updateStake(marketAddress: Address, by: Address): void {
	const stake = loadStake(marketAddress, by);
	const stakes = getStakes(marketAddress, by);
	stake.stake0 = stakes[0];
	stake.stake1 = stakes[1];
	stake.save();
}
