const { defaultAbiCoder } = require('@ethersproject/abi')
const { randomBytes } = require('@ethersproject/random')
const { expect } = require('chai')

describe('MemoGasTester', function () {
  it("Should return the new greeting once it's changed", async function () {
    const MemoGasTester = await ethers.getContractFactory('MemoGasTester')
    const tester = await MemoGasTester.deploy()
    const memo = {
      ephemeral: ethers.utils.hexlify(randomBytes(32)),
      cipherText: '0x' + Array(49).fill('ab').join('')
    }
    const dummyFunSigForFallback = '0xabcdef12'
    const dummyMemoV1 = memo.ephemeral + memo.cipherText.slice(2)
    const dummyMemoV2 = defaultAbiCoder.encode(['bytes32', 'bytes'], [memo.ephemeral, memo.cipherText])
    const calldataMemoV1 = dummyFunSigForFallback + dummyMemoV1.slice(2)
    const calldataMemoV2 = dummyFunSigForFallback + dummyMemoV2.slice(2)

    const [signer] = await ethers.getSigners()
    const [response1, response2] = await Promise.all([
      signer.sendTransaction({
        to: tester.address,
        data: calldataMemoV1,
      }),
      signer.sendTransaction({
        to: tester.address,
        data: calldataMemoV2,
      }),
    ])
    const [receipt1, receipt2] = await Promise.all([response1.wait(), response2.wait()])
    const v1Cost = receipt1.gasUsed.toNumber()
    const v2Cost = receipt2.gasUsed.toNumber()
    console.log('v1:', v1Cost)
    console.log('v2:', v2Cost)
    console.log('diff:', v2Cost - v1Cost)
  })
})
