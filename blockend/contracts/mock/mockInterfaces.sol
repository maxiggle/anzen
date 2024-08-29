// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

interface IOracle {
    struct Content {
        string contentType;
        string value;
    }

    struct Message {
        string role;
        Content[] content;
    }

    struct OpenAiRequest {
        string model;
        uint frequencyPenalty;
        string logitBias;
        uint maxTokens;
        uint presencePenalty;
        string responseFormat;
        uint seed;
        string stop;
        uint temperature;
        uint topP;
        string tools;
        string toolChoice;
        string user;
    }

    struct OpenAiResponse {
        string content;
    }

    function createOpenAiLlmCall(
        uint runId,
        OpenAiRequest memory request
    ) external;

    function onOracleOpenAiLlmResponse(
        uint runId,
        OpenAiResponse memory response,
        string memory errorMessage
    ) external;

    function getOpenAiResponse(
        uint runId
    ) external view returns (OpenAiResponse memory, string memory);
}
