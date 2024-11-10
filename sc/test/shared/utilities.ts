import { Contract, ParamType } from 'ethers'
import {

  getAddress,
  keccak256,
  AbiCoder,
  toUtf8Bytes,
  solidityPacked
} from 'ethers'


const PERMIT_TYPEHASH = keccak256(
  toUtf8Bytes('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)')
)

export const encoder  = (types: readonly (string | ParamType)[], values: readonly any[]) => {
  const abiCoder = new AbiCoder () ;
  return abiCoder.encode(types, values);
};



