// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract DBeatsNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public _mintPrice;
    uint256 private _platformFeePercentage;
    string public _uri;
    address public _artistAddress;
    address public _platformWalletAddress; //can set to private
    string public _genre;

    event Minted(address indexed to, uint256 indexed tokenId, string uri);

    modifier onlyAdmin() {
        require(
            msg.sender == _platformWalletAddress,
            'Only platform admin wallet can call this function'
        );
        _;
    }

    modifier onlyArtist() {
        require(
            msg.sender == _artistAddress,
            'Only artist can call this function'
        );
        _;
    }

    constructor(
        address artistAddress,
        string memory _newTokenURI,
        string memory _name,
        string memory _symbol,
        uint256 mintPrice,
        uint256 platformFeePercentage,
        address platformWalletAddress,
        string memory  genre
    ) ERC721(_name, _symbol) {
        _uri = _newTokenURI;
        _artistAddress = artistAddress;
        _mintPrice = mintPrice;
        _platformFeePercentage = platformFeePercentage;
        _platformWalletAddress = platformWalletAddress;
        _genre = genre;
    }

    function mint(address to, uint256 quantity) public payable {
        require(quantity > 0, 'Quantity must be greater than 0');
        require(msg.value >= quantity * _mintPrice, 'Insufficient ETH sent');
        uint256 fee = (msg.value * _platformFeePercentage) / 100;
        payable(_platformWalletAddress).transfer(fee);
        for (uint256 i = 0; i < quantity; i++) {
            _tokenIdCounter.increment();
            uint256 tokenId = _tokenIdCounter.current();
            _safeMint(to, tokenId);
            emit Minted(to, tokenId, tokenURI(tokenId));
            _setTokenURI(tokenId, _uri);
        }
    }

    function updatePlatformFee(
        uint256 _newPlatformFeePercent
    ) external onlyAdmin {
        _platformFeePercentage = _newPlatformFeePercent;
    }

    function updatePlatformWalletAddress(address _newPlatformWalletAddress) external onlyAdmin {
        _platformWalletAddress = _newPlatformWalletAddress;
    }

    function withdraw() public onlyArtist {
        require(msg.sender == _artistAddress, 'Only the artist can withdraw');
        payable(msg.sender).transfer(address(this).balance);
    }

    //overrides for solidity

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return _uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return _uri;
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

}
