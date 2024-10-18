// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract GullyBuddyMessaging {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    mapping(uint256 => Message) public messages; 
    uint256 public messageCount; 

    event MessageSent(address indexed sender, string content, uint256 timestamp); 

    // Function to send a message
    function sendMessage(string calldata _content) external {
        messages[messageCount] = Message({
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp
        });

        emit MessageSent(msg.sender, _content, block.timestamp); 
        messageCount++; 
    }

    // Function to retrieve a message by ID
    function getMessage(uint256 _id) external view returns (address, string memory, uint256) {
        require(_id < messageCount, "Message does not exist");
        Message memory message = messages[_id];
        return (message.sender, message.content, message.timestamp); 
    }
}
