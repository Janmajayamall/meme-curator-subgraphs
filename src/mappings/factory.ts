import { MarketCreated } from "../../generated/MarketFactory/MarketFactory";
import { MarketFactory } from "../../generated/schema";
import { Market as MarketTemplate } from "../../generated/templates";
import { FACTORY_ADDRESS, ONE_BI, ZERO_BI } from "./../helpers";
import {
	updateMarketBasicInfo,
	updateMarketReserves,
	updateMarketStaking,
	updateMarketDetails,
} from "./../entities";

export function handleMarketCreated(event: MarketCreated): void {
	var marketFactory = MarketFactory.load(FACTORY_ADDRESS);
	if (!marketFactory) {
		marketFactory = new MarketFactory(FACTORY_ADDRESS);
		marketFactory.marketCount = ZERO_BI;
	}

	updateMarketBasicInfo(event.params.market);
	updateMarketReserves(event.params.market);
	updateMarketStaking(event.params.market);
	updateMarketDetails(event.params.market);

	MarketTemplate.create(event.params.market);

	marketFactory.marketCount.plus(ONE_BI);
	marketFactory.save();
}
