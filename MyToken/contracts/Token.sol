pragma solidity ^0.4.2;

contract Token {
    string public name = "My Token";
    string public symbol = "MT";
    string public version = "My Token version 1.0";

	uint256 public totalSupply;

	mapping(address => uint256) public balanceOf;

	function Token(uint256  _initialSupply) public{
		balanceOf[msg.sender] = _initialSupply;

		totalSupply = _initialSupply; //Define total supply

		//Allocate initial supply
		

	}
}// cd DApp-Projects/MyToken