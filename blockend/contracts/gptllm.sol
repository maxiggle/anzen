// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import "./interfaces/IOracle.sol";

// @title HRContractAI

contract HRContractGenerator {
    struct ContractRun {
        address employee;
        address hr;
        string contractContent;
        string employeeReview;
        bool isApproved;
        IOracle.Message[] messages;
        uint messagesCount;
    }

    mapping(uint => ContractRun) public contractRuns;
    uint private contractRunsCount;

    event ContractGenerated(
        address indexed hr,
        address indexed employee,
        uint indexed contractId
    );
    event ContractReviewed(uint indexed contractId, bool isApproved);

    address private owner;
    address public oracleAddress;

    event OracleAddressUpdated(address indexed newOracleAddress);

    IOracle.OpenAiRequest private config;

    constructor(address initialOracleAddress) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        contractRunsCount = 0;

        config = IOracle.OpenAiRequest({
            model: "gpt-4-turbo-preview",
            frequencyPenalty: 21,
            logitBias: "",
            maxTokens: 2000,
            presencePenalty: 21,
            responseFormat: '{"type":"text"}',
            seed: 0,
            stop: "",
            temperature: 7,
            topP: 101,
            tools: "[]",
            toolChoice: "none",
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

    modifier onlyHR(uint contractId) {
        require(msg.sender == contractRuns[contractId].hr, "Caller is not HR");
        _;
    }

    modifier onlyEmployee(uint contractId) {
        require(
            msg.sender == contractRuns[contractId].employee,
            "Caller is not the employee"
        );
        _;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function generateContract(
        address employee,
        string memory employeeTerms
    ) public returns (uint) {
        ContractRun storage run = contractRuns[contractRunsCount];

        run.employee = employee;
        run.hr = msg.sender;
        run.isApproved = false;

        IOracle.Message memory newMessage = createNewMessage(
            "user",
            string(
                abi.encodePacked(
                    "Generate an employment contract based on the following terms: ",
                    employeeTerms
                )
            )
        );
        run.messages.push(newMessage);
        run.messagesCount = 1;

        uint currentId = contractRunsCount;
        contractRunsCount = contractRunsCount + 1;

        IOracle(oracleAddress).createOpenAiLlmCall(currentId, config);
        emit ContractGenerated(msg.sender, employee, currentId);

        return currentId;
    }

    function onOracleOpenAiLlmResponse(
        uint runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        ContractRun storage run = contractRuns[runId];

        if (compareStrings(errorMessage, "")) {
            run.contractContent = response.content;
            IOracle.Message memory newMessage = createNewMessage(
                "assistant",
                response.content
            );
            run.messages.push(newMessage);
            run.messagesCount++;
        } else {
            IOracle.Message memory newMessage = createNewMessage(
                "assistant",
                errorMessage
            );
            run.messages.push(newMessage);
            run.messagesCount++;
        }
    }

    function reviewContract(
        uint contractId,
        string memory query
    ) public onlyEmployee(contractId) {
        ContractRun storage run = contractRuns[contractId];

        string memory prompt = string(
            abi.encodePacked(
                "Review the following employment contract and respond to this query: ",
                query,
                "\n\nContract:\n",
                run.contractContent
            )
        );

        IOracle.Message memory newMessage = createNewMessage("user", prompt);
        run.messages.push(newMessage);
        run.messagesCount++;

        IOracle(oracleAddress).createOpenAiLlmCall(contractId, config);
    }

    function approveContract(
        uint contractId,
        bool approval
    ) public onlyEmployee(contractId) {
        ContractRun storage run = contractRuns[contractId];
        run.isApproved = approval;
        emit ContractReviewed(contractId, approval);
    }

    function getContractContent(
        uint contractId
    ) public view returns (string memory) {
        return contractRuns[contractId].contractContent;
    }

    function getMessageHistory(
        uint contractId
    ) public view returns (IOracle.Message[] memory) {
        return contractRuns[contractId].messages;
    }

    function createNewMessage(
        string memory role,
        string memory content
    ) private pure returns (IOracle.Message memory) {
        IOracle.Message memory newMessage = IOracle.Message({
            role: role,
            content: new IOracle.Content[](1)
        });
        newMessage.content[0].contentType = "text";
        newMessage.content[0].value = content;
        return newMessage;
    }

    function compareStrings(
        string memory a,
        string memory b
    ) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
