import { OracleRegistered } from "../../generated/OracleFactory/OracleFactory";
import { updateOracleDetails } from "../entities/oracle";

export function handleOracleRegistered(event: OracleRegistered): void {
	updateOracleDetails(event.params.oracle);
}
