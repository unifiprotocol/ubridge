require("dotenv").config()
import { ethers, hardhatArguments } from "hardhat"

async function main() {
  const _validators = (process.env.VALIDATORS ?? "").split(",")
  if (_validators.length <= 1) {
    throw Error("Not enought validators, use --validators param")
  }

  const UBridgeFactory = await ethers.getContractFactory("UBridge")
  const bridgeInstance = await UBridgeFactory.deploy()

  const ProxyFactory = await ethers.getContractFactory("ProxyBridge")
  const initFunction = UBridgeFactory.interface.getFunction("init")
  const { chainId } = await ethers.provider.getNetwork()

  const initCallData = UBridgeFactory.interface.encodeFunctionData(initFunction, [
    _validators,
    chainId
  ])

  const proxyInstance = await ProxyFactory.deploy(
    bridgeInstance.address,
    initCallData
    //     , {
    //     gasLimit: 4712388,
    //     gasPrice: 100000000000
    //   }
  )
  console.log(`Bridge contract successfully deployed: ${bridgeInstance.address}`)
  console.log(`Proxy successfully deployed: ${proxyInstance.address}`)

  console.log(
    `verify uBridge: yarn hardhat verify --contract contracts/UBridge.sol:UBridge --network ${hardhatArguments.network} ${bridgeInstance.address}`
  )
  console.log(
    `verify Proxy: yarn hardhat verify --contract contracts/ProxyBridge.sol:ProxyBridge --network ${hardhatArguments.network} ${proxyInstance.address} ${bridgeInstance.address} ${initCallData}`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
