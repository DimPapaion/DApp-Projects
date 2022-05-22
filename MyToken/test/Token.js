var Token = artifacts.require("./Token.sol");

contract('Token', function(accounts) {
	var tokenInstance;

	it('initialize the contract', function(){
		return Token.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name, 'My Token', 'is the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol) {
			assert.equal(symbol, "MT", "correct symbol");
			return tokenInstance.version();

		}).then(function(version){
			assert.equal(version, "My Token version 1.0", "correct version");
		});
	})

	it('allocate the total supply correctly', function(){
		return Token.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){
			assert.equal(totalSupply.toNumber(), 1000000, 'set total supply to 1,000,000');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance){
			assert.equal(adminBalance.toNumber(), 1000000, 'allocate initial supply to admin');
		});
	});
});