// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is Ownable, Pausable, ReentrancyGuard {
    IERC20 public CDEToken;
    IERC20 public TIMToken;
    IERC20 public ANToken;
    address public tokenowner;
    address public amountReceiverAddress;
    uint256 private CDERate = 70e18; // 70 POL
    uint256 private TIMRate = 2e18; // 2 POL
    uint256 private ANRate = 3e16; // 0.03 POL
    uint256 private claimTimRewardAmount = 10e18; // 10
    uint256 private ANTokenAmount = 10e18; // 10
    uint256 private maxCDETokenAmount = 125000e18; //125000
    uint256 private CDEDiscountRate = 400; // 4%
    uint256 private TIMDiscountRate = 950; // 9.5%
    uint256 private ANDiscountRate = 0; // 0%
    uint256 private constant SCALING_FACTOR = 100;

    // Enum for Token Types
    enum TokenType {
        CDE,
        TIM,
        AN
    }

    // Enum for Address Types
    enum AddressType {
        WALLET,
        VANITY
    }
    // Enum for Token Standard
    enum TokenStandard {
        ERC721,
        ERC1155
    }

    constructor(
        address _CDEToken,
        address _TIMToken,
        address _ANToken,
        address _Owner,
        address _AmountReceiverAddress
    ) Ownable() {
        CDEToken = IERC20(_CDEToken);
        TIMToken = IERC20(_TIMToken);
        ANToken = IERC20(_ANToken);
        tokenowner = _Owner;
        amountReceiverAddress = _AmountReceiverAddress;
    }

    //  Pause and Unpause the contract (only callable by the owner)
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Check Zero address modifier
    modifier nonZeroAddress(address _newAddress) {
        require(_newAddress != address(0), "You can not set Zero address");
        _;
    }

    // ************************  Setter and  Getter function    ******************************************

    // Setter and Getter Token Owner
    function setTokenOwner(address _tokenOwner)
        external
        onlyOwner
        nonZeroAddress(_tokenOwner)
    {
        require(_tokenOwner != tokenowner, "You are setting same Owner");
        tokenowner = _tokenOwner;
    }

    function getTokenOwner() external view returns (address) {
        return tokenowner;
    }

    // Setter and Getter Amount Receiver Address
    function setAmountReceiverAddress(address _amountReceiverAddress)
        external
        onlyOwner
        nonZeroAddress(_amountReceiverAddress)
    {
        require(
            _amountReceiverAddress != amountReceiverAddress,
            "You are setting same amount receiver Address"
        );
        amountReceiverAddress = _amountReceiverAddress;
    }

    function getAmountReceiverAddress() external view returns (address) {
        return amountReceiverAddress;
    }

    // Setter and Getter for CDERate
    function setCDERate(uint256 _rate) external onlyOwner {
        CDERate = _rate;
    }

    function getCDERate() external view returns (uint256) {
        return CDERate;
    }

    // Setter and Getter for TIMRate
    function setTIMRate(uint256 _rate) external onlyOwner {
        TIMRate = _rate;
    }

    function getTIMRate() external view returns (uint256) {
        return TIMRate;
    }

    // Setter and Getter for ANRate
    function setANRate(uint256 _rate) external onlyOwner {
        ANRate = _rate;
    }

    function getANRate() external view returns (uint256) {
        return ANRate;
    }
    // Setter and Getter for claimTimRewardAmount
    function setClaimTimRewardAmount(uint256 _amount) external onlyOwner {
        claimTimRewardAmount = _amount;
    }

    function getClaimTimRewardAmount() external view returns (uint256) {
        return claimTimRewardAmount;
    }

    // Setter and Getter for ANTokenAmount
    function setANTokenAmount(uint256 _amount) external onlyOwner {
        ANTokenAmount = _amount;
    }

    function getANTokenAmount() external view returns (uint256) {
        return ANTokenAmount;
    }

    // Setter and Getter for maxCDETokenAmount
    function setMaxCDETokenAmount(uint256 _amount) external onlyOwner {
        maxCDETokenAmount = _amount;
    }

    function getMaxCDETokenAmount() external view returns (uint256) {
        return maxCDETokenAmount;
    }

    // Setter and getter function for Discount Rate
    function setDiscountRate(address tokenAddress, uint256 rate)
        external
        onlyOwner
    {
        if (tokenAddress == address(CDEToken)) {
            CDEDiscountRate = rate;
        } else if (tokenAddress == address(TIMToken)) {
            TIMDiscountRate = rate;
        } else if (tokenAddress == address(ANToken)) {
            ANDiscountRate = rate;
        } else {
            revert("Invalid Token Address");
        }
    }

    function getDiscountRate(address tokenAddress)
        external
        view
        returns (uint256)
    {
        if (tokenAddress == address(CDEToken)) {
            return CDEDiscountRate;
        } else if (tokenAddress == address(TIMToken)) {
            return TIMDiscountRate;
        } else if (tokenAddress == address(ANToken)) {
            return ANDiscountRate;
        } else {
            revert("Invalid Token Address");
        }
    }

    //  ********************  Main Function    **********************************

    // function calculate the tokenAmount
    function _calculateTokenAmount(uint256 _price, TokenType _tokenType)
        private
        view
        returns (uint256 tokenAmount)
    {
        if (_tokenType == TokenType.CDE) {
            tokenAmount = (_price * 1 ether) / CDERate;
            return tokenAmount;
        }
        if (_tokenType == TokenType.TIM) {
            tokenAmount = (_price * 1 ether) / TIMRate;
            return tokenAmount;
        }
        if (_tokenType == TokenType.AN) {
            tokenAmount = (_price * 10 ** 4) / ANRate;
            return tokenAmount;
        }
    }

    // function to calculate the discount
    function _applyDiscount(uint256 _tokenAmount, uint256 _discountRate)
        private
        pure
        returns (uint256)
    {
        uint256 discountMultiplier = SCALING_FACTOR * 100 + _discountRate;
        return (_tokenAmount * discountMultiplier) / (SCALING_FACTOR * 100);
    }

    //Funtion to transfer eth and get the  CDE token
    function purchaseToken(
        uint256 _amount,
        address _address,
        TokenType _tokenType,
        AddressType _addressType
    )
        external
        payable
        whenNotPaused
        nonZeroAddress(_address)
        nonReentrant
    {
        require(msg.value >= _amount, "Insufficient Ether amount sent");
        uint256 tokenAmount = _calculateTokenAmount(_amount, _tokenType);

        bool isVanityAddress = _addressType == AddressType.VANITY;
        if (isVanityAddress) {
            if (_tokenType == TokenType.CDE) {
                tokenAmount = _applyDiscount(tokenAmount, CDEDiscountRate);
            } else if (_tokenType == TokenType.TIM) {
                 tokenAmount = _applyDiscount(tokenAmount, TIMDiscountRate);
            } else if (_tokenType == TokenType.AN) {
                 tokenAmount = _applyDiscount(tokenAmount, ANDiscountRate);
            }
        }

        // Check allowances
        uint256 allowance;
        if (_tokenType == TokenType.CDE) {
            allowance = CDEToken.allowance(tokenowner, address(this));
            require(
                allowance >= tokenAmount,
                "Insufficient allowance for CDE token transfer"
            );
            uint256 CDEMaximumAmt = CDEToken.balanceOf(_address) +
                tokenAmount;
            require(
                CDEMaximumAmt <= maxCDETokenAmount,
                "User can not purchase more than 125000 CDE Token"
            );

            require(
                CDEToken.transferFrom(tokenowner, _address, tokenAmount),
                "CDE token transfer failed"
            );
        } else if (_tokenType == TokenType.TIM) {
            allowance = TIMToken.allowance(tokenowner, address(this));
            require(
                allowance >= tokenAmount,
                "Insufficient allowance for TIM token transfer"
            );
            require(
                TIMToken.transferFrom(tokenowner, _address, tokenAmount),
                "TIM token transfer failed"
            );
        } else if (_tokenType == TokenType.AN) {
            allowance = ANToken.allowance(tokenowner, address(this));
            require(
                allowance >= tokenAmount,
                "Insufficient allowance for AN token transfer"
            );
            require(
                ANToken.transferFrom(tokenowner, _address, tokenAmount),
                "AN token transfer failed"
            );
        }
        // Transfer the Ether to the AmountReceiverAddress
        (bool success, ) = payable(amountReceiverAddress).call{
            value: msg.value
        }("");
        require(success, "fund transefer error");
    }

    // Function to claim Tim Token Reward
    function claimTimTokenReward(address _vanityAddress)
        external
        whenNotPaused
        nonZeroAddress(_vanityAddress)
    {
        // Check the allowance before transferring
        uint256 allowance = TIMToken.allowance(tokenowner, address(this));
        require(
            allowance >= claimTimRewardAmount,
            "Insufficient allowance for token transfer"
        );

        // Transfer CDEToken to the user
        require(
            TIMToken.transferFrom(
                tokenowner,
                _vanityAddress,
                claimTimRewardAmount
            ),
            "Token transfer failed"
        );
    }

    // Function to transfer NFT to Vanity Address
    function transferNFTtoVanityAddress(
        address _vanityAddress,
        address _nftAddress,
        uint256 _tokenId,
        TokenStandard _tokenStandard
    )
        external
        whenNotPaused
        nonZeroAddress(_vanityAddress)
        nonZeroAddress(_nftAddress)
    {
        if (_tokenStandard == TokenStandard.ERC721) {
            // Ensure the contract has been approved to transfer the NFT
            require(
                IERC721(_nftAddress).isApprovedForAll(
                    msg.sender,
                    address(this)
                ) ||
                    IERC721(_nftAddress).getApproved(_tokenId) == address(this),
                "Contract not approved to transfer NFT"
            );

            // Transfer the NFT to this contract
            IERC721(_nftAddress).safeTransferFrom(
                msg.sender,
                _vanityAddress,
                _tokenId
            );
        }
        if (_tokenStandard == TokenStandard.ERC1155) {
            // Ensure the contract has been approved to transfer the NFT
            require(
                IERC1155(_nftAddress).isApprovedForAll(
                    msg.sender,
                    address(this)
                ),
                "Contract not approved to transfer NFT"
            );

            // Transfer the NFT to this contract
            IERC1155(_nftAddress).safeTransferFrom(
                msg.sender,
                _vanityAddress,
                _tokenId,
                1,
                ""
            );
        }
    }

    //Function to Transfer Annotation Token to prestige Account
    function transferANTokenToPrestige(address _prestigeAccount)
        external
        whenNotPaused
        nonZeroAddress(_prestigeAccount)
    {
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
