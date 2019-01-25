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
    input: ' ',//This is really a string variable to manipulate input
    input2: ' ',
    input3: ' '
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
    const accounts = this.state.accounts;

    // Used to identify the type of user
    const user = await contract.methods.identifyUser().send({from: accounts[0]});

    // Get the value from the contract to prove it worked.
    const emergency = await contract.methods.getStopped().send({from: accounts[0]});

    // Update state with the result.
    this.setState({UserType: user, Emergency: emergency });
  };

  handleInput(event) {
    this.setState({
      input:event.target.value
    })
  }

  handleInput2(event) {
    this.setState({
      input2:event.target.value
    })
  }

  handleInput3(event) {
    this.setState({
      input3:event.target.value
    })
  }

  handleAddAdmin = async (event) => {
    const contract = this.state.contract;
    const input = this.state.input;
    const accounts = this.state.accounts;

    const Tx = await contract.methods.addAdmin(input).send({from: accounts[0]});
  }

  handleAddOwner = async (event) => {
    const contract = this.state.contract;
    const input = this.state.input;
    const accounts = this.state.accounts;

    const Tx = await contract.methods.addStoreOwner(input).send({from: accounts[0]});
  }

  handleActive = async (event) => {
    const contract = this.state.contract;
    const accounts = this.state.accounts;

    var emergency = await contract.methods.toggleContractActive().send({from: accounts[0]});

    this.setState({Emergency: emergency});
  }

  handleAddStore = async (event) => {
    const contract = this.state.contract;
    const accounts = this.state.accounts;
    const input = this.state.input;

    const Tx = await contract.methods.addStore(input).send({from: accounts[0], value: 1000000});
  }

  handleAddProduct = async (event) => {
    const contract = this.state.contract;
    const accounts = this.state.accounts;
    const input = this.state.input;
    const input2 = this.state.input2;
    const input3 = this.state.input3;

    const Tx = await contract.methods.addProduct(input, input2, input3).send({from: accounts[0]});
  }

  handleRemove = async (event) => {
    const contract = this.state.contract;
    const accounts = this.state.accounts;

    const Tx = await contract.methods.removeProduct().send({from: accounts[0]});
  }

  handlePrice = async (event) => {
    const contract = this.state.contract;
    const accounts = this.state.accounts;
    const input = this.state.input;

    const Tx = await contract.methods.changeProductPrice(input).send({from: accounts[0]});
  }

  handleWithdraw = async (event) => {
    const contract = this.state.contract;
    const accounts = this.state.accounts;
    const input = this.state.input;

    const Tx = await contract.methods.withdraw(input).send({from: accounts[0]});

  }

  handlePurchase = async (event) => {
    const contract = this.state.contract;
    const accounts = this.state.accounts;
    const input = this.state.input;
    const input2 = this.state.input2;

    const Tx = await contract.methods.purchaseProduct(input, input2).send({from: accounts[0], value: 1000000});
  }

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
    <p> Please provide user address. </p>
    <input type="text" data={this.state.input} onChange={this.handleInput.bind(this)} />
    <button onClick={this.handleAddAdmin.bind(this)}> Add Admin </button>

    <h2> Add store owner.</h2>
    <p> Please provide user address. </p>
    <input type="text" data={this.state.input} onChange={this.handleInput.bind(this)} />
    <button onClick={this.handleAddOwner.bind(this)}> Add Owner </button>

    <h2> Toggle Contract Active.</h2>
    <button onClick={this.handleActive.bind(this)}> Activate/Deactivate </button>

    <p>
    As you are a store owner you have access to these functions
    </p>
    <h2> Add store. </h2>
    <p> funds added will be those from msg.value </p>
    <input type="text" data={this.state.input} onChange={this.handleInput.bind(this)} />
    <button onClick={this.handleAddStore.bind(this)}> Add Store </button>

    <h2> Add product. </h2>
    <p> Please provide product name, price and availability </p>
    <input type="text" data={this.state.input} onChange={this.handleInput.bind(this)} />
    <input type="text" data={this.state.input2} onChange={this.handleInput2.bind(this)} />
    <input type="text" data={this.state.input3} onChange={this.handleInput3.bind(this)} />
    <button onClick={this.handleAddProduct.bind(this)}> Add Product </button>

    <h2> Remove Product. </h2>
    <p> This will delete the product tied to your address </p>
    <button onClick={this.handleRemove.bind(this)}> Remove Product </button>

    <h2> Change Product Price. </h2>
    <p> This will change the price of the product tied to your address </p>
    <input type="text" data={this.state.input} onChange={this.handleInput.bind(this)} />
    <button onClick={this.handlePrice.bind(this)}> Change Price </button>

    <h2> Withdraw Funds. </h2>
    <p> This will withdraw ether from your store to your account </p>
    <input type="text" data={this.state.input} onChange={this.handleInput.bind(this)} />
    <button onClick={this.handleWithdraw.bind(this)}> Withdraw Amount </button>

    <p>
    Welcome Shopper!
    Remember to provide the address of the account you want to purchase an item from.
    </p>
    <h2> Purchase Product. </h2>
    <p> Please provide the address of the owner. </p>
    <p> And the amount of items you would like to buy. </p>
    <p> The amount of ether sent will be decided in msg.value </p>
    <input type="text" data={this.state.input} onChange={this.handleInput.bind(this)} />
    <input type="text" data={this.state.input2} onChange={this.handleInput2.bind(this)} />
    <button onClick={this.handlePurchase.bind(this)}> Purchase Product </button>

    </div>
    );
  }
}

export default App;
