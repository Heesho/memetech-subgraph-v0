import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { TokenHourData, TokenDayData } from "../generated/schema";
import { Meme as MemeContract } from "../generated/templates/Meme/Meme";
import { ZERO_BD, ZERO_BI, ONE_BI, convertEthToDecimal } from "./helpers";

export function updateTokenHourData(event: ethereum.Event): TokenHourData {
  let memeContract = MemeContract.bind(event.address);
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 3600;
  let hourStartTimestamp = hourIndex * 3600;
  let hourTokenId = event.address.toHexString() + "-" + hourIndex.toString();
  let tokenHourData = TokenHourData.load(hourTokenId);
  if (tokenHourData === null) {
    tokenHourData = new TokenHourData(hourTokenId);
    tokenHourData.timestamp = BigInt.fromI32(hourStartTimestamp);
    tokenHourData.meme = event.address;
    tokenHourData.hourlyVolume = ZERO_BD;
    tokenHourData.hourlyTxns = ZERO_BI;
  }
  tokenHourData.marketPrice = convertEthToDecimal(
    memeContract.getMarketPrice()
  );
  tokenHourData.hourlyTxns = tokenHourData.hourlyTxns.plus(ONE_BI);
  tokenHourData.save();

  return tokenHourData as TokenHourData;
}

export function updateTokenDayData(event: ethereum.Event): TokenDayData {
  let memeContract = MemeContract.bind(event.address);
  let timestamp = event.block.timestamp.toI32();
  let dayId = timestamp / 86400;
  let dayStartTimestamp = dayId * 86400;
  let dayTokenId = event.address.toHexString() + "-" + dayId.toString();
  let tokenDayData = TokenDayData.load(dayTokenId);
  if (tokenDayData === null) {
    tokenDayData = new TokenDayData(dayTokenId);
    tokenDayData.timestamp = BigInt.fromI32(dayStartTimestamp);
    tokenDayData.meme = event.address;
    tokenDayData.dailyVolume = ZERO_BD;
    tokenDayData.dailyTxns = ZERO_BI;
  }
  tokenDayData.marketPrice = convertEthToDecimal(memeContract.getMarketPrice());
  tokenDayData.dailyTxns = tokenDayData.dailyTxns.plus(ONE_BI);
  tokenDayData.save();

  return tokenDayData as TokenDayData;
}
