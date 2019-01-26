const path = require("path");
var HDWallet = require("truffle-hdwallet-provider");
const infuraKey = "505b6f2149014c75bf76086db705c221";

const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
  	development: {
  		host: "127.0.0.1",
  		port: 7545,
  		network_id: "*"
  	},
    rinkeby: {
      provider: function() { return new HDWallet(mnemonic, `https://rinkeby.infura.io/${infuraKey}`)},
      network_id: 4,
      gas: 5500000
    }
  }
};
