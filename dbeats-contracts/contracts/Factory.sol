// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './DBeatsNFT.sol';

contract DBeatsFactory is Ownable, AccessControl {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenCounter;
    address public platformWalletAddress;
    uint256 public platformFeePercentage;

    mapping(address => address[]) public nftsByCreator;

    // Define a new role identifier for the admin role
    bytes32 public constant ADMIN_ROLE = keccak256('ADMIN_ROLE');
    bytes32 public constant ARTIST_ROLE = keccak256('ARTIST_ROLE');

    event NewNFT(
        address indexed nftAddress,
        address _artistAddress,
        string _newTokenURI,
        string name,
        string symbol,
        uint256 mintPrice,
        string _genre
      
    );

    constructor(address _platformWalletAddress, uint256 _platformFeePercentage) AccessControl() {
        // Grant the admin role to the contract deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        platformWalletAddress = _platformWalletAddress;
        platformFeePercentage = _platformFeePercentage;
    }

    // // Function to add a user to a specific role
    function addUserToRole(bytes32 role, address account) public onlyOwner {
        grantRole(role, account);
    }

        // Function to add an admin
    function addAdmin(address account) public {
        // Check that the caller has the admin role
        require(hasRole(ADMIN_ROLE, msg.sender), 'Caller is not an admin');
        grantRole(ADMIN_ROLE, account);
    }

    // Function to add an artist
    function addArtist(address account) public {
        // Check that the caller has the admin role
        require(hasRole(ADMIN_ROLE, msg.sender), 'Caller is not an admin');
        grantRole(ARTIST_ROLE, account);
    }

    // Function to create a new NFT
    function createNFT(
        address _artistAddress,
        string memory _newTokenURI,
        string memory name,
        string memory symbol,
        uint256 mintPrice,
        string memory _genre
    ) public {
        // Check that the caller has the artist role
        require(hasRole(ARTIST_ROLE, msg.sender), "Caller is not an artist");

        _tokenCounter.increment();

        DBeatsNFT newNFT = new DBeatsNFT(
            _artistAddress,
            _newTokenURI,
            name,
            symbol,
            mintPrice,
            platformFeePercentage,
            platformWalletAddress,
            _genre
        );

        emit NewNFT(
            address(newNFT),
            _artistAddress,
            _newTokenURI,
            name,
            symbol,
            mintPrice,
            _genre
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

    //Function to update platform percentage fee
    function updatePlatformFee(uint256 _newPlatformFeePercent) external onlyOwner {
        platformFeePercentage = _newPlatformFeePercent;
    }
}
