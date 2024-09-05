// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import "./interfaces/IOracle.sol";
import "./text_storage.sol";

enum ContractStatus {
    Pending,
    Completed,
    Failed,
    EmptyResponse
}

contract EmployerContract {
    struct EmployerContractStruct {
        address employee;
        address hr;
        string contractContent;
        bool isApproved;
        IOracle.Message[] messages;
        uint256 messagesCount;
        uint256 createdAt;
        bool isTextExtraction;
        ContractStatus status;
    }

    mapping(uint256 => EmployerContractStruct) public employerContractStructs;
    uint256 private reviewCount;
    uint256 private employerContractStructsCount;
    uint256 private attestjsonCount;

    address private owner;
    address public oracleAddress;
    address public textStorageAddress;

    event ContractGenerated(
        address indexed hr,
        address indexed employee,
        uint256 indexed contractId
    );
    event OracleAddressUpdated(address indexed newOracleAddress);
    event TextExtracted(uint256 indexed attestjsonId, string extractedText);
    event ContractStatusUpdated(
        uint256 indexed contractId,
        ContractStatus status
    );

    event Log(string message, uint256 value);

    IOracle.OpenAiRequest private config;

    constructor(address initialOracleAddress, address _textStorageAddress) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        employerContractStructsCount = 0;
        textStorageAddress = _textStorageAddress;

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

    modifier onlyHR(uint256 contractId) {
        require(
            msg.sender == employerContractStructs[contractId].hr,
            "Caller is not HR"
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
        employerContractStructsCount++;
        uint256 newContractId = employerContractStructsCount;
        EmployerContractStruct storage run = employerContractStructs[
            newContractId
        ];
        run.status = ContractStatus.Pending;
        run.employee = employee;
        run.hr = msg.sender;
        run.isApproved = false;
        run.contractContent = "";
        run.createdAt = block.timestamp;

        delete run.messages;
        run.messagesCount = 0;

        createNewMessage(
            run,
            "user",
            string(
                abi.encodePacked(
                    "Generate an actual employment contract not an example and it should be based on the following terms: ",
                    employeeTerms
                )
            )
        );

        IOracle(oracleAddress).createOpenAiLlmCall(newContractId, config);
        emit ContractGenerated(msg.sender, employee, newContractId);

        return newContractId;
    }

    function onOracleOpenAiLlmResponse(
        uint256 runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {
        EmployerContractStruct storage review = employerContractStructs[runId];
        if (review.isTextExtraction) {
            handleTextExtractionResponse(runId, response, errorMessage);
        } else {
            handleContractGenerationResponse(runId, response, errorMessage);
        }
    }

    function handleContractGenerationResponse(
        uint256 runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) private {
        EmployerContractStruct storage run = employerContractStructs[runId];
        if (compareStrings(errorMessage, "")) {
            if (bytes(response.content).length == 0) {
                // Handle empty response
                run.status = ContractStatus.EmptyResponse;
                createNewMessage(run, "assistant", "Empty response received");
                emit ContractStatusUpdated(runId, ContractStatus.EmptyResponse);
            } else {
                // Handle successful response with content
                run.contractContent = response.content;
                run.status = ContractStatus.Completed;
                createNewMessage(run, "assistant", response.content);
                emit ContractStatusUpdated(runId, ContractStatus.Completed);
            }
        } else {
            createNewMessage(run, "assistant", errorMessage);
            run.status = ContractStatus.Failed;
            emit ContractStatusUpdated(runId, ContractStatus.Failed);
        }
        run.messagesCount++;
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

    function getContractContent(
        uint256 contractId
    ) public view returns (string memory) {
        return employerContractStructs[contractId].contractContent;
    }

    function getMessageHistory(
        uint256 contractId
    ) public view returns (IOracle.Message[] memory) {
        return employerContractStructs[contractId].messages;
    }

    function createNewMessage(
        EmployerContractStruct storage run,
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

    function getAllContracts()
        public
        view
        returns (
            uint256[] memory,
            EmployerContractStruct[] memory,
            bool[] memory,
            uint256[] memory
        )
    {
        uint256[] memory contractIds = new uint256[](
            employerContractStructsCount
        );
        EmployerContractStruct[]
            memory contracts = new EmployerContractStruct[](
                employerContractStructsCount
            );
        bool[] memory statuses = new bool[](employerContractStructsCount);
        uint256[] memory createdTimes = new uint256[](
            employerContractStructsCount
        );

        for (uint256 i = 1; i <= employerContractStructsCount; i++) {
            contractIds[i - 1] = i;
            contracts[i - 1] = employerContractStructs[i];
            statuses[i - 1] = employerContractStructs[i].isApproved;
            createdTimes[i - 1] = employerContractStructs[i].createdAt;
        }

        return (contractIds, contracts, statuses, createdTimes);
    }

    function extractTextFromGeneratedContract(
        uint256 contractid
    ) public returns (uint256) {
        reviewCount++;
        uint256 reviewId = reviewCount;

        emit Log("Fetching contract content", contractid);

        string memory contractContent = getContractContent(contractid);

        require(
            bytes(contractContent).length > 0,
            "Contract content is empty or null"
        );

        emit Log("Contract content fetched", bytes(contractContent).length);

        string memory prompt = string(
            abi.encodePacked(
                "You are an AI that strictly conforms to responses in JSON formatted strings.\n",
                "Your responses consist of valid JSON syntax, with no other comments, explanations, reasoning, or dialogue not consisting of valid JSON.\n",
                "The definition for your response schema will be included between these strings:\n",
                '"{schemaStart}"\n',
                "{\n",
                '    "employeeFullName": "",\n',
                '    "employerBusinessName": "",\n',
                '    "jobTitle": "",\n',
                '    "startDate": "",\n',
                '    "annualSalary": 0,\n',
                '    "weeklyHours": 0,\n',
                '    "employeeAddress": "",\n',
                '    "employerAddress": "",\n',
                '    "additionalDetails": "",\n',
                '    "noticePeriod": "",\n',
                '    "governingState": ""\n',
                "}\n",
                '"{schemaEnd}"\n',
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

        EmployerContractStruct storage review = employerContractStructs[
            reviewId
        ];
        review.isTextExtraction = true;
        createNewMessage(review, "user", prompt);
        IOracle(oracleAddress).createOpenAiLlmCall(reviewId, config);
        emit TextExtracted(reviewId, "");

        return reviewId;
    }

    function getExtractedText(
        uint256 reviewId
    ) public view returns (string memory) {
        return TextStorage(textStorageAddress).getExtractedText(reviewId);
    }

    function getContractStatus(
        uint256 contractId
    ) public view returns (ContractStatus) {
        return employerContractStructs[contractId].status;
    }
}
