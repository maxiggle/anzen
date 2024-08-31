// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.26;

contract TextStorage {
    mapping(uint256 => string) private extractedTexts;

    function storeExtractedText(
        uint256 reviewId,
        string memory extractedText
    ) public {
        extractedTexts[reviewId] = extractedText;
    }

    function getExtractedText(
        uint256 reviewId
    ) public view returns (string memory) {
        return extractedTexts[reviewId];
    }
}
