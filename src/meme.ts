import {
  Meme__Buy as Meme__BuyEvent,
  Meme__Sell as Meme__SellEvent,
  Meme__Claim as Meme__ClaimEvent,
  Meme__StatusFee as Meme__StatusFeeEvent,
  Meme__ProviderFee as Meme__ProviderFeeEvent,
  Meme__ProtocolFee as Meme__ProtocolFeeEvent,
  Meme__Burn as Meme__BurnEvent,
  Meme__StatusUpated as Meme__StatusUpatedEvent,
  Transfer as TransferEvent,
} from "../generated/MemeFactory/Meme";
import {
  Directory,
  Token,
  Transaction,
  Buy,
  Sell,
  Account,
  TokenPosition,
} from "../generated/schema";
import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Meme as MemeContract } from "../generated/templates/Meme/Meme";
import { MemeFactory as FactoryContract } from "../generated/MemeFactory/MemeFactory";
import { updateTokenHourData, updateTokenDayData } from "./day-updates";
import {
  FACTORY_ADDRESS,
  ZERO_BD,
  ONE_BI,
  convertEthToDecimal,
} from "./helpers";

export function handleMeme__Buy(event: Meme__BuyEvent): void {
  let factoryContract = FactoryContract.bind(
    Address.fromString(FACTORY_ADDRESS)
  );
  let memeContract = MemeContract.bind(event.address);
  let index = factoryContract.getIndexByMeme(event.address);

  let factory = Directory.load(FACTORY_ADDRESS)!;
  factory.totalVolume = factory.totalVolume.plus(
    convertEthToDecimal(event.params.amountIn)
  );
  factory.txCount = factory.txCount.plus(ONE_BI);
  factory.save();

  let meme = Token.load(index.toString())!;

  meme.status = memeContract.status();
  meme.statusHolder = memeContract.statusHolder();
  meme.opened = memeContract.open();
  meme.reserveRealBase = convertEthToDecimal(memeContract.reserveBase());
  meme.reserveRealMeme = convertEthToDecimal(memeContract.reserveMeme());
  meme.totalSupply = convertEthToDecimal(memeContract.maxSupply());
  meme.floorPrice = convertEthToDecimal(memeContract.getFloorPrice());
  meme.marketPrice = convertEthToDecimal(memeContract.getMarketPrice());
  meme.totalFeesBase = convertEthToDecimal(memeContract.totalFeesBase());
  meme.volume = meme.volume.plus(convertEthToDecimal(event.params.amountIn));
  meme.txCount = meme.txCount.plus(ONE_BI);
  meme.save();

  let transaction = Transaction.load(event.transaction.hash.toHexString());
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHexString());
    transaction.timestamp = event.block.timestamp;
    transaction.blockNumber = event.block.number;
    transaction.buys = [];
    transaction.sells = [];
    transaction.contributes = [];
    transaction.save();
  }

  let buys = transaction.buys;
  let buy = new Buy(
    event.transaction.hash.toHexString() + "-" + buys.length.toString()
  );
  buy.transaction = transaction.id;
  buy.timestamp = transaction.timestamp;
  buy.memeId = BigInt.fromString(meme.id);
  buy.memeAddress = meme.meme;

  buy.account = event.params.to;
  buy.amountIn = convertEthToDecimal(event.params.amountIn);
  buy.amountOut = convertEthToDecimal(event.params.amountOut);
  buy.marketPrice = convertEthToDecimal(memeContract.getMarketPrice());
  buy.save();

  buys.push(buy.id);
  transaction.buys = buys;
  transaction.save();

  let tokenHourData = updateTokenHourData(event);
  tokenHourData.hourlyVolume = tokenHourData.hourlyVolume.plus(
    convertEthToDecimal(event.params.amountIn)
  );
  tokenHourData.save();

  let tokenDayData = updateTokenDayData(event);
  tokenDayData.dailyVolume = tokenDayData.dailyVolume.plus(
    convertEthToDecimal(event.params.amountIn)
  );
  tokenDayData.save();
}

export function handleMeme__Sell(event: Meme__SellEvent): void {
  let factoryContract = FactoryContract.bind(
    Address.fromString(FACTORY_ADDRESS)
  );
  let memeContract = MemeContract.bind(event.address);
  let index = factoryContract.getIndexByMeme(event.address);

  let factory = Directory.load(FACTORY_ADDRESS)!;
  factory.totalVolume = factory.totalVolume.plus(
    convertEthToDecimal(event.params.amountOut)
  );
  factory.txCount = factory.txCount.plus(ONE_BI);
  factory.save();

  let meme = Token.load(index.toString())!;

  meme.status = memeContract.status();
  meme.statusHolder = memeContract.statusHolder();
  meme.opened = memeContract.open();
  meme.reserveRealBase = convertEthToDecimal(memeContract.reserveBase());
  meme.reserveRealMeme = convertEthToDecimal(memeContract.reserveMeme());
  meme.totalSupply = convertEthToDecimal(memeContract.maxSupply());
  meme.floorPrice = convertEthToDecimal(memeContract.getFloorPrice());
  meme.marketPrice = convertEthToDecimal(memeContract.getMarketPrice());
  meme.totalFeesBase = convertEthToDecimal(memeContract.totalFeesBase());
  meme.volume = meme.volume.plus(convertEthToDecimal(event.params.amountOut));
  meme.txCount = meme.txCount.plus(ONE_BI);
  meme.save();

  let transaction = Transaction.load(event.transaction.hash.toHexString());
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHexString());
    transaction.timestamp = event.block.timestamp;
    transaction.blockNumber = event.block.number;
    transaction.buys = [];
    transaction.sells = [];
    transaction.contributes = [];
    transaction.save();
  }

  let sells = transaction.sells;
  let sell = new Sell(
    event.transaction.hash.toHexString() + "-" + sells.length.toString()
  );
  sell.transaction = transaction.id;
  sell.timestamp = transaction.timestamp;
  sell.memeId = BigInt.fromString(meme.id);
  sell.memeAddress = meme.meme;

  sell.account = event.params.to;
  sell.amountIn = convertEthToDecimal(event.params.amountIn);
  sell.amountOut = convertEthToDecimal(event.params.amountOut);
  sell.marketPrice = convertEthToDecimal(memeContract.getMarketPrice());
  sell.save();

  sells.push(sell.id);
  transaction.sells = sells;
  transaction.save();

  let tokenHourData = updateTokenHourData(event);
  tokenHourData.hourlyVolume = tokenHourData.hourlyVolume.plus(
    convertEthToDecimal(event.params.amountOut)
  );
  tokenHourData.save();

  let tokenDayData = updateTokenDayData(event);
  tokenDayData.dailyVolume = tokenDayData.dailyVolume.plus(
    convertEthToDecimal(event.params.amountOut)
  );
  tokenDayData.save();
}

