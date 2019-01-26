pragma solidity ^0.5.0;

import "./SafeMathLib.sol";

contract MarketPlace {
  using SafeMathLib for uint256;
	// State mappings to keep track of admins and storeOwners
	mapping (address => bool) public admins;
	mapping (address => bool) public storeOwners;

	// State mappings
	// These are meant to link existing owners to their stores and products
	mapping (address => Store) public store;
	mapping (address => Product) public product;
	// Currently stores can only maintain 1 product tied to owners address
	// This could be changed in a future version of the market place

  // uint variable utilized to identify type of user
  // 1 for admins
  // 2 for shop owners
  // 3 for regular shoppers
  mapping (address => uint) public userType;
  // bool variable necessary to implement circuit breaker
  bool public stopped = false;

	constructor() public {
		admins[msg.sender] = true;
    identifyUser(msg.sender);
	}

	modifier onlyAdmin { 
		require (admins[msg.sender] == true); 
		_; 
	}

	modifier onlyOwner { 
		require (storeOwners[msg.sender] == true); 
		_; 
	}

  // Circuit Breaker implementation was based from michielmulders/cricuit-breaker-solidity.sol GitHub page
  modifier stopInEmergency { 
    if (!stopped) 
    _;
  }
  

  modifier onlyInEmergency { 
    if(stopped)
    _;
  }
  

	// Events used to log important events done by admins
	event AdminAdded(address _address);
	event StoreOwnerAdded(address _address);

	//Events used to log important events done by store storeOwners
	event StoreAdded(address _address);
	event ProductAdded(address _address);
	event ProductRemoved(address _address);
	event PriceChanged(address _address, uint _price);
	event AmountWithdrawn(address _address, uint _amount);

	//Event used to log important events done by shoppers
	event ProductPurchased(address _address, uint _price, uint _amount);
  /** 
  These struct's are intended to be used by the storeOwners
  so they can manage their stores and stock
  */
  struct Store {
  	string name;
  	uint funds;	
  }

  struct Product {
  	string name;
  	uint price;
  	uint availability;
  }

  //////// Simple Functions ////////
  /**
  @dev To vefirify if address is admin
  @param _address the addres to be verified as admin
  @return result true or false
  */
  function isAdmin(address _address) public view returns (bool result) {
    return admins[_address];
  }

  /** 
  @dev To verify if an address is a storeOwner
  @param _address the address to be verified as store owner
  @return result true or false
  */
  function isStoreOwner(address _address) public view returns (bool result) {
    return storeOwners[_address];
  }

  /**
  @dev To verify the type of user
  @param _address to be identified
  @return number corresponding to the userType
   */
  function identifyUser(address _address) public returns (uint) {
    if(isAdmin(_address)) userType[_address] = 1;
      else if(isStoreOwner(_address) || isAdmin(_address)) userType[_address] = 2;
    else userType[_address] = 3;
    return userType[_address];
  }

  /**
  @dev To verify the type of user
  @return number corresponding to the userType
   */
  function identifyUser() public returns (uint) {
    if(isAdmin(msg.sender)) userType[msg.sender] = 1;
      else if(isStoreOwner(msg.sender)) userType[msg.sender] = 2;
    else userType[msg.sender] = 3;
    return userType[msg.sender];
  }

  function getStopped() public view returns(bool result) {
    return stopped;
  }
  
  ///////////////////// ADMIN ONLY FUNCTIONS ////////

  /** 
  @dev Admin adds another address as an admin
  @param _address must be the address of user to be stated as admin
  @return admin the address tied to the admin is true or false
  */
  function addAdmin(address _address) onlyAdmin public returns (bool admin) {
  	admins[_address] = true;
  	emit AdminAdded(_address);
  	return admins[_address];
  }
  
  /**
  @dev Admin adds another store owner
  @param _address must be the address of the user to be stated as store owner
  @return bool the _address parameter is associated with a store
  */
  function addStoreOwner(address _address) onlyAdmin public returns (bool admin) {
  	storeOwners[_address] = true;
  	emit StoreOwnerAdded(_address);
  	return storeOwners[_address];
  }

  // @dev Utilized to toggle whether contract should be stopped
  // @return result tru or false depending on wheter the contract is active or not
  function toggleContractActive() onlyAdmin public returns (bool result) {
    stopped = !stopped;
    return stopped;
  }

  /////////////// ONLY STORE OWNER FUNCTIONS /////////////

  /**
  @dev Store owner creates a store
  @param _name name of the Store
  @return name of the store
  This function is a payable function
  and msg.value will be used for funds to be 
  attributed to the store.
  msg.sender will also be used to map the address of the function
  caller to the store.
  */
  function addStore(string memory _name)
  onlyOwner public payable returns (string memory name) {

  	store[msg.sender] = Store(_name, msg.value);
  	emit StoreAdded(msg.sender);
  	return store[msg.sender].name;
  }

  /**
  @dev Shop Owners can add a product to their store
  @param _productName will be the name of the product
  @param _price will be the price for the product
  @param _availability will determine the amount of items in stock
  @return name Name of the product
  @return price The price of the product
  @return availability The Amount of items in stock
  */
  function addProduct(string memory _productName, uint _price, uint _availability)
  onlyOwner public returns (string memory name, uint price, uint availabilty) {
  	product[msg.sender] = Product(_productName, _price, _availability);
  	emit ProductAdded(msg.sender);
  	return (product[msg.sender].name, product[msg.sender].price, product[msg.sender].availability);
  }

  /**
  @dev Shop Owners can delete an item from their store
  */
  function removeProduct()
  onlyOwner public {
  	delete product[msg.sender];
  	emit ProductRemoved(msg.sender);
  }

  /**
  @dev Shop Owners can change the price of a product
  @param _newPrice is to be the price for the product associated with msg.sender
  @return newPrice of the product tied to msg.sender
  */
  function changeProductPrice(uint _newPrice)
  onlyOwner public returns (uint newPrice) {
  	product[msg.sender].price = _newPrice;
  	emit PriceChanged(msg.sender, _newPrice);
  	return product[msg.sender].price;
  }

  /**
  @dev Shop Owners can withdraw an amount of ether owed to them
  @param amount is the desired amount to be withdrawn
  @return funds of the store tied to the address of the function caller
  */
  function withdraw(uint amount) onlyOwner onlyInEmergency public returns (uint funds) {
  	
  	store[msg.sender].funds -= amount;
  	msg.sender.transfer(store[msg.sender].funds);

  	require (amount <= store[msg.sender].funds);
  	emit AmountWithdrawn(msg.sender, amount);
  	return store[msg.sender].funds;
  }

  ///////////////// SHOPPER FUNCTIONS ///////////////

  /**
  @dev Shoppers can choose an item to purchase
  @param _ownerAddress is the address of the product owner
  @param _amount is the amount of items to be purchased
  @return caller the address who purchased the product
  @return name of the product
  @return amount of items purchased
  Function is marked as payable
  Funds are given to the store of the associated ethereum address.
  msg.sender is debited ether using the transfer() function.
  product availability is reduced by the amount of items purchased
  */
  function purchaseProduct(address _ownerAddress, uint _amount)
    public
    payable
    returns (address caller, string memory name, uint amount) {

  	store[_ownerAddress].funds += product[_ownerAddress].price * _amount;
  	msg.sender.transfer(product[_ownerAddress].price * _amount);
  	product[_ownerAddress].availability -= _amount;

  	require(msg.value >= product[_ownerAddress].price * _amount);

  	require (product[_ownerAddress].availability >= _amount);
  	
  	emit ProductPurchased(_ownerAddress, product[_ownerAddress].price * _amount, _amount);

  	return (msg.sender, product[_ownerAddress].name, _amount);
  }  
}
