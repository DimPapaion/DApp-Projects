pragma solidity ^0.4.2;

import './Token.sol';

contract TokenICO{

	address admin;
	Token public tokenContract;
	uint256 public tokenPrice; 
	uint256 public tokensSold;

	event Sell(
		address _buyer,
		uint256 _amount

	);

	function TokenICO(Token _tokenContract, uint256 _tokenPrice) public {
		//assign the admin 
		admin = msg.sender;
		// assign token contract
		tokenContract = _tokenContract;
		//fix token price in ETH
		tokenPrice = _tokenPrice;
	}
	//Multiply function for ds-math
	function multiply(uint x, uint y) internal pure returns (uint z) {
		require( y == 0 || (z = x * y) / y == x);
	}

	// Buy Tokens
	function buyTokens(uint256 _numberOfTokens) public payable {

		//require number of tokens to be equal to buy value
		require(msg.value == multiply(_numberOfTokens, tokenPrice));

		// require enough tokens
        require(tokenContract.balanceOf(this) >= _numberOfTokens);
		//require successful transfer
		require(tokenContract.transfer(msg.sender, _numberOfTokens));
		//Track the sold tokens 
		tokensSold += _numberOfTokens;

		//Sell event
		Sell(msg.sender, _numberOfTokens);
	}

	//END ICO
	function endSale() public {
		// Only authorized access is given to admin
        require(msg.sender == admin);
		// transfer remaining tokens to admin
		require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));

		//destroy contract
		selfdestruct(admin);

	}
}