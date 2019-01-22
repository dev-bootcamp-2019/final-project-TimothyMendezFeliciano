import React, { Component } from "react";
import MarketPlaceContract from "./contracts/MarketPlace.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component { 

  state = {
    UserType: null,
    Emergency: null, 
    web3: null, 
    accounts: null, 
    contract: null
  };

  componentDidMount = async () => {

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts and balance
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MarketPlaceContract.networks[networkId];
      const instance = new web3.eth.Contract(MarketPlaceContract.abi,
        deployedNetwork && deployedNetwork.address,
        );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.` + error
        );
      console.error(error);
    }
  };

  runExample = async () => {
    const contract = this.state.contract;
    const accounts = this.state.accounts;

    // Used to identify the type of user
    const user = await contract.methods.identifyUser(accounts[0]).call({from: accounts[0]});

    // Get the value from the contract to prove it worked.
    const emergency = await contract.methods.getStopped().call();

     //console.log(contract);
    // console.log(accounts[0]);

    // console.log(user);
    // console.log(emergency);

    // Update state with the result.
    this.setState({UserType: user, Emergency: emergency });
  };

  render()
  {

    if (!this.state.web3) 
    {
      return <div>Loading Web3, accounts, and contract...</div>;
    } 
    return (
    <div className="App">
    <h1> Welcome to the Online Market Place dApp! </h1>
    </div>
    );
  }
}

export default App;
