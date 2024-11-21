// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

// error purchaseCDETokenError(string);
contract NFTMarket is Ownable ,Pausable{
    IERC20 public testCDEToken;
    IERC20 public testTIMToken;
    IERC20 public testANTToken;
    uint256 private testCDERate = 2;
    address public tokenowner;

    constructor(
        address _testCDEToken,
        address _testTIMToken,
        address _testANTToken,
        address _Owner
    ) Ownable(msg.sender){
        testCDEToken = IERC20(_testCDEToken);
        testTIMToken = IERC20(_testTIMToken);
        testANTToken = IERC20(_testANTToken);
        tokenowner = _Owner;
    }

      // Function to set TestCDE rate (only callable by the owner)
    function setTestCDERate(uint256 _rate) external onlyOwner {
        testCDERate = _rate;
    }

    // Function to get TestCDE rate
    function getTestCDERate() external view returns (uint256) {
        return testCDERate;
    }

     // Function to pause the contract (only callable by the owner)
    function pause() external onlyOwner {
        _pause();
    }

    // Function to unpause the contract (only callable by the owner)
    function unpause() external onlyOwner {
        _unpause();
    }

    // function calculate the tokenAmount
    function _calculateTokenAmount(uint256 _price)
        private
        view
        returns (uint256 tokenAmount)
    {
        uint256 rateInDecimals = testCDERate * 10**uint256(18);
        tokenAmount = (_price * rateInDecimals) / 1 ether;
        return tokenAmount;
    }

     //Funtion to transfer eth and get the test CDE token
    function transferEthAndGetTestCDEOrTestTIM(
        uint256 _ethAmount,
        address _vanityAddress,
        string memory _tokenType,
        string memory _addressType
    ) external payable whenNotPaused{

        // require(msg.value == _ethAmount, "Incorrect Ether amount sent");
        uint256 baseTokenAmount = _calculateTokenAmount(_ethAmount);
        uint256 tokenAmount = baseTokenAmount * 10**18;

        bool isVanityAddress = keccak256(
            abi.encodePacked(_addressType)
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
        
        // if(testCDEToken.balanceOf(_vanityAddress)+tokenAmount >= 125000000000000000000000){
        //     revert purchaseCDETokenError("User can't purchase more than 125000 CDE Token");
        // }
        // Check allowances
        uint256 allowance;
        if (
            keccak256(abi.encodePacked(_tokenType)) ==
            keccak256(abi.encodePacked("CDE"))
        ) {
            allowance = testCDEToken.allowance(tokenowner, address(this));
            require(
                allowance >= tokenAmount,
                "Insufficient allowance for CDE token transfer"
            );
            uint256 CDEMaximumAmt = testCDEToken.balanceOf(_vanityAddress) + tokenAmount;
            require(CDEMaximumAmt <= 125000000000000000000000,"User can not purchase more than 125000 CDE Token");
            
            require(
                testCDEToken.transferFrom(tokenowner, _vanityAddress, tokenAmount),
                "CDE token transfer failed"
            );
        } else if (
            keccak256(abi.encodePacked(_tokenType)) ==
            keccak256(abi.encodePacked("TIM"))
        ) {
            allowance = testTIMToken.allowance(tokenowner, address(this));
            require(
                allowance >= tokenAmount,
                "Insufficient allowance for TIM token transfer"
            );
            require(
                testTIMToken.transferFrom(tokenowner, _vanityAddress, tokenAmount),
                "TIM token transfer failed"
            );
        }
        // Transfer the Ether to the owner
        (bool success, ) = payable(tokenowner).call{value: msg.value}("");
        require(success, "fund transefer error");
    }

    // Function to claim Tim Token Reward
    function claimTimTokenReward(uint256 _tokenAmount, address _vanityAddress)
        external whenNotPaused
    {
        // Check the allowance before transferring
        uint256 allowance = testTIMToken.allowance(tokenowner, address(this));
        require(
            allowance >= _tokenAmount,
            "Insufficient allowance for token transfer"
        );

        // Transfer testCDEToken to the user
        require(
            testTIMToken.transferFrom(tokenowner, _vanityAddress, _tokenAmount),
            "Token transfer failed"
        );
    }

    // Function to transfer NFT to Vanity Address
    function transferNFTtoVanityAddress(
        address vanityAddress,
        address nftAddress,
        uint256 tokenId,
        string memory tokenStandard
    ) external whenNotPaused {
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

    //Function to Transfer Annotation Token to prestige Account
    function transferANTTokenToPrestige(address _prestigeAccount,uint256 _tokenAmount) external whenNotPaused{
        // Check the allowance before transferring
        uint256 allowance = testANTToken.allowance(tokenowner, address(this));
        require(
            allowance >= _tokenAmount,
            "Insufficient allowance for token transfer"
        );

        // Transfer testANTToken to the user
        require(
            testANTToken.transferFrom(tokenowner, _prestigeAccount, _tokenAmount),
            "Token transfer failed"
        );
    }

}
