import { Address } from "@graphprotocol/graph-ts";
import { Group as GroupContract } from "../../generated/GroupFactory/Group";
import { Group } from "../../generated/schema";
import { convertBigIntToDecimal } from "../helpers";

export function loadGroup(groupAddress: Address): Group {
	var group = Group.load(groupAddress.toHex());
	if (!group) {
		group = new Group(groupAddress.toHex());
	}
	return group;
}

export function updateGroupDetails(
	groupAddress: Address,
	groupFactoryAddress?: Address
): void {
	const group = loadGroup(groupAddress);

	// update factory
	group.groupFactory = groupFactoryAddress ? groupFactoryAddress.toHex() : "";

	// update config
	const groupContract = GroupContract.bind(groupAddress);
	const config = groupContract.globalConfig();
	group.fee = convertBigIntToDecimal(config.value0);
	group.donBuffer = config.value1;
	group.resolutionBuffer = config.value2;
	group.isActive = config.value3;

	group.donReservesLimit = convertBigIntToDecimal(
		groupContract.donReservesLimit()
	);
	group.collateralToken = groupContract.collateralToken();
	group.manager = groupContract.manager();

	group.save();
}
