import {
  MemeFactory__MemeCreated as MemeFactory__MemeCreatedEvent,
  MemeFactory__TreasuryUpdated as MemeFactory__TreasuryUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
} from "../generated/MemeFactory/MemeFactory";
import { Directory, Token } from "../generated/schema";
import { Meme, PreMeme } from "../generated/templates";
import { Address } from "@graphprotocol/graph-ts";
import { MemeFactory as FactoryContract } from "../generated/MemeFactory/MemeFactory";
import { Meme as MemeContract } from "../generated/templates/Meme/Meme";
import { PreMeme as PreMemeContract } from "../generated/templates/Meme/PreMeme";
import {
  FACTORY_ADDRESS,
  ZERO_BD,
  ZERO_BI,
  ONE_BI,
  convertEthToDecimal,
} from "./helpers";

export function handleMemeFactory__MemeCreated(
  event: MemeFactory__MemeCreatedEvent
): void {
  let factory = Directory.load(FACTORY_ADDRESS);
  if (factory === null) {
    factory = new Directory(FACTORY_ADDRESS);
    factory.memeCount = ZERO_BI;
    factory.txCount = ZERO_BI;
    factory.totalVolume = ZERO_BD;
    factory.treasuryEarnings = ZERO_BD;
    let factoryContract = FactoryContract.bind(
      Address.fromString(FACTORY_ADDRESS)
    );
    factory.owner = factoryContract.owner();
    factory.treasury = factoryContract.treasury();
  }
  factory.memeCount = factory.memeCount.plus(ONE_BI);
  factory.save();

  Meme.create(event.params.meme);
  let memeContract = MemeContract.bind(event.params.meme);
  PreMeme.create(memeContract.preMeme());
  let preMemeContract = PreMemeContract.bind(memeContract.preMeme());

  let meme = Token.load(event.params.index.toString());
  if (meme === null) {
    meme = new Token(event.params.index.toString());
    meme.name = memeContract.name();
    meme.symbol = memeContract.symbol();
    meme.uri = memeContract.uri();
    meme.status = memeContract.status();

    meme.meme = event.params.meme;
    meme.preMeme = memeContract.preMeme();
    meme.fees = memeContract.fees();
    meme.statusHolder = memeContract.statusHolder();

    meme.createdAt = event.block.timestamp;
    meme.openedAt = preMemeContract.endTimestamp();
    meme.opened = memeContract.open();

    meme.preMemeBalance = convertEthToDecimal(
      preMemeContract.totalMemeBalance()
    );
    meme.preMemeContributed = convertEthToDecimal(
      preMemeContract.totalBaseContributed()
    );
    meme.reserveVirtualBase = convertEthToDecimal(
      memeContract.RESERVE_VIRTUAL_BASE()
    );
    meme.reserveRealBase = convertEthToDecimal(memeContract.reserveBase());
    meme.reserveRealMeme = convertEthToDecimal(memeContract.reserveMeme());
    meme.totalSupply = convertEthToDecimal(memeContract.maxSupply());

    meme.floorPrice = convertEthToDecimal(memeContract.getFloorPrice());
    meme.marketPrice = convertEthToDecimal(memeContract.getMarketPrice());
    meme.totalFeesBase = convertEthToDecimal(memeContract.totalFeesBase());
    meme.volume = ZERO_BD;

    meme.txCount = ZERO_BI;
  }

  meme.save();
}

export function handleMemeFactory__TreasuryUpdated(
  event: MemeFactory__TreasuryUpdatedEvent
): void {
  let factory = Directory.load(FACTORY_ADDRESS);
  let factoryContract = FactoryContract.bind(
    Address.fromString(FACTORY_ADDRESS)
  );
  if (factory === null) {
    factory = new Directory(FACTORY_ADDRESS);
    factory.memeCount = ZERO_BI;
    factory.txCount = ZERO_BI;
    factory.totalVolume = ZERO_BD;
    factory.owner = factoryContract.owner();
    factory.treasury = factoryContract.treasury();
    factory.treasuryEarnings = ZERO_BD;
  } else {
    factory.treasury = factoryContract.treasury();
  }
  factory.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let factory = Directory.load(FACTORY_ADDRESS);
  let factoryContract = FactoryContract.bind(
    Address.fromString(FACTORY_ADDRESS)
  );
  if (factory === null) {
    factory = new Directory(FACTORY_ADDRESS);
    factory.memeCount = ZERO_BI;
    factory.txCount = ZERO_BI;
    factory.totalVolume = ZERO_BD;
    factory.owner = factoryContract.owner();
    factory.treasury = factoryContract.treasury();
    factory.treasuryEarnings = ZERO_BD;
  } else {
    factory.owner = factoryContract.treasury();
  }
  factory.save();
}
