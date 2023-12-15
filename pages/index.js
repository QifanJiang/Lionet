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
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');

  const handleBidClick = (nft) => {
    // Set the current NFT if needed or perform other actions
    setShowBidModal(true);
  };

  const closeBidModal = () => {
    setShowBidModal(false);
  };

  const handleBidAmountChange = (event) => {
    setBidAmount(event.target.value);
  };

  const submitBid = () => {
    console.log("Bid amount: ", bidAmount);
    // Here you can add the logic to submit the bid
    setShowBidModal(false);
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
        return item
      } catch (error){
        console.log(error)
      }
   })) 
    setNfts(items)
    setLoadingState('loaded') 
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
                          <p className="text-lg">{nft.description}</p>
                        </div>
                        <div className="p-4" style={{ backgroundColor: 'white' }}>
                          <p className="text-2xl mb-4 font-bold">Price: {nft.price} Eth</p>
                          <div className="btn-group">
                            <button onClick={() => buyNft(nft)} className="font-bold text-lg btn btn-dark text-white rounded p-4 shadow-lg mr-2">BUY</button>
                            {/* Attach handleBidClick to the BID button */}
                            <button onClick={() => handleBidClick(nft)} className="font-bold text-lg btn btn-dark text-white rounded p-4 shadow-lg">BID</button>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>

        {/* Bid Modal */}
        {showBidModal && (
            <div className="modal show" style={{ display: 'block' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Place a Bid</h5>
                    <button type="button" className="btn-close" onClick={closeBidModal}></button>
                  </div>
                  <div className="modal-body">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Bid amount in ETH"
                        value={bidAmount}
                        onChange={handleBidAmountChange}
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeBidModal}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={submitBid}>Bid</button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
