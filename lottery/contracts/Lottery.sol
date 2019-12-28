pragma solidity >=0.5.0 <0.7.0;

contract Lottery {
    address public manager;

    constructor() public {
        manager = msg.sender;
    }
}
