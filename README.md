# Lionet
A Decentralized NFT Marketplace with Multi-Token Flexibility and Dynamic Auctions

## Team members:
Jiafu Chen jc5874
Qifan Jiang qj2172
Shouqiao Wang sw3717

## Instructions:
The first thing when you download the file is to run 
```bash
npm install
```
within the file.













Pain Points:

1. Limited Auction Functionality:
   Most of the NFT markets on the market are purely for buying and selling, and they do not support auction functionality. Even if some platforms support auctions, they only offer Open Ascending Auction. 

2. Potential Marginal Cost:
   Since the price of cryptocurrency is constantly changing, the value might decrease over time. For example, if sellers received currencies which are not their need, the time they required to spend on currency swapping may lose the original value.

3. Mismatch Cryptocurrency Type and Process:
   When an NFT seller specifies a cryptocurrency they accept for their NFT, but potential buyers may have a different type of cryptocurrency. Users then need to navigate multiple platforms to exchange one cryptocurrency for another before acquiring an NFT. This will not only generate additional charges, but also waste time which can result in the desired items being purchased by someone else.



Proposed Solution:

1. Dynamic Token Exchange:

a. Seller's Choice: Sellers can list their NFTs and set a price in a specific type of ERC20 token of their preference.
b. Buyer's Choice: Buyers can pay using any ERC20 token. 
c. Swap Token: If the buyer's token differs from the seller's preference, our platform will automatically swap the buyer's token to the seller's chosen token.
   Option 1: Integration with Uniswap: We can utilize Uniswap's API to facilitate the token swaps.
   Option 2: In-House Liquidity Pool: We can establish our own liquidity pool, providing more control over swap rates, reducing external dependencies.

The entire transaction process, from payment and token swap, will be governed by a transparent and secure smart contract.

2. Advanced Auction Mechanisms:

Here we proposed two types of auctions as examples.

a. Second Price Auction:
   Minimum Price Setting: Sellers set a reserve or minimum price for their NFT.
   Bidding: Buyers can place bids above the set minimum price.
   Off-chain Locktime: Bids will be securely locked and hidden during the auction duration.
   Smart Contract Execution: After the locktime, miners access the bids and the smart contract autonomously determines the highest bidder. This bidder wins but pays the second-highest bid amount.
b. Dutch Auction: 
   We can create an open descending price auction where the item starts at a high price which is set by the seller that decreases until a buyer is found.
   Smart Contract Execution: The smart contract calculates the final price of the item and executes it transparently and securely.


Why Web3:

1. Security:
   With the blockchain's inherent security features, our platform ensures every transaction, token swap and auction is tamper-proof, fostering trust among our users.

2. Decentralization:
   Our platform will utilize peer-to-peer capabilities, enabling users to set preferred ERC-20 tokens, all while avoiding central points of control or failure.

3. Authenticity:
   Every transaction and auction is securely logged on the blockchain.

4. Anonymity:
   Users can interact and transact without revealing their personal identities.



Proposed solution is clearly differentiated from the solutions in the market:

1. Integration of Uniswap to resolve the currencies conflicts:
   Opensea provides support for multiple currencies, including Ethereum, AVAX, USDC, KLAY, and DAI. This flexibility allows buyers to place bids using various currencies. But when a transaction occurs: what if the seller is not willing to accept the particular currency offered by the buyer? In our exploration of Opensea's features, we found no solution to address this. To fill this void, we're considering integrating Uniswap into the transaction process. This integration would offer a novel solution, enabling buyers to pay in their preferred currency while ensuring sellers receive the payment in their desired currency.

2. Changes in NFT bidding process:
   After our research, we discovered that many NFT trading platforms, aside from Opensea, implement only a real-time purchase form in their buying process. Opensea employs a bidding system similar to renowned platforms like eBay for its NFT products. However, Opensea's system is based on an Open Ascending Auction algorithm, which has inherent disadvantages. Recognizing this gap, our distinct auction algorithms aim to introduce a fresh approach to the market.
