import { Address } from "@graphprotocol/graph-ts";
import { Safe } from "../../generated/schema";

/**
 * Update functions
 */
export function loadSafe(safeAddress: Address): Safe {
	const id = safeAddress.toHex();
	var safe = Safe.load(id);
	if (!safe) {
		safe = new Safe(id);
	}
	return safe;
}

export function saveSafe(safeAddress: Address): void {
	const safe = loadSafe(safeAddress);
	safe.save();
}
