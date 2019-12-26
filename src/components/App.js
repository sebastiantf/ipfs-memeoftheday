import React, { Component } from "react";
import "./App.css";
import MemeAbi from "../abis/Meme";
import Web3 from "web3";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

class LightDarkToggle extends Component {
  render() {
    return (
    <span id="light-dark-toggle">
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="moon" className="svg-inline--fa fa-moon fa-w-16" id="moon" role="img" viewBox="0 0 512 512" height="20px"><path fill="currentColor" d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"/></svg>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sun" className="svg-inline--fa fa-sun fa-w-16 inactive" id="sun" role="img" viewBox="0 0 512 512" height="20px"><path fill="currentColor" d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"></path></svg>
    </span>
    );
  }
}

class App extends Component {
  
  componentDidMount() {
    const lightDarkToggle = document
      .querySelector("#light-dark-toggle")
      .addEventListener("click", function() {
        const all = document.querySelectorAll("*");
        all.forEach((item) => {
          item.classList.toggle("dark");
        });
        const moonIcon = document.getElementById("moon");
        moonIcon.classList.toggle("inactive")
        const sunIcon = document.getElementById("sun");
        sunIcon.classList.toggle("inactive")
      });
  }
  
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadAccount();
    await this.loadContract();
    await this.loadMemeHash();
  }

  constructor(props) {
    super(props);

    this.state = {
      filename: null,
      buffer: null,
      memeHash: "",
      account: null,
      memeContract: null
    };
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert("Please install MetaMask!");
    }
  }

  async loadAccount() {
    const web3 = window.web3;
    // Load Account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    // console.log(this.state.account);
  }

  async loadContract() {
    const web3 = window.web3;
    // Load Meme Smart Contract
    // Use web3.eth.Contract to fetch the contract. It requires the abi and contractAddress as parameters
    // abi and contractAddress can be fetched from the abi json. It is imported as MemeAbi from "../abis/Meme"
    // abi and contractAddress need to be fetched from the correct network where the contract is deployed
    // network id is fetched using web3.eth.net.getId()
    console.log("Fetching smart contract..");
    const networkId = await web3.eth.net.getId();
    const networkData = MemeAbi.networks[networkId];
    if (networkData) {
      const abi = MemeAbi.abi;
      const contractAddress = networkData.address;
      console.log("Meme Contract address: ", contractAddress);
      const memeContract = await web3.eth.Contract(abi, contractAddress);
      console.log("Smart Contract fetched.");
      this.setState({ memeContract });
    } else {
      alert("Smart Contract not deployed to the detected network!");
    }
  }

  async loadMemeHash() {
    // Load MemeHash
    // functions in smart contracts can be called using contract.methods.function().call() without sending a transaction that costs gas
    const memeContract = this.state.memeContract;
    console.log("Fetching memeHash..");
    const memeHash = await memeContract.methods.get().call();
    console.log("MemeHash:", memeHash);
    this.setState({ memeHash });
  }

  captureFile = event => {
    event.preventDefault();
    console.log("capturing file...");

    const file = event.target.files[0];
    const filename = file.name;
    this.setState({ filename });
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      const buffer = Buffer(reader.result);
      this.setState({ buffer });
      console.log("file captured.");
      // console.log(this.state.buffer);
    };
  };

  // Example file hash: "QmeSxTw5TovftWvFDhfzMk9KB98qBhDRn9mFQNgLnDuByf"
  // Example URL: "https://ipfs.infura.io/ipfs/QmeSxTw5TovftWvFDhfzMk9KB98qBhDRn9mFQNgLnDuByf"
  uploadToIpfs = event => {
    event.preventDefault();
    console.log("adding", this.state.filename, "to IPFS..");
    ipfs.add(this.state.buffer, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log("IPFS add result: ", result);
      const memeHash = result[0].hash;
      console.log("Hash:", memeHash);
      console.log("file added to IPFS.");

      console.log("Adding new hash to blockchain..");
      const memeContract = this.state.memeContract;
      memeContract.methods.set(memeHash).send({ from: this.state.account }, r => {
        console.log("Hash added to blockchain.");
        this.setState({ memeHash });
      });
    });
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#" target="_blank" rel="noopener noreferrer">
            Meme Of The Day
          </a>
          <ul className="navbar-nav px-2">
            <li className="nav-item">
              <a href="#" className="nav-link">
                <span className="text-white">{this.state.account}</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} className="App-logo" alt="" />
                </a>
                <h1 className="header">Upload Meme</h1>
                <form onSubmit={this.uploadToIpfs}>
                  <label className="btn btn-primary">
                    Browse <input type="file" hidden onChange={this.captureFile} />
                  </label>
                  <label className="btn btn-primary">
                    Submit <input type="submit" hidden />
                  </label>
                </form>
                <p>{this.state.filename}</p>
                <LightDarkToggle />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