export function handleTransfer(event: TransferEvent): void {
  let memeContract = MemeContract.bind(event.address);
  let from = event.params.from;
  let to = event.params.to;

  let fromAccount = Account.load(from);
  if (fromAccount === null) {
    fromAccount = new Account(from);
    fromAccount.providerEarnings = ZERO_BD;
    fromAccount.statusEarnings = ZERO_BD;
    fromAccount.holderEarnings = ZERO_BD;
  }

  let fromTokenPosition = TokenPosition.load(
    event.address.toHexString() + "-" + from.toHexString()
  );
  if (fromTokenPosition === null) {
    fromTokenPosition = new TokenPosition(
      event.address.toHexString() + "-" + from.toHexString()
    );
    fromTokenPosition.account = from;
    fromTokenPosition.meme = event.address;
  }
  fromTokenPosition.balance = convertEthToDecimal(memeContract.balanceOf(from));
  fromTokenPosition.claimable = convertEthToDecimal(
    memeContract.claimableBase(from)
  );
  fromTokenPosition.save();

  fromAccount.save();

  let toAccount = Account.load(to);
  if (toAccount === null) {
    toAccount = new Account(to);
    toAccount.providerEarnings = ZERO_BD;
    toAccount.statusEarnings = ZERO_BD;
    toAccount.holderEarnings = ZERO_BD;
  }

  let toTokenPosition = TokenPosition.load(
    event.address.toHexString() + "-" + to.toHexString()
  );
  if (toTokenPosition === null) {
    toTokenPosition = new TokenPosition(
      event.address.toHexString() + "-" + to.toHexString()
    );
    toTokenPosition.account = to;
    toTokenPosition.meme = event.address;
  }
  toTokenPosition.balance = convertEthToDecimal(memeContract.balanceOf(to));
  toTokenPosition.claimable = convertEthToDecimal(
    memeContract.claimableBase(to)
  );
  toTokenPosition.save();

  toAccount.save();
}

export function handleMeme__Claim(event: Meme__ClaimEvent): void {
  let memeContract = MemeContract.bind(event.address);

  let account = Account.load(event.params.account)!;
  account.holderEarnings = account.holderEarnings.plus(
    convertEthToDecimal(event.params.amountBase)
  );
  account.save();

  let tokenPosition = TokenPosition.load(
    event.address.toHexString() + "-" + event.params.account.toHexString()
  )!;
  tokenPosition.claimable = convertEthToDecimal(
    memeContract.claimableBase(event.params.account)
  );
  tokenPosition.save();
}

export function handleMeme__StatusFee(event: Meme__StatusFeeEvent): void {
  let memeContract = MemeContract.bind(event.address);

  let account = Account.load(event.params.account)!;
  account.statusEarnings = account.statusEarnings.plus(
    convertEthToDecimal(event.params.amountBase)
  );
  account.save();
}

export function handleMeme__ProviderFee(event: Meme__ProviderFeeEvent): void {
  let memeContract = MemeContract.bind(event.address);

  let account = Account.load(event.params.account)!;
  account.providerEarnings = account.providerEarnings.plus(
    convertEthToDecimal(event.params.amountBase)
  );
  account.save();
}

export function handleMeme__ProtocolFee(event: Meme__ProtocolFeeEvent): void {
  let factory = Directory.load(FACTORY_ADDRESS)!;

  factory.treasuryEarnings = factory.treasuryEarnings.plus(
    convertEthToDecimal(event.params.amountBase)
  );
  factory.save();
}

export function handleMeme__Burn(event: Meme__BurnEvent): void {
  let factoryContract = FactoryContract.bind(
    Address.fromString(FACTORY_ADDRESS)
  );
  let memeContract = MemeContract.bind(event.address);
  let index = factoryContract.getIndexByMeme(event.address);

  let meme = Token.load(index.toString())!;
  meme.totalSupply = convertEthToDecimal(memeContract.maxSupply());
  meme.floorPrice = convertEthToDecimal(memeContract.getFloorPrice());
  meme.save();
}

export function handleMeme__StatusUpated(event: Meme__StatusUpatedEvent): void {
  let factoryContract = FactoryContract.bind(
    Address.fromString(FACTORY_ADDRESS)
  );
  let memeContract = MemeContract.bind(event.address);
  let index = factoryContract.getIndexByMeme(event.address);

  let meme = Token.load(index.toString())!;
  meme.status = event.params.status;
  meme.statusHolder = event.params.account;
  meme.save();
}
