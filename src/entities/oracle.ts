import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Oracle as OracleContract } from "../../generated/OracleFactory/Oracle";
import { Oracle } from "../../generated/schema";
import { ADDRESS_ZERO, convertAddressBytesToAddress } from "../helpers";

/**
 * Get functions querying entity
 */
export function getOracleCollateralToken(oracleAddress: Address): Address {
	return convertAddressBytesToAddress(
		loadOracle(oracleAddress).collateralToken
	);
}

export function getManagerAddress(oracleAddress: Address): Address {
	return changetype<Address>(loadOracle(oracleAddress).manager);
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

export function updateOracleDetails(
	oracleAddress: Address,
	oracleFactoryAddress: Address = Address.fromString(ADDRESS_ZERO)
): void {
	const contract = OracleContract.bind(oracleAddress);
	const config = contract.marketConfig();
	const collateralToken = contract.collateralToken();
	const delegate = contract.delegate();
	const manager = contract.manager();

	const oracleContracts = loadOracle(oracleAddress);
	oracleContracts.delegate = delegate;
	oracleContracts.manager = manager.toHex(); // safe contract
	oracleContracts.collateralToken = collateralToken;

	// configs
	oracleContracts.feeNumerator = config.value0;
	oracleContracts.feeDenominator = config.value1;
	oracleContracts.expireBufferBlocks = config.value2;
	oracleContracts.donBufferBlocks = config.value3;
	oracleContracts.resolutionBufferBlocks = config.value4;
	oracleContracts.donEscalationLimit = BigInt.fromI32(config.value5);
	oracleContracts.isActive = config.value6;

	if (!oracleFactoryAddress.equals(Address.fromString(ADDRESS_ZERO))) {
		oracleContracts.factory = oracleFactoryAddress.toHex();
	}

	oracleContracts.save();
}
