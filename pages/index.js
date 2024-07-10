import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/MyProject.sol/MyProject.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }
  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

 
  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(5);
      await tx.wait()
      getBalance();
    }
  }
  const addInterest = async() => {
    if (atm) {
      let tx = await atm.addInterest(20);
      await tx.wait()
      getBalance();
    }
  }
  const deductServiceCharge = async() => {
    if (atm) {
      let tx = await atm.deductServiceCharge(1);
      await tx.wait()
      getBalance();
    }
  }
  
  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Click here to connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Account Address: {account}</p>
        <p>Account Balance: {balance}</p>
        <button onClick={addInterest}>Add Interest at 20% Interest Rate</button>
        <p><button onClick={deposit}>Deposit 5 ETH</button></p>
        <p><button onClick={deductServiceCharge}>Service Charge 1 ETH</button></p>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Digital India Online ATM</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: DodgerBlue; 
          padding: 20px;
          border-radius: 10px;
        }
        header {
          background-color: Orange; 
          color: white;
          padding: 10px;
          border-radius: 10px;
        }
        button {
          margin: 5px;
          padding: 10px 20px;
          background-color: MediumSeaGreen;
          color: LightGray;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: Tomato;
        }
      `}
      </style>
    </main>
  )
}
