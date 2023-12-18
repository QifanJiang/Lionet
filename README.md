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

Since our project used pinata which allows users to upload the NFTs to a cloud database. If you want to use pinata as we did, you would have to create your own pinata account and store the corresponding account details in a .env file like we did. An example is provided below. 

**Simply just change your own pinataGatewayToken and JWT.**

Also, don't forget to change to your own domain on this line
[here](https://github.com/QifanJiang/Lionet/blob/5b22ead73fbd33c36d118b9db10a13a31ca12531/pages/create-nft.js#L54) 

If you want to test with a local network, don’t forget to start the ganache using the command:
```bash
ganache-cli
```
and setup the corresponding network with your metamask wallet.

Finally, you would do 
```bash
npm run local
```
in your terminal. Open http://localhost.3000 with your browser and have fun!








2. Changes in NFT bidding process:
   After our research, we discovered that many NFT trading platforms, aside from Opensea, implement only a real-time purchase form in their buying process. Opensea employs a bidding system similar to renowned platforms like eBay for its NFT products. However, Opensea's system is based on an Open Ascending Auction algorithm, which has inherent disadvantages. Recognizing this gap, our distinct auction algorithms aim to introduce a fresh approach to the market.
