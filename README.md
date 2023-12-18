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
within the file.

Since our project used pinata which allows users to upload the NFTs to a cloud storage. If you want to use pinata as we did, you would have to create your own pinata account and store the corresponding account details in a .env file like we did. An example is provided below. 

## Example on creating a Pinata account
> 1. Create account
> 2. Under the Gateaways tab, you will automatically generate your distinct domain. Change your own domain on this line [here](https://github.com/QifanJiang/Lionet/blob/5b22ead73fbd33c36d118b9db10a13a31ca12531/pages/create-nft.js#L54)
> 3. Under API keys, generate a new key and set as admin.
> 4. Paste your API credentials within a newly created .env file in the root folder.<img width="586" alt="image" src="https://user-images.githubusercontent.com/30332629/236952357-fc3b6ab7-7f41-45b9-883e-91a19b0bbc28.png">
> 5. **NOTE: Simply just swap to your own pinataGatewayToken and JWT.**




Also, don't forget to change to your own domain on this line
[here](https://github.com/QifanJiang/Lionet/blob/5b22ead73fbd33c36d118b9db10a13a31ca12531/pages/create-nft.js#L54) 

If you want to test with a local network, don’t forget to start the ganache using the command:
```bash
ganache-cli
```
and setup the corresponding network with your metamask wallet.

Finally, you would run the line 
```bash
npm run local
```
in your terminal. Open http://localhost.3000 with your browser and have fun!








