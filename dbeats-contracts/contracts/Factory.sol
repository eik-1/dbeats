// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './DBeatsNFT.sol';
import './ArtistNFT.sol';

contract DBeatsFactory is Ownable, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenCounter;
    address public platformWalletAddress;

    mapping(address => address[]) public nftsByCreator;

    // Define a new role identifier for the admin role
    bytes32 public constant ADMIN_ROLE = keccak256('ADMIN_ROLE');

    event NewNFT(
        address indexed nftAddress,
        uint256 _royaltyFeePercentage,
        address _artistAddress,
        string _newTokenURI,
        string name,
        string symbol,
        uint256 mintPrice
    );

    constructor(address _platformWalletAddress) AccessControl() {
        // Grant the admin role to the contract deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        platformWalletAddress = _platformWalletAddress;
    }

    // Function to add a user to a specific role
    function addUserToRole(bytes32 role, address account) public onlyOwner {
        grantRole(role, account);
    }

    function createNFT(
        // address _admin,
        address _artistAddress,
        string memory _newTokenURI,
        string memory name,
        string memory symbol,
        uint256 mintPrice,
        uint256 _platformFeePercentage,
        uint256 _royaltyFeePercentage
    ) public {
        // Check that the caller has the admin role
        require(hasRole(ADMIN_ROLE, msg.sender), 'Caller is not an admin');

        _tokenCounter.increment();

        DBeatsNFT newNFT = new DBeatsNFT(
            // _admin,
            _royaltyFeePercentage,
            _artistAddress,
            _newTokenURI,
            name,
            symbol,
            mintPrice,
            _platformFeePercentage,
            platformWalletAddress
        );

        emit NewNFT(
            address(newNFT),
            _royaltyFeePercentage,
            _artistAddress,
            _newTokenURI,
            name,
            symbol,
            mintPrice
        );

        nftsByCreator[_artistAddress].push(address(newNFT));
    }

    // Function to get NFTs created by a specific address
    function getNFTsByCreator(
        address creator
    ) public view returns (address[] memory) {
        return nftsByCreator[creator];
    }

    // Function to get the current token count
    function getTokenCount() public view returns (uint256) {
        return _tokenCounter.current();
    }
}
