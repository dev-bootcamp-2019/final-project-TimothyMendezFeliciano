var MarketPlace = artifacts.require("./MarketPlace.sol");
var SafeMath = artifacts.require("./SafeMathLib.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, MarketPlace);
  deployer.deploy(MarketPlace)

  .then(() => console.log(MarketPlace.address));
};
