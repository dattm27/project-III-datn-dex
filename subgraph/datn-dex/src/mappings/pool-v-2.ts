import {
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,
  Swap as SwapEvent,
  Sync as SyncEvent,
} from "../../generated/templates/PoolV2/PoolV2"
import { AddLiquidity, Pool, RemoveLiquidity, Swap, Sync, Transaction } from "../../generated/schema"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let addLiquidity = new AddLiquidity(id)
  addLiquidity.sender = event.params.sender
  addLiquidity.amount0 = event.params.amount0
  addLiquidity.amount1 = event.params.amount1

  addLiquidity.blockNumber = event.block.number
  addLiquidity.blockTimestamp = event.block.timestamp


  //create transaction
  let transaction = new Transaction(id)
  transaction.type = "ADD_LIQUIDITY";
  transaction.blockNumber = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.sender = event.params.sender;
  transaction.pool = event.address.toHex();

  addLiquidity.transaction = transaction.id;

  transaction.save()
  addLiquidity.save()

  let pool = Pool.load(event.address.toString())
  if (pool) {
    //update pool reserves
    pool.reserve0 = pool.reserve0.plus(event.params.amount0);
    pool.reserve1 = pool.reserve1.plus(event.params.amount1);
    pool.save();
    //update liquidity provider shares
  }
}


export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let removeLiquidity = new RemoveLiquidity(id)
  removeLiquidity.sender = event.params.sennder
  removeLiquidity.amount0 = event.params.amount0
  removeLiquidity.amount1 = event.params.amount1

  removeLiquidity.blockNumber = event.block.number
  removeLiquidity.blockTimestamp = event.block.timestamp
  
  //create transaction
  let transaction = new Transaction(id)
  transaction.type = "REMOVE_LIQUIDITY";
  transaction.blockNumber = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.sender = event.params.sennder;
  transaction.pool = event.address.toHex();

  removeLiquidity.transaction = transaction.id;
  
  removeLiquidity.save()
  transaction.save()


  let pool = Pool.load(event.address.toString())
  if (pool) {
    //update pool reserves
    pool.reserve0 = pool.reserve0.minus(event.params.amount0);
    pool.reserve1 = pool.reserve1.minus(event.params.amount1);
    pool.save();
  }
}

export function handleSwap(event: SwapEvent): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());

  let swap = new Swap(id)
  swap.sender = event.params.sender
  swap.amount0In = event.params.amount0In
  swap.amount1In = event.params.amount1In
  swap.amount0Out = event.params.amount0Out
  swap.amount1Out = event.params.amount1Out

  swap.blockNumber = event.block.number
  swap.blockTimestamp = event.block.timestamp

  //create transaction
  let transaction = new Transaction(id)
  transaction.type = "SWAP";
  transaction.blockNumber = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.sender = event.params.sender;
  transaction.pool = event.address.toHex();

  swap.transaction = transaction.id;
  
  swap.save()
  transaction.save()

  let pool = Pool.load(event.address.toString())
  if (pool) {
    //update pool reserves
    pool.reserve0 = pool.reserve0.plus(event.params.amount0In).minus(event.params.amount0Out);
    pool.reserve1 = pool.reserve1.plus(event.params.amount1In).minus(event.params.amount1Out);
    pool.save();
  }
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
  if (pool) {
    // Update pool reserves
    pool.reserve0 = event.params.reserve0;
    pool.reserve1 = event.params.reserve1;

    pool.save();
  }

}
