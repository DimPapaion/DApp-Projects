App ={

	web3Provider: null, 
	contracts: {},
	account : '0x0',
	loading: false,
	tokenPrice: 1000000000000000,

	init: function(){
		console.log("App Initialized...")
		return App.initWeb3();
	},


	initWeb3: function() {
	    if (typeof web3 !== 'undefined') {
	      // If a web3 instance is already provided by Meta Mask.
	      App.web3Provider = web3.currentProvider;
	      web3 = new Web3(web3.currentProvider);
	    } else {
	      // Specify default instance if no web3 instance provided
	      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
	      web3 = new Web3(App.web3Provider);
	    }

	    return App.initContracts();
	},
	initContracts: function(){
		$.getJSON("TokenICO.json", function(tokenSale){
			App.contracts.TokenICO = TruffleContract(tokenSale);
			App.contracts.TokenICO.setProvider(App.web3Provider);
			App.contracts.TokenICO.deployed().then(function(tokenSale){
				console.log("Token Sale Address:", tokenSale.address);
			});
		}).done(function(){
			$.getJSON('Token.json', function (token){
				App.contracts.Token = TruffleContract(token);
				App.contracts.Token.setProvider(App.web3Provider);
				App.contracts.Token.deployed().then(function(token){
					console.log("Token Address:", token.address);
				});
				return App.render();
			});
		})
	},

	render:function(){

		if(App.loading){
			return;
		}
		App.loading = true;

		var loader = $('#loader');
		var content = $('#content');

		loader.show();
		content.hide();

		//load the account data
		web3.eth.getCoinbase(function(err, account){
			if( === null){
				App.account = account;
				$('#accountAddress').html("Your Account:" + account);
			}
		})

		App.contracts.TokenICO.deployed().then(function(instance){
			tokenICOInstance = instance;
			return tokenICOInstance.tokenPrice();
		}).then(function(tokenPrice){
			App.tokenPrice = tokenPrice;
			$('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
		});
		App.loading = false;
		loader.hide();
		content.show();
	}
}


$(function() {
	$(window).load(function() {

		App.init();
	})
});