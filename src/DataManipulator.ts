import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  private static calcPrice(response: ServerRespond) {
    return (response.top_ask.price + response.top_bid.price) / 2;
  }
  static generateRow(serverResponds: ServerRespond[]) {
    const priceABC = DataManipulator.calcPrice(serverResponds[0]);
    const priceDEF = DataManipulator.calcPrice(serverResponds[1]);
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    const timestamp = serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp;
    const triggerAlert = (ratio > upperBound || ratio < lowerBound) ? ratio : undefined;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: triggerAlert,
    }
  }
}
