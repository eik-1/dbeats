// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DBeatsNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 private _currentTokenId = 0;
    string public _uri;
    // uint256 _intitalMintAmount;
    address _artistAddress;
    uint256 public _mintPrice;

    constructor(
        address initialOwner,
        address artistAddress,
        string memory _newTokenURI,
        // uint256 _mintAmount,
        string memory _name,
        string memory _symbol,
        uint256 mintPrice
    ) ERC721(_name, _symbol) {
        _uri = _newTokenURI;
        // _intitalMintAmount = _mintAmount;
        _artistAddress = artistAddress;
        _mintPrice = mintPrice;
        // mint(_artistAddress, _intitalMintAmount);
    }

    //batch minting
    function mint(address to, uint256 quantity) public payable {
        require(quantity > 0, "Quantity must be greater than 0");
        require(msg.value >= quantity * _mintPrice, "Insufficient ETH sent");
            _safeMint(to, _currentTokenId);
            _setTokenURI(_currentTokenId, _uri); // Set the URI for each token
            _currentTokenId++;
    }

    // Override tokenURI to return the _uri directly
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return _uri;
    }

    // function supportsInterface(bytes4 interfaceId)
    //     public
    //     view
    //     override(ERC721, ERC721URIStorage)
    //     returns (bool)
    // {
    //     return super.supportsInterface(interfaceId);
    // }

    function _baseURI() internal view override returns (string memory) {
        return _uri;
    }

    // Override _burn function
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
