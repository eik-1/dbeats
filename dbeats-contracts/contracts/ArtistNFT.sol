// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract ArtistNFT is ERC721, ERC721URIStorage, Ownable, AccessControl {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
    string private uri;

    event Attest(address indexed to, uint256 indexed tokenId);
    event Revoke(address indexed to, uint256 indexed tokenId);

    constructor(string memory _uri) ERC721('DBeats_Artist', 'DBA') {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        NFTUri = _uri;
    }

    function safeMint(
        address to
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function burn(uint256 tokenId) external {
        require(
            ownerOf(tokenId) == msg.sender,
            'Only owner of the token can burn it'
        );
        _burn(tokenId);
    }

    function revoke(uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256
    ) internal pure override {
        require(
            from == address(0) || to == address(0),
            'Not allowed to transfer token'
        );
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        if (from == address(0)) {
            emit Attest(to, tokenId);
        } else if (to == address(0)) {
            emit Revoke(to, tokenId);
        }
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
