import {
	BigInt,
	BigDecimal,
	Address,
	Bytes,
	log,
	crypto,
	ByteArray,
} from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let TWO_BI = BigInt.fromI32(2);
export let FOUR_BI = BigInt.fromI32(4);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);
export let emptyBytes = Bytes.fromByteArray(Bytes.fromUTF8(""));
export let S_ID = "S_Group_v1";

export function convertBigIntToDecimal(
	value: BigInt,
	base: BigDecimal = BigDecimal.fromString("1e18")
): BigDecimal {
	return value.divDecimal(base);
}

export function convertAddressBytesToAddress(address: Bytes): Address {
	return changetype<Address>(address);
}

export class Staking {
	lastAmountStaked: BigDecimal;
	staker0: Address;
	staker1: Address;
	lastOutcomeStaked: BigInt;

	constructor() {
		this.lastAmountStaked = ZERO_BD;
		this.staker0 = Address.zero();
		this.staker1 = Address.zero();
		this.lastOutcomeStaked = ZERO_BI;
	}
}

export class OutcomeTokenReserves {
	reserve0: BigDecimal;
	reserve1: BigDecimal;

	constructor() {
		this.reserve0 = ZERO_BD;
		this.reserve1 = ZERO_BD;
	}
}

export class TradeAmount {
	amountC: BigDecimal;
	amount0: BigDecimal;
	amount1: BigDecimal;

	constructor() {
		this.amount0 = ZERO_BD;
		this.amount1 = ZERO_BD;
		this.amountC = ZERO_BD;
	}
}
