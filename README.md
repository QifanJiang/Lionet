# Lionet
A Decentralized NFT Marketplace with Multi-Token Flexibility and Dynamic Auctions

## Team members:
- Jiafu Chen jc5874
- Qifan Jiang qj2172
- Shouqiao Wang sw3717

## Instructions:
The first thing when you download the file is to run 
```bash
npm install
```
within the file terminal.

Since our project used pinata which allows users to upload the NFTs to a cloud storage. If you want to use pinata as we did, you would have to create your own pinata account and store the corresponding account details in a .env file like we did. An example is provided below. 

### Example on creating a Pinata account
> 1. Create account
> 2. Under the Gateaways tab, you will be automatically generated your distinct domain. Change your own domain on this line [here](https://github.com/QifanJiang/Lionet/blob/5b22ead73fbd33c36d118b9db10a13a31ca12531/pages/create-nft.js#L54)
> 3. Under API keys, generate a new key and set as admin.<img width="829" alt="envfile pic " src="https://github.com/willeff1122/random-pic/blob/main/Screenshot%202023-12-18%20at%206.05.52%20PM.png">
> 4. Paste your API credentials within a newly created .env file in the root folder.<img width="829" alt="envfile pic " src="https://user-images.githubusercontent.com/30332629/236955423-0e201a56-ed2c-484e-8373-138331e3cff8.png">

  **NOTE: Simply just swap to your own pinataGatewayToken and JWT.**
> 5. Whenever you create a NFT using the program, the NFT will be uploaded under the files. <img width="829" alt="envfile pic " src="https://github.com/willeff1122/random-pic/blob/main/Screenshot%202023-12-18%20at%206.14.17%20PM.png">




If you want to test with a local network, don’t forget to start the ganache using the command:
```bash
ganache-cli
```
and setup the corresponding network with your metamask wallet.

Finally, you would run the line to deploy it on local host:
```bash
npm run local
```
Lastly, open http://localhost.3000 with your browser and have fun!

## Security:

- Reentrancy Guard: The contract uses OpenZeppelin's 'ReentrancyGuard' which is a mutex-lock mechanism to prevent reentrancy attacks. 
- Counters: Using OpenZeppelin's 'Counters' library for incrementing token IDs helps prevent overflow issues.
- Access Control: Functions that should only be callable by the contract owner, such as 'updateListingPrice', are protected with a 'require' statement that checks the sender's address.
- Safe ERC721 Transfers: The contract uses the '_transfer' function from ERC721, which includes checks for safe transfers, ensuring that tokens aren't sent to contracts that aren't prepared to handle them (unless intentionally done).
- Use of 'payable' Addresses: When transferring Ether, the contract uses 'payable' addresses to ensure that the addresses are capable of receiving Ether.

## Create NFT Testing:
![Create NFT](https://github.com/QifanJiang/Lionet/assets/76965351/6626cf0e-efc8-42a6-8a2c-7409c7a2fc80)

## Sell NFT Testing:
![Sale NFT](https://github.com/QifanJiang/Lionet/assets/76965351/5c8e263d-cf66-4a82-8a01-383f42b9f175)

## Purchase NFT Testing:
![Purchase NFT](https://github.com/QifanJiang/Lionet/assets/76965351/2b125d18-53ab-4a35-a03d-18b9cc53ca80)



