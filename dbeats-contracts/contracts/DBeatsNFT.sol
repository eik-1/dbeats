// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DBeatsNFT is ERC721, ERC721URIStorage, Ownable {

    uint256 private _currentTokenId = 0;
    uint256 public _mintPrice;
    uint256 private _platformFeePercentage;
    uint256 public _royaltyFeePercentage;
    string public _uri;
    address public _artistAddress;
    address public _adminAddress;
    address private _platformWalletAddress;

    event RoyaltyPaid(address indexed artist, address indexed buyer, uint256 amount);
    event Minted(address indexed to, uint256 indexed tokenId, string uri);

    constructor(
        address adminAddress,
        uint256 royaltyFeePercentage,
        address artistAddress,
        string memory _newTokenURI,
        string memory _name,
        string memory _symbol,
        uint256 mintPrice,
        uint256 platformFeePercentage,
        address platformWalletAddress
    ) ERC721(_name, _symbol) {
        _uri = _newTokenURI;
        _adminAddress = adminAddress;
        _artistAddress = artistAddress;
        _mintPrice = mintPrice;
        _platformFeePercentage = platformFeePercentage;
        _platformWalletAddress = platformWalletAddress;
        _royaltyFeePercentage = royaltyFeePercentage;
    }

    function mint(address to, uint256 quantity) public payable {
        require(quantity > 0, "Quantity must be greater than 0");
        require(msg.value >= quantity * _mintPrice, "Insufficient ETH sent");
        uint256 fee = (msg.value * _platformFeePercentage) / 100;
        payable(_platformWalletAddress).transfer(fee);
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, _currentTokenId);
            emit Minted(to, _currentTokenId, tokenURI(_currentTokenId));
            _setTokenURI(_currentTokenId, _uri);
            _currentTokenId++;
        }
    }

    function updatePlatformFee(uint256 _newPlatformFeePercent) external onlyOwner {
        _platformFeePercentage = _newPlatformFeePercent;
    }

    function withdraw() public {
        require(msg.sender == _artistAddress, "Only the artist can withdraw");
        payable(msg.sender).transfer(address(this).balance);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return _uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return _uri;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721) {
        if (from != address(0) && to != address(0)) {
            uint256 royaltyAmount = (msg.value * _royaltyFeePercentage) / 100;
            payable(_artistAddress).transfer(royaltyAmount);
            emit RoyaltyPaid(_artistAddress, to, royaltyAmount);
        }
        super._beforeTokenTransfer(from, to, tokenId);
    }
}