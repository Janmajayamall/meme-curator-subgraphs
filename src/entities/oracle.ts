import { Address, log, BigInt } from "@graphprotocol/graph-ts";
import { Oracle } from "../../generated/schema";
import { Oracle as OracleContract } from "../../generated/OracleFactory/Oracle";

export function loadOracle(address: Address): Oracle {
	const id = address.toHex();
	var oracle = Oracle.load(id);
	if (!oracle) {
		oracle = new Oracle(id);
	}
	return oracle;
}

export function updateOracleDetails(address: Address): void {
	const oracleParams = OracleContract.bind(address).try_getMarketParams();
	const oracleDelegate = OracleContract.bind(address).try_getDelegate();
	if (oracleParams.reverted || oracleDelegate.reverted) {
		log.info("Oracle with address {} missing either params or delegate", [
			address.toHex(),
		]);
	}

	const oracle = loadOracle(address);

	oracle.delegate = oracleDelegate.value;
	oracle.tokenC = oracleParams.value.value0;
	oracle.isActive = oracleParams.value.value1;
	oracle.feeNumerator = BigInt.fromI32(oracleParams.value.value2);
	oracle.feeDenominator = BigInt.fromI32(oracleParams.value.value3);
	oracle.donEscalationLimit = BigInt.fromI32(oracleParams.value.value4);
	oracle.expireBufferBlocks = oracleParams.value.value5;
	oracle.donBufferBlocks = oracleParams.value.value6;
	oracle.resolutionBufferBlocks = oracleParams.value.value7;

	oracle.save();
}
