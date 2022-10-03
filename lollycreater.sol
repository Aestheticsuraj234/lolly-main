// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma experimental ABIEncoderV2;

contract lolly {
    mapping(address => bool) creatorRegistered;
    mapping(address => ipfsContent) ipfsContents;
    struct ipfsContent{
        bytes32[] ipfsHash;
    }

    event Creator(address indexed newCreator, string indexed creatorName, uint registrationTime);
    event CreatorHash(address indexed creator, bytes32 indexed content, uint creationTime);


    function registerCreator(string memory _name) public returns (bool) {
        creatorRegistered[msg.sender] = true;
        emit Creator(msg.sender, _name, block.timestamp);
        return true;
    }

    function recordContent(bytes32 _contentHash) public returns (bool) {
        require(creatorRegistered[msg.sender] == true, "creator not registered");
        ipfsContents[msg.sender].ipfsHash.push(_contentHash);
        emit CreatorHash(msg.sender, _contentHash, block.timestamp);
        return true;

    }
}
