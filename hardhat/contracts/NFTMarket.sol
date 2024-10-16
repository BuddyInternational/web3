// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarket {
    IERC20 public testCDEToken;
    IERC20 public testTIMToken;
    uint256 TestCDERate = 2;
    address public owner;

    constructor(
        address _testCDEToken,
        address _testTIMToken,
        address _Owner
    ) {
        testCDEToken = IERC20(_testCDEToken);
        testTIMToken = IERC20(_testTIMToken);
        owner = _Owner;
    }

    // function calculate the tokenAmount
    function _calculateTokenAmount(uint256 _price)
        private
        view
        returns (uint256 tokenAmount)
    {
        uint256 rateInDecimals = TestCDERate * 10**uint256(18);
        tokenAmount = (_price * rateInDecimals) / 1 ether;
        return tokenAmount;
    }

    //Funtion to transfer eth and get the test CDE token
    function transferEthAndGetTestCDEOrTestTIM(
        uint256 _ethAmount,
        address _receiverAddress,
        string memory _tokenType,
        string memory _receiverAddressType
    ) external payable {
        // require(msg.value == _ethAmount, "Incorrect Ether amount sent");
        uint256 baseTokenAmount = _calculateTokenAmount(_ethAmount);
        uint256 tokenAmount = baseTokenAmount * 10**18;

        bool isVanityAddress = keccak256(
            abi.encodePacked(_receiverAddressType)
        ) == keccak256(abi.encodePacked("vanityAddress"));

        if (isVanityAddress) {
            if (
                keccak256(abi.encodePacked(_tokenType)) ==
                keccak256(abi.encodePacked("CDE"))
            ) {
                tokenAmount = (tokenAmount * 104) / 100; //4% discount
            } else if (
                keccak256(abi.encodePacked(_tokenType)) ==
                keccak256(abi.encodePacked("TIM"))
            ) {
                tokenAmount = (tokenAmount * 1095) / 1000; // 9.5% discount
            }
        }

        // Check allowances
        uint256 allowance;
        if (
            keccak256(abi.encodePacked(_tokenType)) ==
            keccak256(abi.encodePacked("CDE"))
        ) {
            allowance = testCDEToken.allowance(owner, address(this));
            require(
                allowance >= tokenAmount,
                "Insufficient allowance for CDE token transfer"
            );
            require(
                testCDEToken.transferFrom(owner, _receiverAddress, tokenAmount),
                "CDE token transfer failed"
            );
        } else if (
            keccak256(abi.encodePacked(_tokenType)) ==
            keccak256(abi.encodePacked("TIM"))
        ) {
            allowance = testTIMToken.allowance(owner, address(this));
            require(
                allowance >= tokenAmount,
                "Insufficient allowance for TIM token transfer"
            );
            require(
                testTIMToken.transferFrom(owner, _receiverAddress, tokenAmount),
                "TIM token transfer failed"
            );
        }
        // Transfer the Ether to the owner
        (bool success, ) = payable(owner).call{value: msg.value}("");
        require(success, "fund transefer error");
    }

    // Function to claim Tim Token Reward
    function claimTimTokenReward(uint256 _tokenAmount, address _vanityAddress)
        external
    {
        // Check the allowance before transferring
        uint256 allowance = testTIMToken.allowance(owner, address(this));
        require(
            allowance >= _tokenAmount,
            "Insufficient allowance for token transfer"
        );

        // Transfer testCDEToken to the user
        require(
            testTIMToken.transferFrom(owner, _vanityAddress, _tokenAmount),
            "Token transfer failed"
        );
    }

    // Function to transfer NFT to Vanity Address
    function transferNFTtoVanityAddress(
        address vanityAddress,
        address nftAddress,
        uint256 tokenId,
        string memory tokenStandard
    ) external {
        // Transfer ERC721 Token
        if (
            keccak256(abi.encodePacked(tokenStandard)) ==
            keccak256(abi.encodePacked("ERC721"))
        ) {
            // Ensure the contract has been approved to transfer the NFT
            require(
                IERC721(nftAddress).isApprovedForAll(
                    msg.sender,
                    address(this)
                ) || IERC721(nftAddress).getApproved(tokenId) == address(this),
                "Contract not approved to transfer NFT"
            );

            // Transfer the NFT to this contract
            IERC721(nftAddress).safeTransferFrom(
                msg.sender,
                vanityAddress,
                tokenId
            );
        }
        // Transfer ERC1155 Token
        if (
            keccak256(abi.encodePacked(tokenStandard)) ==
            keccak256(abi.encodePacked("ERC1155"))
        ) {
            // Ensure the contract has been approved to transfer the NFT
            require(
                IERC1155(nftAddress).isApprovedForAll(
                    msg.sender,
                    address(this)
                ),
                "Contract not approved to transfer NFT"
            );

            // Transfer the NFT to this contract
            IERC1155(nftAddress).safeTransferFrom(
                msg.sender,
                vanityAddress,
                tokenId,
                1,
                ""
            );
        }
    }

    // get the user token balance
    function getUserTestCDETokenBalance(address _userAddress)
        public
        view
        returns (uint256 _tokenBalance)
    {
        return testCDEToken.balanceOf(_userAddress);
    }
}
