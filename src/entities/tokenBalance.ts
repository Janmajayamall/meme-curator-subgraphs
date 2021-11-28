import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { Oracle as OracleContract } from "../../generated/OracleFactory/Oracle";
import { TokenBalance } from "../../generated/schema";
import { convertBigIntToDecimal } from "../helpers";

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
	marketIdentifier?: Bytes
): void {
	const tokenBalance = loadTokenBalance(tokenId, user);
	const balance = OracleContract.bind(oracleAddress).balanceOf(user, tokenId);
	tokenBalance.balance = convertBigIntToDecimal(balance);
	tokenBalance.oracle = oracleAddress.toHex();
	if (marketIdentifier) {
		tokenBalance.market = marketIdentifier.toHex();
	}
	tokenBalance.save();
}
