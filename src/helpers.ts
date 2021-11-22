import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "0x92725a5AE290c4b8C972aF932E8Bf90a335d94Da";
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
