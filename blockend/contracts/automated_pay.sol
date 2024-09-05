// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AutomatedMonthlyTransfer {
    IERC20 public wethToken;
    address public immutable recipient;

    // Set interval to 1 minute for testing purposes
    uint256 public constant TRANSFER_INTERVAL = 1 minutes;

    struct User {
        uint256 amount;
        uint256 lastTransferTime;
    }

    mapping(address => User) public users;
    address[] public userAddresses;

    constructor(address _wethTokenAddress, address _recipient) {
        wethToken = IERC20(_wethTokenAddress);
        recipient = _recipient;
    }

    function scheduleTransfer(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");

        require(
            wethToken.allowance(msg.sender, address(this)) >= _amount,
            "Insufficient allowance"
        );

        if (users[msg.sender].amount == 0) {
            users[msg.sender] = User(_amount, block.timestamp);
            userAddresses.push(msg.sender);
        } else {
            users[msg.sender].amount = _amount;
        }
    }

    function checkUpkeep(
        bytes calldata
    ) external view returns (bool upkeepNeeded) {
        upkeepNeeded = false;
        for (uint256 i = 0; i < userAddresses.length; i++) {
            address userAddress = userAddresses[i];
            if (
                block.timestamp - users[userAddress].lastTransferTime >=
                TRANSFER_INTERVAL &&
                wethToken.allowance(userAddress, address(this)) >=
                users[userAddress].amount &&
                wethToken.balanceOf(userAddress) >= users[userAddress].amount
            ) {
                upkeepNeeded = true;
                break;
            }
        }
    }

    function performUpkeep(bytes calldata) external {
        for (uint256 i = 0; i < userAddresses.length; i++) {
            address userAddress = userAddresses[i];
            User storage user = users[userAddress];
            if (
                block.timestamp - user.lastTransferTime >= TRANSFER_INTERVAL &&
                wethToken.allowance(userAddress, address(this)) >=
                user.amount &&
                wethToken.balanceOf(userAddress) >= user.amount
            ) {
                wethToken.transferFrom(userAddress, recipient, user.amount);
                user.lastTransferTime = block.timestamp;
            }
        }
    }
}
