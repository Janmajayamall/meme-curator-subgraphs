import { Address } from "@graphprotocol/graph-ts";
import { OracleCreated } from "../../generated/OracleFactory/OracleFactory";
import { OracleFactory } from "../../generated/schema";
import { Oracle as OracleTemplate } from "../../generated/templates";
import { getOracleCollateralToken, updateOracleDetails } from "../entities";
import { updateOracleTokenCReserve } from "../entities/oracleTokenCReserve";
import { FACTORY_ADDRESS, ONE_BI, ZERO_BI } from "../helpers";

export function handleOracleCreated(event: OracleCreated): void {
	var oracleFactory = OracleFactory.load(FACTORY_ADDRESS);
	if (!oracleFactory) {
		oracleFactory = new OracleFactory(FACTORY_ADDRESS);
		oracleFactory.oracleCount = ZERO_BI;
	}

	// new oracle entity
	updateOracleDetails(event.params.oracle);
	OracleTemplate.create(event.params.oracle);

	// update tokenC reserves
	const tokenCAddress: Address = getOracleCollateralToken(
		event.params.oracle
	);
	updateOracleTokenCReserve(event.params.oracle, tokenCAddress);

	oracleFactory.oracleCount = oracleFactory.oracleCount.plus(ONE_BI);
	oracleFactory.save();
}
