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
                    "Immitate the following texts and generate a short contract. Do not include any address, phone number, name and include my terms This Employment Agreement (Agreement) entered this 10th day of April, 2024 (Effective Date) BETWEEN: ",
                    "GRASCOPE INDUSTRIES LTD, a private limited liability company incorporated under the Laws of the Federal Republic of Nigeria, ",
                    "with its registered office in Nigeria, (hereinafter referred to as 'The Employer,' which term shall, where the context so admits, ",
                    "include its agents, successors, and assigns) of the one Part; AND GODWIN ALEXANDER EKAINU of 27 Okocha Street Mgbouba NTA, ",
                    "Port Harcourt, Nigeria (Tel: +2348064875115; Email: clsyfriday@gmail.com ) (hereinafter referred to as 'The Employee') of the other part; ",
                    "Both may individually be referred to as 'Party' and collectively referred to as 'The Parties'. RECITALS In consideration of the covenants ",
                    "and agreements herein contained and the monies to be paid hereunder, the Employer hereby employs the Employee and the Employee hereby ",
                    "agrees to perform services as an Employee of the Employer, upon the following terms and conditions: 1. ENGAGEMENT Subject to and in accordance ",
                    "with the terms and conditions outlined below, the Employer shall employ the Employee in the capacity of MOBILE DEVELOPER. 2. TERM The Employee's ",
                    "engagement term shall commence remotely on April 10, 2024, and shall continue for a period of one (1) year, unless terminated earlier as specified in this ",
                    "Agreement. It is understood and agreed that the initial 6 (six) months will constitute a probationary period during which the Employee`s performance will ",
                    "be under observation. Monthly performance evaluations will be conducted, culminating in a comprehensive review at the end of the probationary period. ",
                    "The Employer retains the right to, at its discretion, extend the probationary period for a more thorough assessment of the Employee`s performance. Any such ",
                    "extension will be communicated in writing to the Employee. 3. WORK SCHEDULE 3.1 The Employee`s normal hours of work are Mondays to Fridays, from ",
                    "8:30 am to 5:00 pm with a one-hour break. If the exigencies of the business require it, the Employee may be required to work outside these hours, including, ",
                    "late nights, weekends, and public holidays, as necessary to perform the duties without further remuneration. 3.2 The Employee shall not exempt themselves ",
                    "from work without obtaining prior written consent from the Employer, based on grounds considered cogent by the Employer, at least 24 hours in advance. 4. DUTIES OF THE EMPLOYEE ",
                    "4.1 The Employee will carry out the duties that are assigned to them by the Employer, including but not limited to the following: i. Develop high-quality mobile applications for iOS ",
                    "and/or Android platforms using programming languages such as Swift, Kotlin, or Flutter. ii. Collaborate with cross-functional teams, including designers, product managers, ",
                    "and other developers, to create intuitive and user-friendly mobile experiences. iii. Write clean, maintainable, and efficient code following best practices and coding standards. ",
                    "iv. Translate design mock-ups and wireframes into responsive and visually appealing user interfaces. v. Ensure a seamless user experience by optimizing UI performance and responsiveness ",
                    "across various devices and screen sizes. vi. Conduct thorough testing of applications to identify and fix bugs, performance issues, and other potential problems. ",
                    "vii. Continuously optimize mobile applications for speed, efficiency, and resource usage. viii. Use version control systems such as Git to manage codebase changes and collaborate effectively with team members. ",
                    "ix. Participate in code reviews to ensure code quality, consistency, and adherence to coding standards. x. Create and maintain technical documentation, including design documents, API references, and user manuals. ",
                    "xi. Keep abreast of the latest trends, tools, and technologies in mobile development. xii. Implement security best practices to safeguard user data and protect against vulnerabilities such as data breaches and unauthorized access. ",
                    "Ensure compliance with relevant regulations and standards such as GDPR, NDPR, etc.",
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
