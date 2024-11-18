import {
  Initialized as InitializedEvent,
  PoolCreated as PoolCreatedEvent
} from "../generated/PoolV2Factory/PoolV2Factory"
import { Initialized, Pool, Token } from "../generated/schema"
import {ERC20} from "../generated/PoolV2Factory/ERC20"
import { Address } from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import { PoolV2 as PoolV2Ins } from "../generated/templates"

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePoolCreated(event: PoolCreatedEvent): void {
  let entity = new Pool(
    event.params.pair.toString()
  )


  //contract instance 
  let token0 = getTokenDetails(event.params.token0)
  let token1 = getTokenDetails(event.params.token1)

  entity.token0 = token0.id
  entity.token1 = token1.id

  entity.pair = event.params.pair
  entity.param3 = event.params.param3

  entity.reserve0 = new BigInt(0) ;
  entity.reserve1 = new BigInt(0) ;


  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  PoolV2Ins.create(event.params.pair)
}

//check if token exists and create if needed
function getTokenDetails(tokenAddress: Address): Token {
  let token = Token.load(tokenAddress.toHex())
  if (token == null) {
    token = new Token(tokenAddress.toHex())
    let tokenContract = ERC20.bind(tokenAddress)

    let tokenName = tokenContract.try_name()
    let tokenSymbol = tokenContract.try_symbol()
    let tokenDecimals = tokenContract.try_decimals()

    token.name = !tokenName.reverted ? tokenName.value : "Unknown Token"
    token.symbol = !tokenSymbol.reverted ? tokenSymbol.value : "UNKNOWN"
    token.decimals = !tokenDecimals.reverted ? tokenDecimals.value : 18
    token.save()
  }
  return token as Token
}
