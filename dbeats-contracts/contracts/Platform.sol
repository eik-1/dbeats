// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Platform {

    address public platformWalletAddress;
    address private owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(address _platformWalletAddress) {
        platformWalletAddress = _platformWalletAddress;
        owner = msg.sender;
    }

    function updatePlatformWalletAddress(
        address _newPlatformWalletAddress
    ) public onlyOwner {
        platformWalletAddress = _newPlatformWalletAddress;
    }
}