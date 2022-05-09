require("dotenv").config()
import { ethers } from "hardhat"

async function main() {
  const _validators: string[] = [
    "0xf5ccad6aa1f810ad734f02f4e35ee7cb51520547",
    "0x72aacb6e251800683e20f7f2bc45cca3ef67da89"
  ]

  const instanceAddress = "0x7E6832857f781b9f62cce895cBb09b118fA1A6dE"
  const proxyAddress = "0x38D75e1574bc6412D54d4617Fd64C760B560bf34"
  const UBridgeFactory = await ethers.getContractFactory("UBridge")
  const ProxyBridgeFactory = await ethers.getContractFactory("ProxyBridge")

  const initFunction = UBridgeFactory.interface.getFunction("init")
  const { chainId } = await ethers.provider.getNetwork()

  const initCallData = UBridgeFactory.interface.encodeFunctionData(initFunction, [
    _validators,
    chainId
  ])

  console.log(initCallData)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
