var Token = artifacts.require("./Token.sol");
var TokenICO = artifacts.require("./TokenICO.sol");


module.exports = function (deployer) {
  deployer.deploy(Token, 1000000).then(function() {
    
    var tokenPrice = 1000000000000000; // 0.001 eth
    return deployer.deploy(TokenICO, Token.address, tokenPrice);
  });
  
};
