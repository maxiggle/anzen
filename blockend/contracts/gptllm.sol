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
            frequencyPenalty: 21, // > 20 for null
            logitBias: "", // empty str for null
            maxTokens: 1000, // 0 for null
            presencePenalty: 21, // > 20 for null
            responseFormat: '{"type":"text"}',
            seed: 0, // null
            stop: "", // null
            temperature: 10, // Example temperature (scaled up, 10 means 1.0), > 20 means null
            topP: 101, // Percentage 0-100, > 100 means null
            tools: '[{"type":"function","function":{"name":"web_search","description":"Search the internet","parameters":{"type":"object","properties":{"query":{"type":"string","description":"Search query"}},"required":["query"]}}},{"type":"function","function":{"name":"code_interpreter","description":"Evaluates python code in a sandbox environment. The environment resets on every execution. You must send the whole script every time and print your outputs. Script should be pure python code that can be evaluated. It should be in python format NOT markdown. The code should NOT be wrapped in backticks. All python packages including requests, matplotlib, scipy, numpy, pandas, etc are available. Output can only be read from stdout, and stdin. Do not use things like plot.show() as it will not work. print() any output and results so you can capture the output.","parameters":{"type":"object","properties":{"code":{"type":"string","description":"The pure python script to be evaluated. The contents will be in main.py. It should not be in markdown format."}},"required":["code"]}}}]',
            toolChoice: "auto", // "none" or "auto"
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
        uint256 newContractId = contractRunsCount;
        ContractRun storage run = contractRuns[newContractId];

        run.employee = employee;
        run.hr = msg.sender;
        run.isApproved = false;

        // Clear previous content if any
        run.contractContent = "";

        // Clear previous messages
        delete run.messages;
        run.messagesCount = 0;

        // Create new message for contract generation
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

        // Prepare the Oracle request
        IOracle(oracleAddress).createOpenAiLlmCall(newContractId, config);
        emit ContractGenerated(msg.sender, employee, newContractId);

        return newContractId;
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
