// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract NFTMarketplace is ERC721URIStorage ,ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsOnSale;

    uint256 listingPrice = 0.00025 ether;
    address payable owner;

    mapping (uint256 => MarketItem) public nfts;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool forSale;
        string name;
        string description;
    }

    event MarketItemCreated (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool forSale,
        string name,
        string description
    );

    constructor() ERC721("Metaverse Tokens", "METT") {
        owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
        require(owner == msg.sender);
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Create a marketplace item, a wrapper function of createNFT for client side */

    function createItem(string memory tokenURI, string memory name, string memory description) public payable nonReentrant returns (uint) {
        return createNFT(tokenURI, _tokenIds.current()+1, name, description);
    }



    /* Creates an nft */
    function createNFT(string memory tokenURI, uint256 tokenId, string memory name, string memory description) public returns (uint){
        require(tokenId - _tokenIds.current() == 1, "Invalid token Id.");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        nfts[tokenId] =  MarketItem(
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            0 ether,
            false,
            name,
            description
        );

        emit MarketItemCreated(
            tokenId,
            msg.sender,
            msg.sender,
            0,
            false,
            name,
            description
        );
        return newTokenId;
    }


    /* Get info of an nft */
    function getNFT(uint256 tokenId) public view returns (MarketItem memory) {
        require(_exists(tokenId));
        return nfts[tokenId];
    }


    /* Get current number of nfts */
    function getNumtokens() public view returns(uint256){
        return _tokenIds.current();
    }


    /* List an nft for sale, this will transfer ownership of nft to the smart contract */
    function listNFTForSale(
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0);
        require(msg.value == listingPrice);
        _itemsOnSale.increment();
        nfts[tokenId].forSale = true;
        nfts[tokenId].owner = payable (address(this)); // smart contract address
        nfts[tokenId].seller = payable (msg.sender);
        nfts[tokenId].price = price;
        _transfer(msg.sender, address(this), tokenId);

    }


    /* Remove an marketplace item from sale */
    function removeNFTFromSale(uint256 tokenId) public nonReentrant{
        require(_exists(tokenId));
        require(nfts[tokenId].forSale == true);
        require(nfts[tokenId].seller == msg.sender);
        nfts[tokenId].forSale = false;
        // Transfer ownership of the token back to the seller
        transferNFT(address(this), tokenId);
        // Decrement the items sold count
        if (_itemsOnSale.current() > 0) {
            _itemsOnSale.decrement();
        }
    }


    /* Transfer ownership of an NFT */
    function transferNFT(address fromOwner, uint256 tokenId) public {
        _transfer(fromOwner, msg.sender, tokenId);
        nfts[tokenId].owner = payable(msg.sender);

    }


    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function purchaseNFT(
        uint256 tokenId
    ) public payable nonReentrant {
        uint price = nfts[tokenId].price;
        address seller = nfts[tokenId].seller;
        require(msg.value == price);
        nfts[tokenId].forSale = false;
        nfts[tokenId].seller = payable(address(0));

        _itemsOnSale.decrement();
        transferNFT(address(this),tokenId);
        payable(owner).transfer(listingPrice);
        payable(seller).transfer(msg.value);
    }


    /* Returns all on sale market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _tokenIds.current();
        uint onSaleItemCount = _itemsOnSale.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](onSaleItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if (nfts[i + 1].owner == address(this)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = nfts[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }


    /* Returns only items that a user owned but not for sale */
    function fetchItemsUnListed() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (nfts[i + 1].owner == msg.sender && nfts[i + 1].forSale == false) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (nfts[i + 1].owner == msg.sender && nfts[i + 1].forSale == false) {
                uint currentId = i + 1;
                MarketItem storage currentItem = nfts[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }


    /* Returns only items that a user has listed for sale */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (nfts[i + 1].seller == msg.sender && nfts[i + 1].forSale == true) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (nfts[i + 1].seller == msg.sender && nfts[i + 1].forSale == true) {
                uint currentId = i + 1;
                MarketItem storage currentItem = nfts[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    mapping (uint256 => AuctionItem) public auctions;

    struct AuctionItem {
        uint256 tokenId;
        address payable seller;
        uint256 startingPrice;
        uint256 highestBid;
        address payable highestBidder;
        uint256 auctionStartTime;
        uint256 auctionEndTime;
        bool isActive;
    }

    event AuctionCreated (
        uint256 indexed tokenId,
        address seller,
        uint256 startingPrice,
        uint256 auctionStartTime,
        uint256 auctionEndTime,
        bool forSale
    );

    event BidPlaced(
        uint256 indexed tokenId,
        address bidder,
        uint256 bid
    );

    event AuctionEnded(
        uint256 indexed tokenId,
        address winner,
        uint256 winningBid
    );

    /* Function to create an auction */
    function createAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) public {
        require(_exists(tokenId));
        require(msg.sender == nfts[tokenId].owner);
        require(!nfts[tokenId].forSale);

        uint256 auctionEndTime = block.timestamp + duration;

        auctions[tokenId] = AuctionItem(
            tokenId,
            payable(msg.sender),
            startingPrice,
            0,
            payable(address(0)),
            block.timestamp,
            auctionEndTime,
            true
        );

        // Transfer the NFT to the contract for escrow
        _transfer(msg.sender, address(this), tokenId);

        // Update the NFT's status
        nfts[tokenId].forSale = true; // Now it's for auction (sale)
        nfts[tokenId].owner = payable(address(this)); // Contract is the temporary holder

        // Emit the AuctionCreated event
        emit AuctionCreated(
            tokenId,
            msg.sender,
            startingPrice,
            block.timestamp,
            auctionEndTime,
            true
        );
    }

    /* Function to place a bid */
    function placeBid(uint256 tokenId) public payable {
        AuctionItem storage auction = auctions[tokenId];
        require(auction.isActive);
        require(block.timestamp < auction.auctionEndTime);
        require(msg.value > auction.highestBid);

        // Refunding the previous highest bidder
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);

        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    // Function to end an auction
    function endAuction(uint256 tokenId) public {
        AuctionItem storage auction = auctions[tokenId];
        require(auction.isActive);
        require(block.timestamp >= auction.auctionEndTime);

        auction.isActive = false;
        if (auction.highestBidder != address(0)) {
            // Transfer the NFT to the highest bidder
            _transfer(address(this), auction.highestBidder, tokenId);
            // Transfer the funds to the seller
            payable(auction.seller).transfer(auction.highestBid);
        } else {
            // No bids were placed, return the NFT to the seller
            _transfer(address(this), auction.seller, tokenId);
        }

        emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
    }
}