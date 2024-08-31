// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.26;

import "./interfaces/IOracle.sol";

contract ContractSchema {
    struct SchemaField {
        string name;
        string fieldType;
    }

    event SchemaCreated(string name, SchemaField[] fields);

    function createSchema(
        string memory name,
        SchemaField[] memory data
    ) public {
        emit SchemaCreated(name, data);
    }
}
