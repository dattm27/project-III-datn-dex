# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```


```shell
npx hardhat deploy --network sepolia --tags ERC20Token
```

Deploy factory
```shell
npx hardhat deploy --network fuji --tags PoolV2Factory
```
Script to create Pool ERC20/ERC20
```
npx ts-node scripts/v2-core/01_createPool.ts    
```