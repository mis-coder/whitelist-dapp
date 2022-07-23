const {ethers} = require('hardhat');

async function main(){

  //get the contract, you want to deploy
  const whitelistContract = await ethers.getContractFactory("Whitelist");

   //deploy the contract
   //pass the max number of addresses to be whitelisted to deploy function
   const deployedWhitelistContract = await whitelistContract.deploy(10);

   //we need to wait for the contract to be deployed
   await deployedWhitelistContract.deployed();

   //print the address of the deployed contract
   console.log(
    "Whitelist Contract Address",
    deployedWhitelistContract.address
   )

}


   //call the main function and catch if there is any error
   main()
   .then(() => process.exit(0))
   .catch((error) => {
    console.error(error);
    process.exit(1);
   })