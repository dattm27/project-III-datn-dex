import {
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,
  Swap as SwapEvent,
  Sync as SyncEvent,
} from "../../generated/templates/PoolV2/PoolV2"
import { AddLiquidity, LiquidityProvider, Pool, RemoveLiquidity, Swap, Sync } from "../../generated/schema"

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

  let pool = Pool.load(event.address.toString())
  if (pool == null) return ;
  //add AddLiquidity object to Pool
 

  
  //update pool reserves
  pool.reserve0 =   pool.reserve0.plus(event.params.amount0);
  pool.reserve1 =   pool.reserve1.plus(event.params.amount1);
  pool.save();
  //update liquidity provider shares
  // let lp  = LiquidityProvider.load()

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

  let pool = Pool.load(event.address.toString())
  if (pool == null) return ;
  //add RemoveLuidity object to Pool

  //update pool reserves
  pool.reserve0 =   pool.reserve0.minus(event.params.amount0);
  pool.reserve1 =   pool.reserve1.minus(event.params.amount1);
  pool.save();

  //update liquidity provider shares

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

  let pool = Pool.load(event.address.toString())
  if (pool == null) return ;
  //add Swap object to Pool


  //update pool reserves
  pool.reserve0 = pool.reserve0.plus(event.params.amount0In).minus(event.params.amount0Out);
  pool.reserve1 = pool.reserve1.plus(event.params.amount1In).minus(event.params.amount1Out);


  pool.save();
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

  let pool = Pool.load(event.address.toHex());
  if (!pool) return;

  // Update pool reserves
  pool.reserve0 = event.params.reserve0;
  pool.reserve1 = event.params.reserve1;

  pool.save();

}
