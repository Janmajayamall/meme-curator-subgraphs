import {
	Challenged,
	ConfigUpdated,
	MarketCreated,
	OutcomeSet,
	Redeemed,
} from "../../generated/GroupFactory/Group";

import { loadGroup, updateGroupDetails } from "../entities/group";
import {
	updateCommonInfo,
	updateReserves,
	updateStakeInfo,
	updateState,
	updateDetails,
	increaseDONEscalationCount,
	loadMarket,
} from "../entities/market";
import { updateUserStake } from "../entities/userStake";
import { saveUser } from "../entities/user";
import { saveUserMarket } from "../entities/userMarket";
import {
	ONE_BI,
	ZERO_BD,
	ZERO_BI,
	TWO_BI,
	convertBigIntToDecimal,
} from "../helpers";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { updateUserPosition } from "../entities/userPosition";

export function handleMarketCreated(event: MarketCreated): void {
	updateCommonInfo(event.params.marketIdentifier, event.address);
	updateReserves(event.params.marketIdentifier, event.address);
	updateState(event.params.marketIdentifier, event.address);
	updateStakeInfo(event.params.marketIdentifier, event.address);
	updateDetails(event.params.marketIdentifier, event.address);

	// update user interaction
	saveUser(event.params.creator);
	saveUser(event.params.challenger);
	saveUserMarket(event.params.creator, event.params.marketIdentifier);
	saveUserMarket(event.params.challenger, event.params.marketIdentifier);

	// update user positions
	updateUserPosition(
		event.params.creator,
		event.params.marketIdentifier,
		event.address
	);
	updateUserPosition(
		event.params.challenger,
		event.params.marketIdentifier,
		event.address
	);

	// update user stakes
	const market = loadMarket(event.params.marketIdentifier);
	updateUserStake(
		event.params.creator,
		event.params.marketIdentifier,
		event.address,
		market.donEscalationCount.plus(ONE_BI),
		market.reserve1,
		ONE_BI
	);
	updateUserStake(
		event.params.challenger,
		event.params.marketIdentifier,
		event.address,
		market.donEscalationCount.plus(TWO_BI),
		market.reserve0,
		ZERO_BI
	);

	// update escalation count to 2
	increaseDONEscalationCount(event.params.marketIdentifier, TWO_BI);
}

export function handleChallenged(event: Challenged): void {
	updateReserves(event.params.marketIdentifier, event.address);
	updateState(event.params.marketIdentifier, event.address);
	updateStakeInfo(event.params.marketIdentifier, event.address);
	updateDetails(event.params.marketIdentifier, event.address);

	// save user interaction & update user stake
	saveUser(event.params.by);
	saveUserMarket(event.params.by, event.params.marketIdentifier);
	const donEscalationCount = loadMarket(event.params.marketIdentifier)
		.donEscalationCount;
	updateUserStake(
		event.params.by,
		event.params.marketIdentifier,
		event.address,
		donEscalationCount.plus(ONE_BI),
		convertBigIntToDecimal(event.params.amount),
		BigInt.fromI32(event.params.outcome)
	);

	// update user positions
	updateUserPosition(
		event.params.by,
		event.params.marketIdentifier,
		event.address
	);

	// increase donEscalationCount by 1
	increaseDONEscalationCount(event.params.marketIdentifier, ONE_BI);
}

export function handleRedeemed(event: Redeemed): void {
	updateReserves(event.params.marketIdentifier, event.address);
	saveUser(event.params.by);
	saveUserMarket(event.params.by, event.params.marketIdentifier);

	// update user positions
	updateUserPosition(
		event.params.by,
		event.params.marketIdentifier,
		event.address
	);
}

export function handleOutcomeSet(event: OutcomeSet): void {
	updateDetails(event.params.marketIdentifier, event.address);
	updateState(event.params.marketIdentifier, event.address);
	updateReserves(event.params.marketIdentifier, event.address);
}

export function handleConfigUpdated(event: ConfigUpdated): void {
	updateGroupDetails(
		event.address,
		Address.fromString(loadGroup(event.address).groupFactory)
	);
}
