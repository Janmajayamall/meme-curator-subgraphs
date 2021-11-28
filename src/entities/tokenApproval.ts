import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { Oracle, TokenApproval } from "../../generated/schema";

export function loadTokenApproval(
	user: Address,
	operator: Address,
	oracleAddress: Address
): TokenApproval {
	const id =
		user.toHex() + "-" + operator.toHex() + "-" + oracleAddress.toHex();
	let tokenApproval = TokenApproval.load(id);
	if (!tokenApproval) {
		tokenApproval = new TokenApproval(id);
		tokenApproval.oracle = oracleAddress.toHex();
		tokenApproval.user = user.toHex();
		tokenApproval.operator = operator;
	}
	return tokenApproval;
}

export function updateTokenApproval(
	user: Address,
	operator: Address,
	oracleAddress: Address,
	approved: boolean
): void {
	const tokenApproval = loadTokenApproval(user, operator, oracleAddress);
	tokenApproval.approved = approved;
	tokenApproval.save();
}
