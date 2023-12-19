import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import 'bootstrap/dist/css/bootstrap.min.css'

const pinataGatewayToken = process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN;
import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../build/contracts/NFTMarketplace.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])

  /***BID***/

  const [selectedNft, setSelectedNft] = useState(null);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [auctionPrice, setAuctionPrice] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('');

  const handleCreateAuctionClick = (nft) => {
    // Here, you'd typically check if the user is the owner of the NFT
    // if (userIsOwner(nft)) {
    setSelectedNft(nft);
    setShowAuctionModal(true);
    // }
  };

  const submitCreateAuction = async () => {
    if (!selectedNft) return;

    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer);

      const startingPrice = ethers.utils.parseUnits(auctionPrice, 'ether');
      const durationInSeconds = auctionDuration * 60; // if duration is in minutes

      console.log('Creating auction for token:', selectedNft.tokenId);
      console.log('Starting price:', startingPrice);
      console.log('Duration:', durationInSeconds);

      const transaction = await contract.createAuction(selectedNft.tokenId, startingPrice, durationInSeconds);
      await transaction.wait();

      setShowAuctionModal(false); // Close the auction modal
      loadNFTs(); // Reload the NFTs to update the UI
    } catch (error) {
      console.error('Error creating auction:', error);
      alert('Failed to create auction. Check console for more details.');
    }
  };


  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
     const provider = typeof window !== 'undefined' && window.ethereum
  ? new ethers.providers.Web3Provider(window.ethereum)
  : new ethers.providers.JsonRpcProvider('http://localhost:8545');
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const fullUri = `${tokenUri}${pinataGatewayToken}`
      try{
        const meta = await axios.get(fullUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: fullUri,
          name: i.name,
          description: i.description,
        }

        // Now fetch the auction details and add them to the item
        const auction = await contract.auctions(i.tokenId);
        item.auction = auction; // Assign the auction data to the item
        return item;
      } catch (error) {
        console.log(error);
        // Handle the error appropriately
        // You can choose to continue or throw the error
      }
    }));
    setNfts(items.filter(item => Object.keys(item).length !== 0)); // Filter out any empty items
    setLoadingState('loaded');
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.purchaseNFT(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (<div className="flex justify-center"><h1 className="px-20 py-10 text-3xl">No NFT in Marketplace</h1></div>)
  return (
      <div className="container">
        <div className="p-4">
          <h2 className="text-2xl py-2">NFT Listed For Sale: {nfts.length}</h2>
          {nfts.length > 0 && (
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  {nfts.map((nft, i) => (
                      <div key={i} className="text-center border shadow rounded-xl overflow-hidden" style={{ backgroundColor: 'white' }}>
                        <img src={nft.image} className="img-thumbnail" style={{ width: '100%', height: 'auto' }} alt="NFT" />
                        <div className="p-2">
                          <p className="text-2xl font-semibold"> {nft.name}</p>
                          <p className="text-gray-400">{nft.description}</p>
                        </div>
                        <div className="p-4" style={{ backgroundColor: 'white' }}>
                          <p className="text-2xl mb-4 font-bold">Price: {nft.price} Eth</p>
                          <div className="btn-group">
                            <button onClick={() => buyNft(nft)} className="font-bold text-lg btn btn-dark text-white rounded p-4 shadow-lg mr-2">BUY</button>
                            {/* Attach handleBidClick to the BID button */}
                            <button onClick={() => handleCreateAuctionClick(nft)} className="font-bold text-lg btn btn-dark text-white rounded p-4 shadow-lg">BID</button>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>

        {showAuctionModal && (
            <div className="modal show" style={{ display: 'block' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Create Auction</h5>
                    <button type="button" className="btn-close" onClick={() => setShowAuctionModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Auction Starting Price (ETH)</label>
                      <input
                          type="number"
                          className="form-control"
                          placeholder="Starting price in ETH"
                          value={auctionPrice}
                          onChange={(e) => setAuctionPrice(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Auction Duration (Minutes)</label>
                      <input
                          type="number"
                          className="form-control"
                          placeholder="Duration in minutes"
                          value={auctionDuration}
                          onChange={(e) => setAuctionDuration(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAuctionModal(false)}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={submitCreateAuction}>Create Auction</button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
