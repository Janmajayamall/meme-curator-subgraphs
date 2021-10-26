import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";
import { MarketFactory } from "./../generated/MarketFactory/MarketFactory";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "0x5F2E80E35F64157e769F38392953b60461e5BbAb";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export let marketFactoryContract = MarketFactory.bind(
	Address.fromString(FACTORY_ADDRESS)
);

export function convertBigIntToDecimal(
	value: BigInt,
	base: BigDecimal = BigDecimal.fromString("1e18")
): BigDecimal {
	return value.divDecimal(base);
}
