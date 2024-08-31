// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.26;

import "./interfaces/IOracle.sol";
import "./employer.sol";
import "./text_storage.sol";

contract EmployeeContract {
    struct ContractReview {
        address employee;
        uint256 employerContractId;
        string review;
        bool isApproved;
        IOracle.Message[] messages;
        uint256 messagesCount;
        bool isTextExtraction;
    }

    mapping(uint256 => ContractReview) public contractReviews;
    uint256 private reviewCount;

    address private owner;
    address public oracleAddress;
    address public employerContractAddress;
    address public textStorageAddress; // Address for TextStorage contract

    event ContractReviewed(
        uint256 indexed employerContractId,
        uint256 indexed reviewId,
        bool isApproved
    );
    event OracleAddressUpdated(address indexed newOracleAddress);
    event ReviewContractCalled(uint256 indexed reviewId);
    event TextExtracted(uint256 indexed reviewId, string extractedText);
    event Log(string message, uint256 value);

    IOracle.OpenAiRequest private config;

    constructor(
        address initialOracleAddress,
        address _employerContractAddress,
        address _textStorageAddress
    ) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        employerContractAddress = _employerContractAddress;
        textStorageAddress = _textStorageAddress;
        reviewCount = 0;
        config = IOracle.OpenAiRequest({
            model: "gpt-4-turbo",
            frequencyPenalty: 21,
            logitBias: "",
            maxTokens: 1000,
            presencePenalty: 21,
            responseFormat: '{"type":"text"}',
            seed: 0,
            stop: "",
            temperature: 10,
            topP: 101,
            tools: "",
            toolChoice: "",
            user: ""
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
        review.isTextExtraction = false;

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

    function extractTextFromGeneratedContract(
        uint256 contractid
    ) public returns (uint256) {
        reviewCount++;
        uint256 reviewId = reviewCount;

        emit Log("Fetching contract content", contractid);

        string memory contractContent = EmployerContract(
            employerContractAddress
        ).getContractContent(contractid);

        require(
            bytes(contractContent).length > 0,
            "Contract content is empty or null"
        );

        emit Log("Contract content fetched", bytes(contractContent).length);

        string memory prompt = string(
            abi.encodePacked(
                "Extract the following details from the provided employment contract text:\n",
                "1. Employee's full name\n",
                "2. Employer's legal business name\n",
                "3. Job title\n",
                "4. Start date of the contract\n",
                "5. Annual gross salary\n",
                "6. Standard weekly working hours\n",
                "7. Employee's address\n",
                "8. Employer's address\n",
                "9. Any additional contract details\n",
                "10. Notice period for termination\n",
                "11. State/Region governing the contract\n",
                "\nContract Text:\n",
                contractContent
            )
        );

        ContractReview storage review = contractReviews[reviewId];
        review.isTextExtraction = true;
        createNewMessage(review, "user", prompt);
        IOracle(oracleAddress).createOpenAiLlmCall(reviewId, config);
        emit TextExtracted(reviewId, "");

        return reviewId;
    }

    function onOracleOpenAiLlmResponse(
        uint256 runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        ContractReview storage review = contractReviews[runId];

        if (review.isTextExtraction) {
            handleTextExtractionResponse(runId, response, errorMessage);
        } else {
            handleContractReviewResponse(runId, response, errorMessage);
        }
    }

    function handleTextExtractionResponse(
        uint256 runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) private {
        string memory extractedText = compareStrings(errorMessage, "")
            ? response.content
            : errorMessage;
        TextStorage(textStorageAddress).storeExtractedText(
            runId,
            extractedText
        );
        emit TextExtracted(runId, extractedText);
    }

    function handleContractReviewResponse(
        uint256 runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) private {
        ContractReview storage review = contractReviews[runId];
        string memory reviewContent = compareStrings(errorMessage, "")
            ? response.content
            : errorMessage;
        review.review = reviewContent;
        createNewMessage(review, "assistant", reviewContent);
        review.messagesCount++;
    }

    function viewGeneratedContract(
        uint256 contractId
    ) public view returns (string memory) {
        return
            EmployerContract(employerContractAddress).getContractContent(
                contractId
            );
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

    function getExtractedText(
        uint256 reviewId
    ) public view returns (string memory) {
        return TextStorage(textStorageAddress).getExtractedText(reviewId);
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
