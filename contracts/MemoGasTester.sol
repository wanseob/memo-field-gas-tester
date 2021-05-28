//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

struct Memo {
    bytes32 ephemeral;
    bytes cipherText;
}

contract MemoGasTester {
    uint256 slot0;

    fallback() external payable {
        slot0 = 10;
        delete slot0;
    }
}
