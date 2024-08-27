// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;
import "./interfaces/IOracle.sol";

// @title HRContractAI

contract HRContractAI {
    struct ContractRun {
        address employee;
        address hr;
        string contractContent;
        string employeeReview;
        bool isApproved;
        IOracle.Message[] messages;
        uint256 messagesCount;
    }

    mapping(uint256 => ContractRun) public contractRuns;
    uint256 private contractRunsCount;

    event ContractGenerated(
        address indexed hr,
        address indexed employee,
        uint256 indexed contractId
    );
    event ContractReviewed(uint256 indexed contractId, bool isApproved);

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

    modifier onlyHR(uint256 contractId) {
        require(msg.sender == contractRuns[contractId].hr, "Caller is not HR");
        _;
    }

    modifier onlyEmployee(uint256 contractId) {
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
    ) public returns (uint256) {
        contractRunsCount += 1;
        ContractRun storage run = contractRuns[contractRunsCount];

        run.employee = employee;
        run.hr = msg.sender;
        run.isApproved = false;

        createNewMessage(
            run,
            "user",
            string(
                abi.encodePacked(
                    "Generate an employment contract based on the following terms: ",
                    employeeTerms
                )
            )
        );
        run.messagesCount = 1;

        IOracle(oracleAddress).createOpenAiLlmCall(contractRunsCount, config);
        emit ContractGenerated(msg.sender, employee, contractRunsCount);

        return contractRunsCount;
    }

    function onOracleOpenAiLlmResponse(
        uint256 runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        ContractRun storage run = contractRuns[runId];

        if (compareStrings(errorMessage, "")) {
            run.contractContent = response.content;
            createNewMessage(run, "assistant", response.content);
        } else {
            createNewMessage(run, "assistant", errorMessage);
        }
        run.messagesCount++;
    }

    function reviewContract(
        uint256 contractId,
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

        createNewMessage(run, "user", prompt);
        run.messagesCount++;

        IOracle(oracleAddress).createOpenAiLlmCall(contractId, config);
    }

    function approveContract(
        uint256 contractId,
        bool approval
    ) public onlyEmployee(contractId) {
        ContractRun storage run = contractRuns[contractId];
        run.isApproved = approval;
        emit ContractReviewed(contractId, approval);
    }

    function getContractContent(
        uint256 contractId
    ) public view returns (string memory) {
        return contractRuns[contractId].contractContent;
    }

    function getMessageHistory(
        uint256 contractId
    ) public view returns (IOracle.Message[] memory) {
        return contractRuns[contractId].messages;
    }

    function createNewMessage(
        ContractRun storage run,
        string memory role,
        string memory content
    ) private {
        run.messages.push();
        IOracle.Message storage newMessage = run.messages[
            run.messages.length - 1
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
