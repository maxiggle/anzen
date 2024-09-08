// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../../node_modules/@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IKintoID {
    function isKYC(address _account) external view returns (bool);
}

contract MonthlyTransfer is AutomationCompatibleInterface {
    address public owner;
    address public additionalOwner;
    address public recipient;
    uint256 public amount;
    uint256 public lastTransferTimestamp;
    uint256 public interval;
    IERC20 public token;
    uint256 public maxAllowance;
    uint256 public currentAllowance;
    IKintoID public kintoID;
    bool public isInitialized;

    event OwnerAddress(address indexed ownerAddress);
    event CallerAddress(address indexed callerAddress);

    constructor(address _additionalOwner, address _kintoIDAddress) {
        owner = msg.sender;
        additionalOwner = _additionalOwner;
        kintoID = IKintoID(_kintoIDAddress);
        isInitialized = false;
        interval = 30 days;
    }

    modifier onlyOwners() {
        require(msg.sender == owner || msg.sender == additionalOwner, "Only the owner or the additional owner can perform this action");
        require(kintoID.isKYC(msg.sender), "Caller must have a valid KintoID");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the main owner can perform this action");
        require(kintoID.isKYC(msg.sender), "Caller must have a valid KintoID");
        _;
    }

    modifier whenNotInitialized() {
        require(!isInitialized, "Contract has already been initialized");
        _;
    }

    function initialize(
        address _recipient,
        uint256 _amount,
        address _tokenAddress,
        uint256 _maxAllowance
    ) public onlyOwners whenNotInitialized {
        recipient = _recipient;
        amount = _amount;
        token = IERC20(_tokenAddress);
        maxAllowance = _maxAllowance;
        lastTransferTimestamp = block.timestamp;
        currentAllowance = 0;
        isInitialized = true;
    }

    function approveTransfers() public onlyOwners {
        require(isInitialized, "Contract has not been initialized");
        emit OwnerAddress(owner);
        emit CallerAddress(msg.sender);
        token.approve(address(this), maxAllowance);
        currentAllowance = maxAllowance;
    }

    function initializeAndApprove(
        address _recipient,
        uint256 _amount,
        address _tokenAddress,
        uint256 _maxAllowance
    ) external onlyOwners {
        initialize(_recipient, _amount, _tokenAddress, _maxAllowance);
        approveTransfers();
    }

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = isInitialized && (block.timestamp - lastTransferTimestamp) >= interval && currentAllowance >= amount;
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        require(isInitialized, "Contract has not been initialized");
        if ((block.timestamp - lastTransferTimestamp) >= interval && currentAllowance >= amount) {
            lastTransferTimestamp = block.timestamp;
            currentAllowance -= amount;
            
            if (token.allowance(address(this), address(this)) < amount) {
                token.approve(address(this), maxAllowance);
            }
            
            token.transferFrom(address(this), recipient, amount);
        }
    }

    function rechargeAllowance() external onlyOwners {
        require(isInitialized, "Contract has not been initialized");
        uint256 allowanceToAdd = maxAllowance - currentAllowance;
        require(token.transferFrom(msg.sender, address(this), allowanceToAdd), "Transfer failed");
        currentAllowance = maxAllowance;
    }

    function updateRecipient(address _newRecipient) external onlyOwners {
        require(isInitialized, "Contract has not been initialized");
        recipient = _newRecipient;
    }

    function updateAmount(uint256 _newAmount) external onlyOwners {
        require(isInitialized, "Contract has not been initialized");
        amount = _newAmount;
    }

    function updateMaxAllowance(uint256 _newMaxAllowance) external onlyOwners {
        require(isInitialized, "Contract has not been initialized");
        maxAllowance = _newMaxAllowance;
    }

    function updateAdditionalOwner(address _newAdditionalOwner) external onlyOwner {
        require(kintoID.isKYC(_newAdditionalOwner), "New additional owner must have a valid KintoID");
        additionalOwner = _newAdditionalOwner;
    }
}