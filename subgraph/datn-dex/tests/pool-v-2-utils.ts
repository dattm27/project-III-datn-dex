import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AddLiquidity,
  RemoveLiquidity,
  Swap,
  Sync
} from "../generated/PoolV2/PoolV2"

export function createAddLiquidityEvent(
  sender: Address,
  amount0: BigInt,
  amount1: BigInt
): AddLiquidity {
  let addLiquidityEvent = changetype<AddLiquidity>(newMockEvent())

  addLiquidityEvent.parameters = new Array()

  addLiquidityEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  addLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "amount0",
      ethereum.Value.fromUnsignedBigInt(amount0)
    )
  )
  addLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "amount1",
      ethereum.Value.fromUnsignedBigInt(amount1)
    )
  )

  return addLiquidityEvent
}

export function createRemoveLiquidityEvent(
  sennder: Address,
  amount0: BigInt,
  amount1: BigInt
): RemoveLiquidity {
  let removeLiquidityEvent = changetype<RemoveLiquidity>(newMockEvent())

  removeLiquidityEvent.parameters = new Array()

  removeLiquidityEvent.parameters.push(
    new ethereum.EventParam("sennder", ethereum.Value.fromAddress(sennder))
  )
  removeLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "amount0",
      ethereum.Value.fromUnsignedBigInt(amount0)
    )
  )
  removeLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "amount1",
      ethereum.Value.fromUnsignedBigInt(amount1)
    )
  )

  return removeLiquidityEvent
}

export function createSwapEvent(
  sender: Address,
  amount0In: BigInt,
  amount1In: BigInt,
  amount0Out: BigInt,
  amount1Out: BigInt
): Swap {
  let swapEvent = changetype<Swap>(newMockEvent())

  swapEvent.parameters = new Array()

  swapEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amount0In",
      ethereum.Value.fromUnsignedBigInt(amount0In)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amount1In",
      ethereum.Value.fromUnsignedBigInt(amount1In)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amount0Out",
      ethereum.Value.fromUnsignedBigInt(amount0Out)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amount1Out",
      ethereum.Value.fromUnsignedBigInt(amount1Out)
    )
  )

  return swapEvent
}

export function createSyncEvent(reserve0: BigInt, reserve1: BigInt): Sync {
  let syncEvent = changetype<Sync>(newMockEvent())

  syncEvent.parameters = new Array()

  syncEvent.parameters.push(
    new ethereum.EventParam(
      "reserve0",
      ethereum.Value.fromUnsignedBigInt(reserve0)
    )
  )
  syncEvent.parameters.push(
    new ethereum.EventParam(
      "reserve1",
      ethereum.Value.fromUnsignedBigInt(reserve1)
    )
  )

  return syncEvent
}
