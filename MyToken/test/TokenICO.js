var TokenICO = artifacts.require("./TokenICO.sol");
var Token = artifacts.require("./Token.sol");

contract('TokenICO', function(accounts){
    var tokenInstance;
	var tokenICOInstance
	var buyer = accounts[1];
	var admin = accounts[0];
	var tokenPrice = 1000000000000000; // in wei 
	var tokenAvailable = 80000;
	var numberOfTokens;

	it('initialize the contract ', function(){
		return TokenICO.deployed().then(function(instance){
			tokenICOInstance = instance;
			return tokenICOInstance.address;
		}).then(function(address){
			assert.notEqual(address, 0x0, 'has the correct address');
			return tokenICOInstance.tokenContract();
		}).then(function(address){
			assert.notEqual(address, 0x0, 'has the token correct address');
			return tokenICOInstance.tokenPrice();
		}).then(function(price){
			assert.equal(price,tokenPrice, 'has the correct price');	
		});
	});

	it('activates the token buy', function(){
		return Token.deployed().then(function(instance){
			tokenInstance = instance;
			return TokenICO.deployed();
		}).then(function(instance){
			tokenICOInstance = instance;
			// initialize sell coins
            return tokenInstance.transfer(tokenICOInstance.address, tokenAvailable, {from: admin});
			}).then(function(receipt){
			numberOfTokens = 10;

			return tokenICOInstance.buyTokens(numberOfTokens, {from: buyer, value: numberOfTokens * tokenPrice});
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
		    assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
		    assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchase the tokens');
		    assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of purchased tokens');
			return tokenICOInstance.tokensSold();
		}).then(function(amount){
			assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of sold tokens');
			return tokenInstance.balanceOf(buyer);
        }).then(function(balance){
        	assert.equal(balance.toNumber(), numberOfTokens);
			return tokenInstance.balanceOf(tokenICOInstance.address);
		}).then(function(balance){
			assert.equal(balance.toNumber(), tokenAvailable - numberOfTokens);
		 // Try buy tokens with different ether value
		    return tokenICOInstance.buyTokens(numberOfTokens, {from: buyer, value: 1 })
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'msg.value must in equal number of tokens in wei');
            return tokenICOInstance.buyTokens(85000, {from: buyer, value: numberOfTokens * tokenPrice })
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'can not purchase more than the available balance of tokens');
		});
	});

	it(' ends the token ICO', function(){
		return Token.deployed().then(function(instance){
			tokenInstance = instance;
			return TokenICO.deployed();
		}).then(function(instance){
			tokenICOInstance = instance;
			// End sale from acount different than admin
			return tokenICOInstance.endSale({from: buyer});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'Only admin is authorized to end ICO');
            // end sale as admin
            return tokenICOInstance.endSale({from:admin});
		}).then(function(receipt){
			return tokenInstance.balanceOf(admin);

		}).then(function(balance){
			assert.equal(balance.toNumber(), 999990, 'returns all unsoild tokens to admin');
			//check if token price reset while the contract is destroyed
			return tokenICOInstance.tokenPrice();
		}).then(function(price){
			assert.equal(price.toNumber(), 0, 'token price is reset');
		});
	});
});