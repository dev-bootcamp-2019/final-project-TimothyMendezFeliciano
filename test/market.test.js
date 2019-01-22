var MarketPlace = artifacts.require('MarketPlace')

contract('MarketPlace', function(accounts) {
	let admin1 = accounts[0]
	let admin2 = accounts[1]
	let shopOwner = accounts[2]
	let shopper = accounts[3]



	//I chose this function to make sure on admin can add another
	it("Should allow the addition of another admin", async() =>{
		const marketPlace = await MarketPlace.deployed()

		var eventEmitted = false

		const tx = await marketPlace.addAdmin(admin2, {from: admin1})

		const result = await marketPlace.isAdmin.call(admin2) 
		assert.equal(result, true, 'Value returned should be true')
	})

	//The purpose of this function is to make sure only previously added admins are marked as true
	it("Should return false if a user is not admin", async() => {
		const marketPlace = await MarketPlace.deployed()

		const result = await marketPlace.isAdmin.call(shopper)
		var expectedResult = false;

		assert.equal(result, expectedResult, "Shopper address cannot be true")
	})

	//Utilizing the added admin2 we now test whether shopper address was added as a store owner
	it("Addresses marked as StoreOwners should be marked as true", async() => {
		const marketPlace = await MarketPlace.deployed() 

		const tx = await marketPlace.addStoreOwner(shopOwner, {from: admin2})
		const result = await marketPlace.isStoreOwner(shopOwner)
		var expectedResult = true

		assert.equal(result, expectedResult, "shopOwner should be marked as true")
	})

	//Utilizing the established owner we prove that a store can be created
	it("Should prove store was added",async() => {
		const marketPlace = await MarketPlace.deployed()

		const tx = await marketPlace.addStore("Senpais Tankkobon", {from: shopOwner})
		

		const result = await marketPlace.store.call(shopOwner);
		var expectedResult = "Senpais Tankkobon"

		assert.equal(result.name, expectedResult, "Name was not given properly")
	})

	//Utilizing the established store we prove that a product was added
	it("Should allow the shopOwner to add a product", async() => {
		const marketPlace = await MarketPlace.deployed()

		const tx = await marketPlace.addProduct("Berserk Volume 36", 1, 14, {from: shopOwner})

		const result = await marketPlace.product.call(shopOwner)
		var expectedResult = "Berserk Volume 36"

		assert.equal(result.name, expectedResult, "Item was not added correctly")

	})

	//Utilizing the created product we shall now test whether the price can be changed
	it("Should allow the changing of an items price", async() => {
		const marketPlace = await MarketPlace.deployed()

		const tx = await marketPlace.changeProductPrice(24, {from: shopOwner})

		const result = await marketPlace.product.call(shopOwner)
		var expectedResult = 24

		assert.equal(result.price, expectedResult, "Product's price was not changed succesfully")
	})

	// Shopper should be able to purchase product from the shop owner
	it("Should allow shopper to purchase a product", async() => {
		const marketPlace = await MarketPlace.deployed()

		const tx = await marketPlace.purchaseProduct(shopOwner, 1, {from: shopper, value: 1000000000000000000})

		const result = await marketPlace.product.call(shopOwner)
		var expectedResult = 13

		assert.equal(result.availability, expectedResult, "Item was not discounted, therefore not purchased")
	})

	// Proves proper identification of all its users
	it("Should be able to identify users correctly", async() => {
		const marketPlace = await MarketPlace.deployed()

		const tx1 = await marketPlace.identifyUser(admin1, {from: admin1})
		const adminResult = await marketPlace.userType.call(admin1)
		var expectedResultAdmin = 1


		const tx2 = await marketPlace.identifyUser(shopOwner, {from: admin1})
		const shopOwnerResult = await marketPlace.userType.call(shopOwner)
		var expectedResultShopOwner = 2


		const tx3 = await marketPlace.identifyUser(shopper, {from: admin1})
		const shopperResult = await marketPlace.userType.call(shopper)
		var expectedResultShopper = 3

		assert.equal(adminResult, expectedResultAdmin, "user type for Admin was not identified correctly")
		assert.equal(shopOwnerResult, expectedResultShopOwner, "user type for Shop Owner was not identified correctly" )
		assert.equal(shopperResult, expectedResultShopper, "user type for Shopper was not identified correctly")
	})

});