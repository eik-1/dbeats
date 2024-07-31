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
    Counters.Counter private _artistCounter;
    address public platformWalletAddress;
    ArtistNFT public artistNFTContract;

    mapping(address => address[]) public nftsByCreator;
    mapping(uint256 => address) public artist;

    // Define a new role identifier for the admin role
    bytes32 public constant ADMIN_ROLE = keccak256('ADMIN_ROLE');
    bytes32 public constant ARTIST_ROLE = keccak256('ARTIST_ROLE');

    event NewNFT(
        address indexed nftAddress,
        uint256 _royaltyFeePercentage,
        address _artistAddress,
        string _newTokenURI,
        string name,
        string symbol,
        uint256 mintPrice
    );

    event ArtistAdded(address indexed artistAddress, uint256 artistNFTId);

    constructor(
        address _platformWalletAddress,
        address _artistNFTAddress
    ) AccessControl() {
        // Grant the admin role to the contract deployer
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        platformWalletAddress = _platformWalletAddress;
        artistNFTContract = ArtistNFT(_artistNFTAddress);
    }

    // Function to add an admin
    function addAdmin(address account) public onlyRole(ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, account);
    }

    // Function to add an artist and mint nft to their account
    function addArtist(address account) public onlyRole(ADMIN_ROLE) {
        require(account != address(0), 'Invalid artist address');
        require(!hasRole(ARTIST_ROLE, account), 'Address is already an artist');

        /* GRANT ARTIST ROLE */
        grantRole(ARTIST_ROLE, account);

        /* MINT ARTIST NFT TO THEIR ACCOUNT */
        uint256 newTokenId = artistNFTContract.safeMint(account);
        emit ArtistAdded(account, newTokenId);

        artist[_artistCounter.current()] = account;
        _artistCounter.increment();
    }

    function createNFT(
        string memory _newTokenURI,
        string memory name,
        string memory symbol,
        uint256 mintPrice,
        uint256 _platformFeePercentage,
    ) public onlyRole(ARTIST_ROLE) {
        _tokenCounter.increment();

        DBeatsNFT newNFT = new DBeatsNFT(
            msg.sender,
            _newTokenURI,
            name,
            symbol,
            mintPrice,
            _platformFeePercentage,
            platformWalletAddress
        );

        // Use the NFT (mint it to the artist or the marketplace address)

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

    function updateArtistNFTContract(address _newArtistNFTAddress) public onlyRole(ADMIN_ROLE) {
        require(_newArtistNFTAddress != address(0), "Invalid ArtistNFT contract address");
        artistNFTContract = D_Beats_Artist(_newArtistNFTAddress);
    }
}
