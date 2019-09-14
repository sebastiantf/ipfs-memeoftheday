# MemeOfTheDay

An Ethereum dApp utilizing IPFS storage to upload and fetch memes. Built using Ethereum smart contracts in Solidity and Truffle Suite.

The memes/images/files being uploaded are stored on the [IPFS](https://ipfs.io/) distributed network.

This project uses the public IPFS gateway: `https://ipfs.infura.io/ipfs/` provided by [Infura](https://infura.io/) to add the files to the IPFS network.

## Deployment

- Fork this repo

```
git clone https://github.com/your-username/ipfs-memeoftheday
cd ipfs-memeoftheday
npm install
```

- Fire up Ganache

```
truffle migrate --reset
npm start
```

## Built With

- [Truffle](https://www.trufflesuite.com/truffle) - Development framework for Ethereum DApps
- [Solidity](https://solidity.readthedocs.io/en/v0.5.3/) - High-level language for implementing Smart Contracts
- [IPFS](https://ipfs.io/) - InterPlanetary File System; a peer-to-peer distributed file system for a decentralized Web
- [Ganache](https://www.trufflesuite.com/ganache) - Personal Ethereum blockchain on your local machine
- [MetaMask](https://metamask.io/) - Allows the browser to interact with Ethereum blockchain and run DApps on the browser
- [web3.js](https://web3js.readthedocs.io/en/1.0/) - Library that allows the web app to interact with the Ethereum blockchain
