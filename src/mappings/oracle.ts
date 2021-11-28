import {
	Address,
	BigDecimal,
	Bytes,
	BigInt,
	log,
} from "@graphprotocol/graph-ts";
import {
	DelegateChanged,
	MarketCreated,
	OracleConfigUpdated,
	OutcomeBought,
	OutcomeSet,
	OutcomeSold,
	OutcomeStaked,
	StakedRedeemed,
	TransferBatch,
	TransferSingle,
	WinningRedeemed,
} from "../../generated/OracleFactory/Oracle";
import { saveUser, saveUserMarket } from "../entities";
import {
	updateOutcomeReserves,
	updateStaking,
	updateStakingReserves,
	updateStateDetails,
	updateDetails,
	updateTradeVolume,
	updateStakeVolume,
	increaseTradesCount,
	getTradesCount,
	getDonEscalationCount,
	getOutcomeToken0Id,
	getOutcomeToken1Id,
	getStakeToken0Id,
	getStakeToken1Id,
} from "../entities/market";
import {
	updateOracleDetails,
	getOracleCollateralToken,
} from "../entities/oracle";
import { updateStakeHistory } from "../entities/stakeHistory";
import { updateStakePosition } from "../entities/stakePosition";
import { updateTokenBalance } from "../entities/tokenBalance";
import { updateTradeHistory } from "../entities/tradeHistory";
import { updateTradePosition } from "../entities/tradePosition";
import { ONE_BD, ONE_BI, Staking, ZERO_BD, TradeAmount } from "../helpers";

export function handleMarketCreated(event: MarketCreated): void {
	updateDetails(
		event.params.marketIdentifier,
		event.params.creator,
		event.params.eventIdentifier,
		event.address,
		event.block.timestamp
	);

	updateStateDetails(event.params.marketIdentifier, event.address);
	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStakingReserves(event.params.marketIdentifier, event.address);
	updateStaking(event.params.marketIdentifier, event.address);

	saveUser(event.params.creator);
	saveUserMarket(
		event.params.creator,
		event.params.marketIdentifier,
		event.block.timestamp
	);
}

export function handleOutcomeBought(event: OutcomeBought): void {
	// update user interaction
	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update trade history
	const tradeIndex: BigInt = getTradesCount(
		event.params.marketIdentifier
	).plus(ONE_BI);
	updateTradeHistory(
		event.params.by,
		event.params.marketIdentifier,
		tradeIndex,
		event.params.amount0,
		event.params.amount1,
		event.params.amountC,
		event.block.timestamp,
		true
	);

	// update outcome token balances
	const oToken0Id = getOutcomeToken0Id(event.params.marketIdentifier);
	const oToken1Id = getOutcomeToken1Id(event.params.marketIdentifier);
	updateTokenBalance(
		oToken0Id,
		event.params.by,
		event.address,
		event.params.marketIdentifier
	);
	updateTokenBalance(
		oToken1Id,
		event.params.by,
		event.address,
		event.params.marketIdentifier
	);

	// update market
	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
	updateTradeVolume(
		event.params.marketIdentifier,
		event.params.amountC,
		event.block.timestamp
	);
	increaseTradesCount(event.params.marketIdentifier, ONE_BI);
}

export function handleOutcomeSold(event: OutcomeSold): void {
	// update user interaction
	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update trade history
	const tradeIndex: BigInt = getTradesCount(
		event.params.marketIdentifier
	).plus(ONE_BI);
	updateTradeHistory(
		event.params.by,
		event.params.marketIdentifier,
		tradeIndex,
		event.params.amount0,
		event.params.amount1,
		event.params.amountC,
		event.block.timestamp,
		false
	);

	// update outcome token balances
	const oToken0Id = getOutcomeToken0Id(event.params.marketIdentifier);
	const oToken1Id = getOutcomeToken1Id(event.params.marketIdentifier);
	updateTokenBalance(
		oToken0Id,
		event.params.by,
		event.address,
		event.params.marketIdentifier
	);
	updateTokenBalance(
		oToken1Id,
		event.params.by,
		event.address,
		event.params.marketIdentifier
	);

	// update market
	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
	updateTradeVolume(
		event.params.marketIdentifier,
		event.params.amountC,
		event.block.timestamp
	);
	increaseTradesCount(event.params.marketIdentifier, ONE_BI);
}

