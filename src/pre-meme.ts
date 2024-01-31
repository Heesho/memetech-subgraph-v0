import {
  PreMeme__Contributed as PreMeme__ContributedEvent,
  PreMeme__MarketOpened as PreMeme__MarketOpenedEvent,
  PreMeme__Redeemed as PreMeme__RedeemedEvent,
} from "../generated/MemeFactory/PreMeme";
import {
  Token,
  Transaction,
  Account,
  PreTokenPosition,
  Contribute,
} from "../generated/schema";
import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Meme as MemeContract } from "../generated/templates/Meme/Meme";
import { PreMeme as PreMemeContract } from "../generated/templates/Meme/PreMeme";
import { MemeFactory as FactoryContract } from "../generated/MemeFactory/MemeFactory";
import { FACTORY_ADDRESS, ZERO_BD, convertEthToDecimal } from "./helpers";

export function handlePreMeme__MarketOpened(
  event: PreMeme__MarketOpenedEvent
): void {
  let factoryContract = FactoryContract.bind(
    Address.fromString(FACTORY_ADDRESS)
  );
  //   let memeContract = MemeContract.bind(event.address);
  //   let index = factoryContract.getIndexByMeme(event.address);

  //   let meme = Token.load(index.toString())!;
  //   meme.openedAt = event.block.timestamp;
  //   meme.opened = memeContract.open();
  //   meme.marketPrice = convertEthToDecimal(memeContract.getMarketPrice());
  //   meme.save();
}

export function handlePreMeme__Contributed(
  event: PreMeme__ContributedEvent
): void {
  let factoryContract = FactoryContract.bind(
    Address.fromString(FACTORY_ADDRESS)
  );
  //   let memeContract = MemeContract.bind(event.address);
  let preMemeContract = PreMemeContract.bind(event.address);
  //   let index = factoryContract.getIndexByMeme(event.address);

  //   let meme = Token.load(index.toString())!;

  //   meme.preMemeBalance = convertEthToDecimal(preMemeContract.totalMemeBalance());
  //   meme.preMemeContributed = convertEthToDecimal(
  //     preMemeContract.totalBaseContributed()
  //   );
  //   meme.marketPrice = convertEthToDecimal(memeContract.getMarketPrice());
  //   meme.save();

  //   let transaction = new Transaction(event.transaction.hash.toHexString());
  //   if (transaction === null) {
  //     transaction = new Transaction(event.transaction.hash.toHexString());
  //     transaction.timestamp = event.block.timestamp;
  //     transaction.blockNumber = event.block.number;
  //     transaction.buys = [];
  //     transaction.sells = [];
  //     transaction.contributes = [];
  //     transaction.save();
  //   }

  //   let contributes = transaction.contributes;
  //   let contribute = new Contribute(
  //     event.transaction.hash.toHexString() + "-" + contributes.length.toString()
  //   );
  //   contribute.transaction = transaction.id;
  //   contribute.timestamp = event.block.timestamp;
  //   contribute.memeId = BigInt.fromString(meme.id);
  //   contribute.memeAddress = meme.meme;

  //   contribute.account = event.params.account;
  //   contribute.amountIn = convertEthToDecimal(event.params.amount);
  //   contribute.marketPrice = convertEthToDecimal(memeContract.getMarketPrice()); // ToDo get price from multicall
  //   contribute.save();

  //   contributes.push(contribute.id);
  //   transaction.contributes = contributes;
  //   transaction.save();

  let account = Account.load(event.params.account);
  if (account === null) {
    account = new Account(event.params.account);
    account.providerEarnings = ZERO_BD;
    account.statusEarnings = ZERO_BD;
    account.holderEarnings = ZERO_BD;
  }

  let preTokenPosition = PreTokenPosition.load(
    event.address.toHexString() + "-" + event.params.account.toHexString()
  );
  if (preTokenPosition === null) {
    preTokenPosition = new PreTokenPosition(
      event.address.toHexString() + "-" + event.params.account.toHexString()
    );
    preTokenPosition.account = event.params.account;
    preTokenPosition.meme = event.address;
    preTokenPosition.redeemed = ZERO_BD;
  }
  preTokenPosition.contributed = convertEthToDecimal(
    preMemeContract.account_BaseContributed(event.params.account)
  );
  preTokenPosition.save();
  account.save();
}

export function handlePreMeme__Redeemed(event: PreMeme__RedeemedEvent): void {
  //   let factoryContract = FactoryContract.bind(
  //     Address.fromString(FACTORY_ADDRESS)
  //   );
  //   let memeContract = MemeContract.bind(event.address);
  //   let preMemeContract = PreMemeContract.bind(event.address);
  //   let index = factoryContract.getIndexByMeme(event.address);
  //   let meme = Token.load(index.toString())!;
  //   meme.preMemeBalance = convertEthToDecimal(preMemeContract.totalMemeBalance());
  //   meme.preMemeContributed = convertEthToDecimal(
  //     preMemeContract.totalBaseContributed()
  //   );
  //   meme.opened = memeContract.open();
  //   meme.marketPrice = convertEthToDecimal(memeContract.getMarketPrice());
  //   meme.save();
  //   let preTokenPosition = PreTokenPosition.load(
  //     event.address.toHexString() + "-" + event.params.account.toHexString()
  //   );
  //   if (preTokenPosition === null) {
  //     preTokenPosition = new PreTokenPosition(
  //       event.address.toHexString() + "-" + event.params.account.toHexString()
  //     );
  //     preTokenPosition.account = event.params.account;
  //     preTokenPosition.meme = meme.meme;
  //     preTokenPosition.redeemed = ZERO_BD;
  //   }
  //   preTokenPosition.contributed = convertEthToDecimal(
  //     preMemeContract.account_BaseContributed(event.params.account)
  //   );
  //   preTokenPosition.redeemed = preTokenPosition.redeemed.plus(
  //     convertEthToDecimal(event.params.amount)
  //   );
  //   preTokenPosition.save();
}
