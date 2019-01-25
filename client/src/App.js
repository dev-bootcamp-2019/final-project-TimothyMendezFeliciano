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
    contract: null,
    address: ' '
  };

  componentDidMount = async () => {

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts and balance
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
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

    // Used to identify the type of user
    const user = await contract.methods.identifyUser().call();

    // Get the value from the contract to prove it worked.
    const emergency = await contract.methods.getStopped().call();

    // Update state with the result.
    this.setState({UserType: user, Emergency: emergency });
  };

  handleAddress(event) {
    this.setState({
      address:event.target.value
    })
  }

  handleAddAdmin = async (event) => {
    const contract = this.state.contract;
    const address = this.state.address;

    const Tx = await contract.methods.addAdmin(address).call();
    
  };

  handleAddOwner = async (event) => {
    const contract = this.state.contract;
    const address = this.state.address;

    const Tx = await contract.methods.addStoreOwner(address).call();

  };

  handleActive = async (event) => {
    const contract = this.state.contract;
    var result = await contract.methods.toggleContractActive().call();
    this.setState({Emergency: result});
  };

  render()
  {
    if (!this.state.web3 && !this.state.Emergency) 
    {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    
    return (
    <div className="App">
    <h1> Welcome to the Online Market Place dApp!</h1>
    <p>
    As you are an admin, you have the privilege to these functions.
    </p>
    <h2> Add another admin.</h2>
    <input type="text" data={this.state.address} onChange={this.handleAddress.bind(this)} />
    <button onClick={this.handleAddAdmin.bind(this)}>Add Admin </button>

    <h2> Add store owner.</h2>
    <input type="text" data={this.state.address} onChange={this.handleAddress.bind(this)} />
    <button onClick={this.handleAddOwner.bind(this)}>Add Owner </button>

    <h2> Toggle Contract Active.</h2>
    <button onClick={this.handleActive.bind(this)}>Activate/Deactivate </button>
    </div>
    );
  }
}

export default App;
