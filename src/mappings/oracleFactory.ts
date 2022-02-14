import { Address, Bytes } from "@graphprotocol/graph-ts";
import { OracleCreated } from "../../generated/OracleFactory/OracleFactory";
import { OracleFactory } from "../../generated/schema";
import { Oracle as OracleTemplate } from "../../generated/templates";
import {
	getManagerAddress,
	loadOracle,
	updateOracleDetails,
} from "../entities";
import { saveSafe } from "../entities/safe";
import { ONE_BI, ZERO_BI } from "../helpers";

export function handleOracleCreated(event: OracleCreated): void {
	var oracleFactory = OracleFactory.load(event.address.toHex());
	if (!oracleFactory) {
		oracleFactory = new OracleFactory(event.address.toHex());
		oracleFactory.oracleCount = ZERO_BI;
	}

	// new oracle entity
	updateOracleDetails(event.params.oracle, event.address);
	OracleTemplate.create(event.params.oracle);

	// new safe entity
	const safeAddress = getManagerAddress(event.params.oracle);
	saveSafe(safeAddress);

	// 

	oracleFactory.oracleCount = oracleFactory.oracleCount.plus(ONE_BI);
	oracleFactory.save();
}
