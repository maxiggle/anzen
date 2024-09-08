// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IKintoID {
    function isKYC(address _account) external view returns (bool);
}

contract BudgetAllocation {
    address public owner;
    address public additionalAuthorized;
    IERC20 public token;
    IKintoID public kintoID;
    uint256 public totalBudget;
    mapping(address => bool) public authorizedUsers;
    mapping(address => uint256) public userAllocations;
    bool public isInitialized;

    event BudgetAllocated(uint256 amount);
    event UserAuthorized(address user);
    event UserUnauthorized(address user);
    event FundsWithdrawn(address user, uint256 amount);
    event TokenAddressSet(address tokenAddress);

    constructor(address _kintoIDAddress, address _additionalAuthorized) {
        require(_additionalAuthorized != address(0), "Invalid additional authorized address");
        owner = msg.sender;
        kintoID = IKintoID(_kintoIDAddress);
        additionalAuthorized = _additionalAuthorized;
        isInitialized = false;
    }

    modifier onlyOwnerOrAdditional() {
        require(msg.sender == owner || msg.sender == additionalAuthorized, "Only owner or additional authorized can perform this action");
        require(kintoID.isKYC(msg.sender), "Caller must have a valid KintoID");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        require(kintoID.isKYC(msg.sender), "Owner must have a valid KintoID");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "User is not authorized");
        require(kintoID.isKYC(msg.sender), "User must have a valid KintoID");
        _;
    }

    modifier whenNotInitialized() {
        require(!isInitialized, "Contract has already been initialized");
        _;
    }

    function initialize(address _tokenAddress) external onlyOwner whenNotInitialized {
        require(_tokenAddress != address(0), "Invalid token address");
        token = IERC20(_tokenAddress);
        isInitialized = true;
        emit TokenAddressSet(_tokenAddress);
    }

    function allocateBudget(uint256 _amount) external onlyOwnerOrAdditional {
        require(isInitialized, "Contract not initialized");
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        totalBudget += _amount;
        
        // Approuver le contrat à dépenser les tokens
        token.approve(address(this), totalBudget);
        
        emit BudgetAllocated(_amount);
    }

    function authorizeUser(address _user) external onlyOwnerOrAdditional {
        require(kintoID.isKYC(_user), "User must have a valid KintoID");
        authorizedUsers[_user] = true;
        emit UserAuthorized(_user);
    }

    function unauthorizeUser(address _user) external onlyOwnerOrAdditional {
        authorizedUsers[_user] = false;
        emit UserUnauthorized(_user);
    }

    function withdrawFunds(uint256 _amount) external onlyAuthorized {
        require(isInitialized, "Contract not initialized");
        require(_amount <= totalBudget, "Insufficient funds in the contract");
        require(token.balanceOf(address(this)) >= _amount, "Insufficient token balance");

        totalBudget -= _amount;
        userAllocations[msg.sender] += _amount;

        require(token.transfer(msg.sender, _amount), "Transfer failed");
        emit FundsWithdrawn(msg.sender, _amount);
    }

    function getContractBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function getUserAllocation(address _user) public view returns (uint256) {
        return userAllocations[_user];
    }
}