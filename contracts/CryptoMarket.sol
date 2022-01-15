//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CryptoMarket {
    address owner;
    address token_contract_address;
    mapping(address => uint256) public balances;
    event Bought(
        uint256 date,
        address indexed from,
        address indexed to,
        uint256 indexed tokensAmount
    );
    event Sold(
        uint256 date,
        address indexed from,
        address indexed to,
        uint256 indexed tokensAmount
    );

    constructor(address _token_contract_address) {
        token_contract_address = _token_contract_address;
        owner = msg.sender;
    }

    function getBalance() public view returns (uint256) {
        return ERC20(token_contract_address).balanceOf(address(this));
    }

    function buyTokens(uint256 tokens) public {
        require(tokens > 0, "Error: Must specify some tokens");
        balances[msg.sender] += tokens;

        ERC20(token_contract_address).transferFrom(
            msg.sender,
            address(this),
            tokens
        );
        emit Bought(block.timestamp, msg.sender, address(this), tokens);
    }

    function sellTokens(uint256 tokens) public {
        require(tokens > 0, "Error: Must specify some tokens");
        balances[msg.sender] -= tokens;

        ERC20(token_contract_address).transfer(msg.sender, tokens);
        emit Sold(block.timestamp, address(this), msg.sender, tokens);
    }
}
