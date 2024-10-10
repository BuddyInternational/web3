// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Simple721NFT is ERC721 {
    uint256 private _currentTokenId = 0;
    string private _baseTokenURI;

    constructor(string memory name, string memory symbol, string memory baseTokenURI) 
        ERC721(name, symbol) 
    {
        _baseTokenURI = baseTokenURI;
    }

    function mint(address to) external  {
        require(to != address(0), "Cannot mint to zero address");
        _currentTokenId++;
        _safeMint(to, _currentTokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseTokenURI) external  {
        _baseTokenURI = baseTokenURI;
    }
}
