import { providers, Contract } from "ethers";
import { useState, useRef } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

const useContract = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [hasAdressjoinedWhitelist, setHasAddressJoinedWhitelist] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [numWhitelistedAddresses, setNumWhitelistedAddresses] = useState(0);

  const web3ModalRef = useRef();

  //function to get provider or signer as per the requirement
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();

    //rinkeby network has chainId = 4
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  //return new contract and the signer or provider as per requirement
  const getContract = async (needSigner, contractAddress, abi) => {
    const signerOrProvider = await getProviderOrSigner(needSigner);
    const contract = new Contract(contractAddress, abi, signerOrProvider);

    return { contract, signerOrProvider };
  };

  const addAddressToWhitelist = async () => {
    try {
      const { contract: whitelistContract } = await getContract(
        true,
        WHITELIST_CONTRACT_ADDRESS,
        abi
      );

      const transaction = await whitelistContract.addAddressToWhitelist();
      setLoading(true);

      await transaction.wait();
      setLoading(false);

      await getNumberOfWhitelisted();
      setHasAddressJoinedWhitelist(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const { contract: whitelistContract } = await getContract(
        false,
        WHITELIST_CONTRACT_ADDRESS,
        abi
      );

      const numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumWhitelistedAddresses(numberOfWhitelisted);
    } catch (error) {
      console.error(error);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const { contract: whitelistContract, signerOrProvider: signer } =
        await getContract(true, WHITELIST_CONTRACT_ADDRESS, abi);

      const address = await signer.getAddress();
      const hasJoinedWhitelist = await whitelistContract.whitelistAddresses(
        address
      );

      setHasAddressJoinedWhitelist(hasJoinedWhitelist);
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setIsWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isWalletConnected,
    hasAdressjoinedWhitelist,
    loading,
    numWhitelistedAddresses,
    addAddressToWhitelist,
    connectWallet,
    web3ModalRef,
  };
};

export default useContract;
