import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { useEffect} from "react";
import useContract from "../hooks/use-contract";

const Home = () => {
  const {
    isWalletConnected,
    connectWallet,
    hasAdressjoinedWhitelist,
    loading,
    addAddressToWhitelist,
    numWhitelistedAddresses,
    web3ModalRef,
  } = useContract();

  useEffect(() => {
    if (!isWalletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [isWalletConnected]);

  const renderButton = () => {
    if (isWalletConnected) {
      if (hasAdressjoinedWhitelist) {
        return (
          <div className={styles.thanksDiv}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Crypto Devs is an NFT collection for developers in Crypto.
          </div>
          {renderButton()}
          {!hasAdressjoinedWhitelist && (
            <div className={styles.joinedWhitelistInfo}>
              <span>{numWhitelistedAddresses}</span> have already joined the
              Whitelist
            </div>
          )}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.png" />
        </div>
      </div>
      <footer className={styles.footer}>
        Made with <span>&#10084;</span> by Crypto Devs
      </footer>
    </div>
  );
};

export default Home;
