// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

contract DBeatsArtist is ERC721, ERC721URIStorage, Ownable, AccessControl  {
    using Counters for Counters.Counter;
    string public uri = "https://bafybeigasec73g4h2i4tkwdfr3uy4ncd3phd63b55ujcmbp74hqu2vrhne.ipfs.nftstorage.link/soundbound.json";

    Counters.Counter private _tokenIdCounter;

    bytes32 public constant ADMIN_ROLE = keccak256('ADMIN_ROLE');

    event Attest(address indexed to, uint256 indexed tokenId);
    event Revoke(address indexed to, uint256 indexed tokenId);

    constructor() AccessControl()  ERC721('D-Beats-Artist', 'DBA')  {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function addUserToRole(bytes32 role, address account) public onlyOwner {
        _grantRole(role, account);
    }

    function addAdmin(address account) public {
        require(hasRole(ADMIN_ROLE, msg.sender), 'Caller is not an admin');
        _grantRole(ADMIN_ROLE, account);
    }

    function safeMint(address to) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function revoke(uint256 tokenId) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
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

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
