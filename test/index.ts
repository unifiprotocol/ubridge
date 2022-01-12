import { expect } from 'chai'
import { ethers } from 'hardhat'
import { UBridge } from '../typechain'

describe('uBridge', function () {
  let contractInstance: UBridge
  beforeEach(async () => {
    const [signer] = await ethers.getSigners()
    const signerAddress = await signer.getAddress()
    contractInstance = await deployContract(signerAddress, 1)
  })
  it('Should deploy contract and have the passed parameters', async function () {
    const [signer] = await ethers.getSigners()
    const signerAddress = await signer.getAddress()
    expect(await contractInstance.verifyAddress(), 'Wrong verify address').to.be.equal(
      signerAddress
    )
    expect(await (await contractInstance.chainId()).toNumber(), 'Wrong chain id').equal(1)
  })
  it('Should change verify address and return new one', async function () {
    const [signer, second] = await ethers.getSigners()
    const secondAddress = await second.getAddress()
    await contractInstance.changeVerifySigner(secondAddress)
    const verifyAddress = await contractInstance.verifyAddress()
    expect(verifyAddress).equal(secondAddress)
  })
  it('Should add chainId=3 to supportedChainIds', async function () {
    const [signer, second] = await ethers.getSigners()
    const secondAddress = await second.getAddress()
    const chainIdsToAdd = [2, 3]
    await contractInstance.addChainId(chainIdsToAdd)
    const [c1, c2] = await Promise.all(
      chainIdsToAdd.map((chainId) => contractInstance.chainIdSupported(chainId))
    )
    expect(c1).true
    expect(c2).true
  })
})

async function deployContract(verifyAddress: string, chainId: number) {
  const UBridgeFactory = await ethers.getContractFactory('UBridge')
  return UBridgeFactory.deploy(verifyAddress, chainId)
}
