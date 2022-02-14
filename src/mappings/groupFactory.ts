import { GroupCreated } from "../../generated/GroupFactory/GroupFactory";
import { GroupFactory } from "../../generated/schema";
import { ONE_BI, ZERO_BI } from "../helpers";
import { updateGroupDetails } from "../entities/group";

export function handleGroupCreated(event: GroupCreated): void {
	var groupFactory = GroupFactory.load(event.address.toHex());
	if (!groupFactory) {
		groupFactory = new GroupFactory(event.address.toHex());
		groupFactory.groupCount = ZERO_BI;
	}

	// new group entity
	updateGroupDetails(event.params.group, event.address);

	groupFactory.groupCount = groupFactory.groupCount.plus(ONE_BI);
	groupFactory.save();
}
