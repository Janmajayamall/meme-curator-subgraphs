import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { StakePosition } from "../../generated/schema";
import { Oracle as OracleContract } from "../../generated/OracleFactory/Oracle";
import { convertBigIntToDecimal } from "../helpers";

/**
 * Update functions
 */
export function loadStakePosition(
	userAddress: Address,
	marketIdentifier: Bytes
): StakePosition {
	const id = userAddress.toHex() + "-" + marketIdentifier.toHex();
	var stakePosition = StakePosition.load(id);
	if (!stakePosition) {
		stakePosition = new StakePosition(id);
		stakePosition.user = userAddress.toHex();
		stakePosition.market = marketIdentifier.toHex();
	}
	return stakePosition;
}

export function updateStakePosition(
	userAddress: Address,
	marketIdentifier: Bytes,
	oracleAddress: Address,
	timestamp: BigInt
): void {
	const stakePosition = loadStakePosition(userAddress, marketIdentifier);

	const contract = OracleContract.bind(oracleAddress);
	const stakeTokenIds = contract.getReserveTokenIds(marketIdentifier);
	const sAmount0 = contract.balanceOf(userAddress, stakeTokenIds.value0);
	const sAmount1 = contract.balanceOf(userAddress, stakeTokenIds.value1);

	stakePosition.amountStaked0 = convertBigIntToDecimal(sAmount0);
	stakePosition.amountStaked1 = convertBigIntToDecimal(sAmount1);
	stakePosition.timestamp = timestamp;
	stakePosition.save();
}
