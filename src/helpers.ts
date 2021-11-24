import { BigInt, BigDecimal, Address, Bytes } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "0xE8606614bA1798286F069E46d7a36EE434D478E7";
export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export function convertBigIntToDecimal(
	value: BigInt,
	base: BigDecimal = BigDecimal.fromString("1e18")
): BigDecimal {
	return value.divDecimal(base);
}

/**
 * @ref https://github.com/protofire/subgraph-toolkit/blob/main/lib/utils.ts
 */
export function convertAddressBytesToAddress(address: Bytes): Address {
	return Address.fromHexString(address.toHexString()).subarray(
		-20
	) as Address;
}

// export interface Staking {

// }

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