export function handleOutcomeStaked(event: OutcomeStaked): void {
	// update user interaction
	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update staking history
	const stakeIndex = getDonEscalationCount(
		event.params.marketIdentifier
	).plus(ONE_BI);
	updateStakeHistory(
		event.params.by,
		event.params.marketIdentifier,
		stakeIndex,
		event.params.amount,
		BigInt.fromI32(event.params.outcome),
		event.block.timestamp
	);

	// update stake token balances
	const sToken0Id = getStakeToken0Id(event.params.marketIdentifier);
	const sToken1Id = getStakeToken1Id(event.params.marketIdentifier);
	updateTokenBalance(
		sToken0Id,
		event.params.by,
		event.address,
		event.params.marketIdentifier
	);
	updateTokenBalance(
		sToken1Id,
		event.params.by,
		event.address,
		event.params.marketIdentifier
	);

	// update market
	updateStakingReserves(event.params.marketIdentifier, event.address);
	updateStaking(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
	updateStakeVolume(
		event.params.marketIdentifier,
		event.address,
		event.block.timestamp
	);
}

export function handleOutcomeSet(event: OutcomeSet): void {
	updateStateDetails(event.params.marketIdentifier, event.address);
}

export function handleWinningRedeemed(event: WinningRedeemed): void {
	// update user interaction
	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update outcome token balances
	const oToken0Id = getOutcomeToken0Id(event.params.marketIdentifier);
	const oToken1Id = getOutcomeToken1Id(event.params.marketIdentifier);
	updateTokenBalance(
		oToken0Id,
		event.params.by,
		event.address,
		event.params.marketIdentifier
	);
	updateTokenBalance(
		oToken1Id,
		event.params.by,
		event.address,
		event.params.marketIdentifier
	);

	// update market
	updateOutcomeReserves(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
}

export function handleStakedRedeemed(event: StakedRedeemed): void {
	// update user interaction
	saveUser(event.params.by);
	saveUserMarket(
		event.params.by,
		event.params.marketIdentifier,
		event.block.timestamp
	);

	// update stake token balances
	const sToken0Id = getStakeToken0Id(event.params.marketIdentifier);
	const sToken1Id = getStakeToken1Id(event.params.marketIdentifier);
	updateTokenBalance(
		sToken0Id,
		event.params.by,
		event.address,
		event.params.marketIdentifier
	);
	updateTokenBalance(
		sToken1Id,
		event.params.by,
		event.address,
		event.params.marketIdentifier
	);

	// update market
	updateStakingReserves(event.params.marketIdentifier, event.address);
	updateStaking(event.params.marketIdentifier, event.address);
	updateStateDetails(event.params.marketIdentifier, event.address);
}

export function handleOracleConfigUpdated(event: OracleConfigUpdated): void {
	updateOracleDetails(event.address);
}

export function handleDelegateChanged(event: DelegateChanged): void {
	updateOracleDetails(event.address);
}

/**
 * ERC1155 event handlers
 */
export function handleTransferSingle(event: TransferSingle): void {
	updateTokenBalance(event.params._id, event.params._from, event.address);
	updateTokenBalance(event.params._id, event.params._to, event.address);
}

export function handleTransferBatch(event: TransferBatch): void {
	for (let i = 0; i < event.params._ids.length; i++) {
		let tokenId = event.params._ids[i];
		updateTokenBalance(tokenId, event.params._from, event.address);
		updateTokenBalance(tokenId, event.params._to, event.address);
	}
}
