// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FeeManager {
    uint256 private platformFeePercentage;
    address private owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(uint256 _initialFeePercentage) {
        platformFeePercentage = _initialFeePercentage;
        owner = msg.sender;
    }

    function updatePlatformFee(uint256 _newPlatformFeePercent) public onlyOwner {
        platformFeePercentage = _newPlatformFeePercent;
    }

    function getPlatformFeePercentage() public view returns (uint256) {
        return platformFeePercentage;
    }
}