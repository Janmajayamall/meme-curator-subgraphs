import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Oracle as OracleContract } from "../../generated/OracleFactory/Oracle";
import { Oracle } from "../../generated/schema";
import { convertAddressBytesToAddress, FACTORY_ADDRESS } from "../helpers";

/**
 * Get functions querying entity
 */
export function getOracleCollateralToken(oracleAddress: Address): Address {
	return convertAddressBytesToAddress(
		loadOracle(oracleAddress).collateralToken
	);
}

/**
 * Update functions
 */
export function loadOracle(oracleAddress: Address): Oracle {
	var oracle = Oracle.load(oracleAddress.toHex());
	if (!oracle) {
		oracle = new Oracle(oracleAddress.toHex());
	}
	return oracle;
}

export function updateOracleDetails(oracleAddress: Address): void {
	const contract = OracleContract.bind(oracleAddress);
	const config = contract.marketConfig();
	const collateralToken = contract.collateralToken();
	const delegate = contract.delegate();
	const manager = contract.manager();

	const oracleContracts = loadOracle(oracleAddress);
	oracleContracts.delegate = delegate;
	oracleContracts.manager = manager;
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
