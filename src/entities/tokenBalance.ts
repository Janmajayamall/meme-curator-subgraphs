import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { Oracle as OracleContract } from "../../generated/OracleFactory/Oracle";
import { TokenBalance } from "../../generated/schema";
import { convertBigIntToDecimal, emptyBytes } from "../helpers";

export function loadTokenBalance(tokenId: BigInt, user: Address): TokenBalance {
	const id = user.toHex() + "-" + tokenId.toHex();
	var tokenBalance = TokenBalance.load(id);
	if (!tokenBalance) {
		tokenBalance = new TokenBalance(id);
		tokenBalance.tokenId = tokenId;
		tokenBalance.user = user.toHex();
	}
	return tokenBalance;
}

/**
 * Update functions
 */
export function updateTokenBalance(
	tokenId: BigInt,
	user: Address,
	oracleAddress: Address,
	marketIdentifier: Bytes = emptyBytes
): void {
	const tokenBalance = loadTokenBalance(tokenId, user);
	const callRes = OracleContract.bind(oracleAddress).try_balanceOf(
		user,
		tokenId
	);
	let value = callRes.reverted ? BigInt.zero() : callRes.value;
	tokenBalance.balance = convertBigIntToDecimal(value);
	tokenBalance.oracle = oracleAddress.toHex();
	if (!marketIdentifier.equals(emptyBytes)) {
		tokenBalance.market = marketIdentifier.toHex();
	}
	tokenBalance.save();
}
