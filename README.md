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
Open http://localhost.3000 with your browser and have fun!








