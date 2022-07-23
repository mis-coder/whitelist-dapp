//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

contract Whitelist{
    uint8 public maxWhitelistAddresses;

    mapping(address => bool) public whitelistAddresses;

    uint8 public numAddressesWhitelisted;

    //user will decide the max number of addresses that can be whitelisted
    constructor(uint8 _maxWhitelistedAddresses){
        maxWhitelistAddresses = _maxWhitelistedAddresses;
    }

    /**
      this function adds the sender's address to the whitelist
     */
     function addAddressToWhitelist() public {
        //check if address is already whitelisted
        require(!whitelistAddresses[msg.sender], "Sender has already been whitelisted");
       
       //check if maximum limit of whitelisted addresses is reached
        require(numAddressesWhitelisted < maxWhitelistAddresses, "More addresses cannot be added, limit reached!");

        //add the sender's address to the whitelist and mark it as true
        whitelistAddresses[msg.sender] = true;

        //increment the number of whitelisted addresses
        numAddressesWhitelisted += 1;
     }

}