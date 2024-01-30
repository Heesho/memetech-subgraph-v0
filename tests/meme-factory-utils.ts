import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  MemeFactory__MemeCreated,
  MemeFactory__MinAmountInUpdated,
  MemeFactory__TreasuryUpdated,
  OwnershipTransferred
} from "../generated/MemeFactory/MemeFactory"

export function createMemeFactory__MemeCreatedEvent(
  index: BigInt,
  meme: Address
): MemeFactory__MemeCreated {
  let memeFactoryMemeCreatedEvent = changetype<MemeFactory__MemeCreated>(
    newMockEvent()
  )

  memeFactoryMemeCreatedEvent.parameters = new Array()

  memeFactoryMemeCreatedEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  memeFactoryMemeCreatedEvent.parameters.push(
    new ethereum.EventParam("meme", ethereum.Value.fromAddress(meme))
  )

  return memeFactoryMemeCreatedEvent
}

export function createMemeFactory__MinAmountInUpdatedEvent(
  minAmountIn: BigInt
): MemeFactory__MinAmountInUpdated {
  let memeFactoryMinAmountInUpdatedEvent =
    changetype<MemeFactory__MinAmountInUpdated>(newMockEvent())

  memeFactoryMinAmountInUpdatedEvent.parameters = new Array()

  memeFactoryMinAmountInUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "minAmountIn",
      ethereum.Value.fromUnsignedBigInt(minAmountIn)
    )
  )

  return memeFactoryMinAmountInUpdatedEvent
}

export function createMemeFactory__TreasuryUpdatedEvent(
  treasury: Address
): MemeFactory__TreasuryUpdated {
  let memeFactoryTreasuryUpdatedEvent =
    changetype<MemeFactory__TreasuryUpdated>(newMockEvent())

  memeFactoryTreasuryUpdatedEvent.parameters = new Array()

  memeFactoryTreasuryUpdatedEvent.parameters.push(
    new ethereum.EventParam("treasury", ethereum.Value.fromAddress(treasury))
  )

  return memeFactoryTreasuryUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
