//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    constructor() ERC20("ERC20-Token", "EToken") 
    {
        _mint(msg.sender, 1000000 * 10**18);
    }
}
