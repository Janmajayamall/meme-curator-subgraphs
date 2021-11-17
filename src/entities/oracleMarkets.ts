import { Address, BigInt } from "@graphprotocol/graph-ts";
import { OracleMarkets as OracleMarketsContract } from "../../generated/OracleFactory/OracleMarkets";
import { OracleMarkets } from "../../generated/schema";
import { FACTORY_ADDRESS } from "../helpers";

export function loadOracleMarkets(
	oracleMarketsAddress: Address
): OracleMarkets {
	var oracleMarkets = OracleMarkets.load(oracleMarketsAddress.toHex());
	if (!oracleMarkets) {
		oracleMarkets = new OracleMarkets(oracleMarketsAddress.toHex());
	}
	return oracleMarkets;
}

export function updateOracleMarketsDetails(
	oracleMarketsAddress: Address
): void {
	const contract = OracleMarketsContract.bind(oracleMarketsAddress);
	const config = contract.marketConfig();
	const collateralToken = contract.collateralToken();
	const delegate = contract.delegate();

	const oracleContracts = loadOracleMarkets(oracleMarketsAddress);
	oracleContracts.delegate = delegate;
	oracleContracts.collateralToken = collateralToken;

	// configs
	oracleContracts.feeNumerator = config.value0;
	oracleContracts.feeDenominator = config.value1;
	oracleContracts.expireBufferBlocks = config.value2;
	oracleContracts.donBufferBlocks = config.value3;
	oracleContracts.resolutionBufferBlocks = config.value4;
	oracleContracts.donEscalationLimit = BigInt.fromI32(config.value5);
	oracleContracts.isActive = config.value6;

	oracleContracts.factory = FACTORY_ADDRESS;

	oracleContracts.save();
}
