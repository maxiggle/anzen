// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.26;

import "./interfaces/IOracle.sol";
import "./employer.sol";

contract EmployeeContract {
    struct ContractReview {
        address employee;
        uint256 employerContractId;
        string review;
        bool isApproved;
        IOracle.Message[] messages;
        uint256 messagesCount;
    }

    mapping(uint256 => ContractReview) public contractReviews;
    uint256 private reviewCount;

    address private owner;
    address public oracleAddress;
    address public employerContractAddress;

    event ContractReviewed(
        uint256 indexed employerContractId,
        uint256 indexed reviewId,
        bool isApproved
    );
    event OracleAddressUpdated(address indexed newOracleAddress);
    event ReviewContractCalled(uint256 indexed reviewId);

    IOracle.OpenAiRequest private config;

    constructor(
        address initialOracleAddress,
        address _employerContractAddress
    ) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        employerContractAddress = _employerContractAddress;
        reviewCount = 0;
        config = IOracle.OpenAiRequest({
            model: "gpt-4-turbo", // gpt-4-turbo gpt-4o
            frequencyPenalty: 21, // > 20 for null
            logitBias: "", // empty str for null
            maxTokens: 1000, // 0 for null
            presencePenalty: 21, // > 20 for null
            responseFormat: '{"type":"text"}',
            seed: 0, // null
            stop: "", // null
            temperature: 10, // Example temperature (scaled up, 10 means 1.0), > 20 means null
            topP: 101, // Percentage 0-100, > 100 means null
            tools: "",
            toolChoice: "", // "none" or "auto"
            user: "" // null
        });
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    modifier onlyEmployee(uint256 reviewId) {
        require(
            msg.sender == contractReviews[reviewId].employee,
            "Caller is not the employee"
        );
        _;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function reviewContract(
        uint256 employerContractId,
        string memory query
    ) public returns (uint256) {
        reviewCount++;
        uint256 newReviewId = reviewCount;
        ContractReview storage review = contractReviews[newReviewId];

        review.employee = msg.sender;
        review.employerContractId = employerContractId;
        review.isApproved = false;

        delete review.messages;
        review.messagesCount = 0;

        string memory contractContent = EmployerContract(
            employerContractAddress
        ).getContractContent(employerContractId);

        string memory prompt = string(
            abi.encodePacked(
                "Review the following employment contract and respond to this query: ",
                query,
                "\n\nContract:\n",
                contractContent
            )
        );

        createNewMessage(review, "user", prompt);
        review.messagesCount++;

        IOracle(oracleAddress).createOpenAiLlmCall(newReviewId, config);

        emit ReviewContractCalled(newReviewId);
        return newReviewId;
    }

    function onOracleOpenAiLlmResponse(
        uint256 runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        ContractReview storage review = contractReviews[runId];

        if (compareStrings(errorMessage, "")) {
            review.review = response.content;
            createNewMessage(review, "assistant", response.content);
        } else {
            createNewMessage(review, "assistant", errorMessage);
        }
        review.messagesCount++;
    }

    function viewGeneratedContract(
        uint256 contractId
    ) public view returns (string memory) {
        string memory contractContent = EmployerContract(
            employerContractAddress
        ).getContractContent(contractId);

        return contractContent;
    }

    function approveContract(
        uint256 reviewId,
        bool approval
    ) public onlyEmployee(reviewId) {
        ContractReview storage review = contractReviews[reviewId];
        review.isApproved = approval;
        emit ContractReviewed(review.employerContractId, reviewId, approval);
    }

    function getReviewContent(
        uint256 reviewId
    ) public view returns (string memory) {
        return contractReviews[reviewId].review;
    }

    function getMessageHistory(
        uint256 reviewId
    ) public view returns (IOracle.Message[] memory) {
        return contractReviews[reviewId].messages;
    }

    function createNewMessage(
        ContractReview storage review,
        string memory role,
        string memory content
    ) private {
        review.messages.push();
        IOracle.Message storage newMessage = review.messages[
            review.messages.length - 1
        ];

        newMessage.role = role;

        newMessage.content.push();
        newMessage.content[0].contentType = "text";
        newMessage.content[0].value = content;
    }

    function compareStrings(
        string memory a,
        string memory b
    ) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
