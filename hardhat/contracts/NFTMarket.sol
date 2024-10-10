// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarket {
    IERC20 public paymentTestCDEToken;
    IERC20 public rewardTestTIMToken;
    uint256 TestCDERate = 2;
    address public owner;

    struct UserHistory {
        address walletAddress;
        address vanityAddress;
        address nftAddress;
        uint256 tokenId;
        uint256 nftPrice;
        string tokenStandard;
        uint256 timestamp;
    }

    mapping(address => UserHistory[]) userHistories;

    constructor(
        address _paymentTestCDEToken,
        address _Owner,
        address _rewardTestTIMToken
    ) {
        paymentTestCDEToken = IERC20(_paymentTestCDEToken);
        rewardTestTIMToken = IERC20(_rewardTestTIMToken);
        owner = _Owner;
    }

    // function calculate the tokenAmount
    function _calculateTokenAmount(
        uint256 _price
    ) private view returns (uint256 tokenAmount) {
        uint256 rateInDecimals = TestCDERate * 10 ** uint256(18);
        tokenAmount = (_price * rateInDecimals) / 1 ether;
        return tokenAmount;
    }

    //Funtion to transfer eth and get the test CDE token
    function transferEthAndGetTestCDE(
        uint256 _ethAmount,
        address _vanityAddress
    ) external payable {
        // require(msg.value == _ethAmount, "Incorrect Ether amount sent");
        uint256 tokenAmount = _calculateTokenAmount(_ethAmount);
        // Check the allowance before transferring
        uint256 allowance = paymentTestCDEToken.allowance(owner, address(this));
        require(
            allowance >= tokenAmount,
            "Insufficient allowance for token transfer"
        );

        // Transfer paymentTestCDEToken to the user
        require(
            paymentTestCDEToken.transferFrom(
                owner,
                _vanityAddress,
                tokenAmount
            ),
            "Token transfer failed"
        );

        // Transfer the Ether to the owner
        (bool success, ) = payable(owner).call{value: msg.value}("");
        require(success, "fund transefer error");
    }

    // Function to claim Tim Token Reward
    function claimTimTokenReward(
        uint256 _tokenAmount,
        address _vanityAddress
    ) external {
        // Check the allowance before transferring
        uint256 allowance = rewardTestTIMToken.allowance(owner, address(this));
        require(
            allowance >= _tokenAmount,
            "Insufficient allowance for token transfer"
        );

        // Transfer paymentTestCDEToken to the user
        require(
            paymentTestCDEToken.transferFrom(
                owner,
                _vanityAddress,
                _tokenAmount
            ),
            "Token transfer failed"
        );
    }

    // Function to transfer NFT and send equivalent token
    function transferNFTAndPay(
        address vanityAddress,
        address nftAddress,
        uint256 tokenId,
        string memory tokenStandard,
        uint256 price
    ) external {
        uint256 tokenAmount = _calculateTokenAmount(price);
        require(
            tokenAmount <= paymentTestCDEToken.balanceOf(address(this)),
            "Insufficient Token Balance in contract"
        );

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
                address(this),
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
                address(this),
                tokenId,
                1,
                ""
            );
        }

        // Transfer paymentTestCDEToken to the user
        require(
            paymentTestCDEToken.transfer(vanityAddress, tokenAmount),
            "Token transfer failed"
        );

        // Store user history
        userHistories[msg.sender].push(
            UserHistory({
                walletAddress: msg.sender,
                vanityAddress: vanityAddress,
                nftAddress: nftAddress,
                tokenId: tokenId,
                tokenStandard: tokenStandard,
                nftPrice: price,
                timestamp: block.timestamp
            })
        );
    }

    // Function to view user history
    function getUserHistory(
        address user
    ) external view returns (UserHistory[] memory) {
        return userHistories[user];
    }

    // get the user token balance
    function getUserTestCDETokenBalance(
        address _userAddress
    ) public view returns (uint256 _tokenBalance) {
        return paymentTestCDEToken.balanceOf(_userAddress);
    }
}
