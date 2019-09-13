import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
  }

  constructor(props) {
    super(props);

    this.state = {
      filename: null,
      buffer: null,
      memeHash: "QmeSxTw5TovftWvFDhfzMk9KB98qBhDRn9mFQNgLnDuByf"
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
      this.setState({ memeHash });
      console.log("Hash:", memeHash);
      console.log("file added to IPFS.");
    });
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#" target="_blank" rel="noopener noreferrer">
            Meme Of The Day
          </a>
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
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
