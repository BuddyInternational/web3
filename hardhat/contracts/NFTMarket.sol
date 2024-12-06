// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract NFTMarket is Ownable ,Pausable{
    IERC20 public CDEToken;
    IERC20 public TIMToken;
    IERC20 public ANToken;
    address public tokenowner;
    uint256 private CDERate = 2000000000000000000; // 2
    uint256 private TIMRate = 2000000000000000000; // 2
    uint256 private claimTimRewardAmount = 10000000000000000000; // 10
    uint256 private ANTokenAmount = 10000000000000000000; // 10
    uint256 private maxCDETokenAmount = 125000000000000000000000; //125000
    uint256 private CDEDiscountRate = 400; // 4%
    uint256 private TIMDiscountRate = 950; // 9.5%
    uint256 private constant SCALING_FACTOR = 100;
    // Enum for Token Types
    enum TokenType { CDE, TIM }
    // Enum for Address Types
    enum AddressType { walletAddress, vanityAddress }
    // Enum for Token Standard
    enum TokenStandard { ERC721 , ERC1155}

    constructor(
        address _CDEToken,
        address _TIMToken,
        address _ANToken,
        address _Owner
    ) Ownable(msg.sender){
        CDEToken = IERC20(_CDEToken);
        TIMToken = IERC20(_TIMToken);
        ANToken = IERC20(_ANToken);
        tokenowner = _Owner;
    }

     //  Pause and Unpause the contract (only callable by the owner)
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

// ************************  Setter and  Getter function    ******************************************

      // Setter and Getter for CDERate
    function setCDERate(uint256 _rate) external onlyOwner {
        CDERate = _rate * 10**18;
    }

    function getCDERate() external view returns (uint256) {
        return CDERate;
    }

      // Setter and Getter for TIMRate
    function setTIMRate(uint256 _rate) external onlyOwner {
        TIMRate = _rate * 10**18;
    }

    function getTIMRate() external view returns (uint256) {
        return TIMRate;
    }

     // Setter and Getter for claimTimRewardAmount
    function setClaimTimRewardAmount(uint256 _amount) external onlyOwner {
        claimTimRewardAmount = _amount * 10**18;
    }

    function getClaimTimRewardAmount() external view returns (uint256) {
        return claimTimRewardAmount;
    }

     // Setter and Getter for ANTokenAmount
    function setANTokenAmount(uint256 _amount) external onlyOwner {
        ANTokenAmount = _amount * 10**18;
    }

    function getANTokenAmount() external view returns (uint256) {
        return ANTokenAmount;
    }

    // Setter and Getter for maxCDETokenAmount
    function setMaxCDETokenAmount(uint256 _amount) external onlyOwner {
        maxCDETokenAmount = _amount * 10**18;
    }

    function getMaxCDETokenAmount() external view returns (uint256) {
        return maxCDETokenAmount;
    }

    // Setter and Getter for CDEDiscountRate
    function setCDEDiscountRate(uint256 _rate) external onlyOwner {
        CDEDiscountRate = _rate;
    }

    function getCDEDiscountRate() external view returns (uint256) {
        return CDEDiscountRate;
    }

    // Setter and Getter for TIMDiscountRate
    function setTIMDiscountRate(uint256 _rate) external onlyOwner {
        TIMDiscountRate = _rate;
    }

    function getTIMDiscountRate() external view returns (uint256) {
        return TIMDiscountRate;
    }

//  ********************  Main Function    **********************************

    // function calculate the tokenAmount
    function _calculateTokenAmount(uint256 _price,TokenType _tokenType)
        private
        view
        returns (uint256 tokenAmount)
    {
        if(_tokenType == TokenType.CDE){
            tokenAmount = (_price * CDERate) / 1 ether;
            return tokenAmount;
        }
        if(_tokenType == TokenType.TIM){
            tokenAmount = (_price * TIMRate) / 1 ether;
            return tokenAmount;  
        }
    }

     //Funtion to transfer eth and get the  CDE token
    function transferEthAndGetCDEOrTIM(
        uint256 _ethAmount,
        address _vanityAddress,
        TokenType _tokenType,
        AddressType _addressType
    ) external payable whenNotPaused{

        // require(msg.value >= _ethAmount, "Incorrect Ether amount sent");
        uint256 tokenAmount = _calculateTokenAmount(_ethAmount,_tokenType);

        bool isVanityAddress = _addressType == AddressType.vanityAddress;
        if (isVanityAddress) {
            if (_tokenType == TokenType.CDE)
            {
                uint256 discountMultiplier = SCALING_FACTOR * 100 + CDEDiscountRate;
                tokenAmount = (tokenAmount * discountMultiplier) / (SCALING_FACTOR * 100);
            } 
            else if (_tokenType == TokenType.TIM) 
            {
                uint256 discountMultiplier = SCALING_FACTOR * 100 + TIMDiscountRate;
                tokenAmount = (tokenAmount * discountMultiplier) / (SCALING_FACTOR * 100);
            }
        }
        
        // Check allowances
        uint256 allowance;
          if (_tokenType == TokenType.CDE)
         {
            allowance = CDEToken.allowance(tokenowner, address(this));
            require(
                allowance >= tokenAmount,
                "Insufficient allowance for CDE token transfer"
            );
            uint256 CDEMaximumAmt = CDEToken.balanceOf(_vanityAddress) + tokenAmount;
            require(CDEMaximumAmt <= maxCDETokenAmount,"User can not purchase more than 125000 CDE Token");
            
            require(
                CDEToken.transferFrom(tokenowner, _vanityAddress, tokenAmount),
                "CDE token transfer failed"
            );
        } 
        else if (_tokenType == TokenType.TIM) 
        {
            allowance = TIMToken.allowance(tokenowner, address(this));
            require(
                allowance >= tokenAmount,
                "Insufficient allowance for TIM token transfer"
            );
            require(
                TIMToken.transferFrom(tokenowner, _vanityAddress, tokenAmount),
                "TIM token transfer failed"
            );
        }
        // Transfer the Ether to the owner
        (bool success, ) = payable(tokenowner).call{value: msg.value}("");
        require(success, "fund transefer error");
    }

    // Function to claim Tim Token Reward
    function claimTimTokenReward(address _vanityAddress)
        external whenNotPaused
    {
        // Check the allowance before transferring
        uint256 allowance = TIMToken.allowance(tokenowner, address(this));
        require(
            allowance >= claimTimRewardAmount,
            "Insufficient allowance for token transfer"
        );

        // Transfer CDEToken to the user
        require(
            TIMToken.transferFrom(tokenowner, _vanityAddress, claimTimRewardAmount),
            "Token transfer failed"
        );
    }

    // Function to transfer NFT to Vanity Address
    function transferNFTtoVanityAddress(
        address vanityAddress,
        address nftAddress,
        uint256 tokenId,
       TokenStandard _tokenStandard
    ) external whenNotPaused {
       if (_tokenStandard == TokenStandard.ERC721)
         {
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
        if (_tokenStandard == TokenStandard.ERC1155)
         {
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
    function transferANTokenToPrestige(address _prestigeAccount) external whenNotPaused{
        // Check the allowance before transferring
        uint256 allowance = ANToken.allowance(tokenowner, address(this));
        require(
            allowance >= ANTokenAmount,
            "Insufficient allowance for token transfer"
        );

        // Transfer ANToken to the user
        require(
            ANToken.transferFrom(tokenowner, _prestigeAccount, ANTokenAmount),
            "Token transfer failed"
        );
    }

}
