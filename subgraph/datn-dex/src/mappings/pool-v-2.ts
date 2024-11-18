import {
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,
  Swap as SwapEvent,
  Sync as SyncEvent,
} from "../../generated/PoolV2/PoolV2"
import { AddLiquidity, RemoveLiquidity, Swap, Sync } from "../../generated/schema"

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  let entity = new AddLiquidity(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.sender = event.params.sender
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
  let entity = new RemoveLiquidity(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.sennder = event.params.sennder
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSwap(event: SwapEvent): void {
  let entity = new Swap(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.sender = event.params.sender
  entity.amount0In = event.params.amount0In
  entity.amount1In = event.params.amount1In
  entity.amount0Out = event.params.amount0Out
  entity.amount1Out = event.params.amount1Out

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSync(event: SyncEvent): void {
  let entity = new Sync(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.reserve0 = event.params.reserve0
  entity.reserve1 = event.params.reserve1

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
