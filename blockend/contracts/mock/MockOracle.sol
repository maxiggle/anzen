// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.19;

// import "./mockInterfaces.sol";

// abstract contract MockOracle is IOracle {
//     // Store responses and errors for contract runs
//     mapping(uint => OpenAiResponse) private responses;
//     mapping(uint => string) private errors;

//     event ResponseSet(uint indexed runId, string content, string errorMessage);

//     // Simulate the behavior of the oracle
//     function createOpenAiLlmCall(
//         uint runId,
//         OpenAiRequest memory request
//     ) external override {
//         // Normally, this would interact with an external service
//         // For testing purposes, we don't need to do anything here
//     }

//     // Allows setting a response for a specific contract run
//     function setResponse(
//         uint runId,
//         string memory content,
//         string memory errorMessage
//     ) external {
//         responses[runId] = OpenAiResponse({content: content});
//         errors[runId] = errorMessage;
//         emit ResponseSet(runId, content, errorMessage);
//     }

//     // Function to simulate response retrieval
//     function getOpenAiResponse(
//         uint runId
//     ) external view returns (OpenAiResponse memory, string memory) {
//         return (responses[runId], errors[runId]);
//     }
// }
