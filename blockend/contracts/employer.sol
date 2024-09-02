// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import "./interfaces/IOracle.sol";

contract EmployerContract {
    struct EmployerContractStruct {
        address employee;
        address hr;
        string contractContent;
        bool isApproved;
        IOracle.Message[] messages;
        uint256 messagesCount;
    }

    mapping(uint256 => EmployerContractStruct) public employerContractStructs;
    uint256 private employerContractStructsCount;

    address private owner;
    address public oracleAddress;

    event ContractGenerated(
        address indexed hr,
        address indexed employee,
        uint256 indexed contractId
    );
    event OracleAddressUpdated(address indexed newOracleAddress);

    IOracle.OpenAiRequest private config;

    constructor(address initialOracleAddress) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        employerContractStructsCount = 0;

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

        run.employee = employee;
        run.hr = msg.sender;
        run.isApproved = false;
        run.contractContent = "";

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
        EmployerContractStruct storage run = employerContractStructs[runId];

        if (compareStrings(errorMessage, "")) {
            run.contractContent = response.content;
            createNewMessage(run, "assistant", response.content);
        } else {
            createNewMessage(run, "assistant", errorMessage);
        }
        run.messagesCount++;
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
        returns (uint256[] memory, EmployerContractStruct[] memory)
    {
        uint256[] memory contractIds = new uint256[](
            employerContractStructsCount
        );
        EmployerContractStruct[]
            memory contracts = new EmployerContractStruct[](
                employerContractStructsCount
            );

        for (uint256 i = 1; i <= employerContractStructsCount; i++) {
            contractIds[i - 1] = i;
            contracts[i - 1] = employerContractStructs[i];
        }

        return (contractIds, contracts);
    }
}
