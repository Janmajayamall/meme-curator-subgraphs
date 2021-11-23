import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { OracleTokenCReserve } from "../../generated/schema";
import { Oracle as OracleContract } from "../../generated/OracleFactory/Oracle";
import { convertBigIntToDecimal, ZERO_BD } from "../helpers";

export function getDeltaTokenCReserveForOracle(
	oracleAddress: Address,
	tokenCAddress: Address
): BigDecimal {
	const oracleTokenCReserve = loadOracleTokenCReserve(
		oracleAddress,
		tokenCAddress
	);

	// latest reserve value
	const latestReserve = OracleContract.bind(oracleAddress).cReserves(
		tokenCAddress
	);
	const delta: BigDecimal = convertBigIntToDecimal(latestReserve).minus(
		oracleTokenCReserve.reserve
	);

	return delta;
}

export function loadOracleTokenCReserve(
	oracleAddress: Address,
	tokenCAddress: Address
): OracleTokenCReserve {
	const id = oracleAddress.toHex() + "-" + tokenCAddress.toHex();
	var oracleTokenCBalance = OracleTokenCReserve.load(id);
	if (!oracleTokenCBalance) {
		oracleTokenCBalance = new OracleTokenCReserve(id);
		oracleTokenCBalance.oracle = oracleAddress.toHex();
		oracleTokenCBalance.tokenC = tokenCAddress;
	}
	return oracleTokenCBalance;
}

export function updateOracleTokenCReserve(
	oracleAddress: Address,
	tokenCAddress: Address
): void {
	const oracleTokenCReserve = loadOracleTokenCReserve(
		oracleAddress,
		tokenCAddress
	);

	// set tokenC reserve
	const reserve = OracleContract.bind(oracleAddress).cReserves(tokenCAddress);
	oracleTokenCReserve.reserve = convertBigIntToDecimal(reserve);

	oracleTokenCReserve.save();
}
