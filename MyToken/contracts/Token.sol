pragma solidity ^0.4.2;

contract Token {
    string public name = "My Token";
    string public symbol = "MT";
    string public version = "My Token version 1.0";

	uint256 public totalSupply;

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);

	mapping(address => uint256) public balanceOf;
	// Allowance 
	mapping(address => mapping(address => uint256)) public allowance;




	function Token(uint256  _initialSupply) public{
		balanceOf[msg.sender] = _initialSupply;

		totalSupply = _initialSupply; //Define total supply

	// transfer tokens
    }
	function transfer(address _to, uint256 _value) public returns(bool success){
		require(balanceOf[msg.sender] >= _value);

		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;

		Transfer(msg.sender, _to, _value);

		return true;

	}
	// Transfer is being approved

	function approve(address _spender, uint256 _value) public returns(bool success){
		allowance[msg.sender][_spender] = _value;

		Approval(msg.sender, _spender, _value);
		return true;
	}
	//Transfer from

	function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){

		require(_value <=balanceOf[_from]);
		require(_value <=allowance[_from][msg.sender]);

		balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        Transfer(_from, _to, _value);
        return true;

	}
		

}// cd DApp-Projects/MyToken