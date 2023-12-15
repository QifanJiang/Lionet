import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal, Button, Form } from 'react-bootstrap'

const pinataGatewayToken = process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN;


import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../build/contracts/NFTMarketplace.json'

export default function CreatorDashboard() {
  const [listedNfts, setListed] = useState([])
  const [unlistedNfts, setUnListed] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [curtokenId,setcurTokenId] = useState(0)
  const [loadingState, setLoadingState] = useState('not-loaded')
  
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    loadNFTs()
  }, [curtokenId])
  
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const listedData = await contract.fetchItemsListed()
    const unListedData = await contract.fetchItemsUnListed()
    console.log("isModalOpen",isModalOpen)
    console.log("unListedData",unListedData)

    const items = await Promise.all(listedData.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const fullUri = `${tokenUri}${pinataGatewayToken}`;
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

    const itemsUnlisted = await Promise.all(unListedData.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const fullUri = `${tokenUri}${pinataGatewayToken}`;
      try{
        const meta = await axios.get(fullUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image:fullUri,
          name: i.name,
          description: i.description,
        }

        console.log("tokenId when fetched:", curtokenId)
        return item
      } catch (error){
        console.log(error)
      }
    }))

    setListed(items)
    setUnListed(itemsUnlisted)
    setLoadingState('loaded') 
  }
  
  const handleListForSale = (tokenId) => {
       setIsModalOpen(true)
       setcurTokenId(tokenId)
       console.log("tokenId as parameter:", tokenId)
       console.log("handleer called, tokenId:", curtokenId)
    }
 
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleInputChange = (event) => {
   setInputValue(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price= ethers.utils.parseUnits(inputValue, 'ether');
    console.log("tokenId when Handle submit:", curtokenId)

    try {
      // Approve the NFT for sale
      let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
      let listingPrice = await contract.getListingPrice()
      listingPrice = ethers.utils.hexlify(listingPrice)
      console.log("contract tokenId", curtokenId)
      console.log("contract price", price)
      let transaction = await contract.listNFTForSale(curtokenId, price, { value: listingPrice })
      await transaction.wait()
      
      // Refresh the NFT list
      await loadNFTs();

      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  const handleRemoveFromSale = async (tokenId) => {
       setcurTokenId(tokenId)
      //  console.log("tokenId as parameter:", tokenId)
      //  console.log("handleer called, tokenId:", curtokenId)
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      try {
        // Remove the NFT from sale
        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        console.log("contract tokenId", curtokenId)
        let transaction = await contract.removeNFTFromSale(curtokenId)
        await transaction.wait()
        
        // Refresh the NFT list
        await loadNFTs();
      } catch (error) {
        console.error(error);
      }
  }


  if (loadingState === 'loaded') {
    return (
        <div >

          <div>
            <Modal show={isModalOpen} onHide={handleCloseModal}>
            <Modal.Header>
            <Modal.Title>List This NFT For Sale</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>NFT Price:</Form.Label>
                  <Form.Control type="number" min = "0" max="100000000" placeholder = "Price in Eth (>0)" value={inputValue} onChange={(event) => handleInputChange(event)} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={(event) => handleSubmit(event, curtokenId)}>
                List for Sale
              </Button>
            </Modal.Footer>
            </Modal>
          </div>

          <div className="p-4">
            <h2 className="text-2xl py-2">NFT Listed For Sale: {listedNfts.length}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {listedNfts.length > 0 ? (
                  listedNfts.map((nft, i) => (
                      <div key={i} className="text-center border shadow rounded-xl overflow-hidden" style={{ backgroundColor: 'white' }}>
                        <img src={nft.image} className="img-thumbnail" style={{ width: '100%', height: 'auto' }} alt="NFT" />
                        <div className="p-2">
                          <p className="text-2xl font-semibold"> {nft.name}</p>
                          <div style={{ height: '20px', overflow: 'hidden' }}>
                            <p className="text-gray-400">{nft.description}</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-2xl font-bold">Price: {nft.price} Eth</p>
                          <button onClick={() => handleRemoveFromSale(nft.tokenId)} className="font-bold mt-4 text-lg btn btn-dark text-white rounded p-4 shadow-lg">Remove From Sale</button>
                        </div>
                      </div>
                  ))
              ) : (
                  <h5 className="text-center">No listed NFT</h5>
              )}
            </div>
          </div>

          {/* Unlisted NFTs Section */}
          <div className="p-4">
            <h2 className="text-2xl py-2">NFT Inventory: {unlistedNfts.length}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {unlistedNfts.length > 0 ? (
                  unlistedNfts.map((nft, i) => (
                      <div key={i} className="text-center border shadow rounded-xl overflow-hidden" style={{ backgroundColor: 'white' }}>
                        <img src={nft.image} className="img-thumbnail" style={{ width: '100%', height: 'auto' }} alt="NFT" />
                        <div className="p-2">
                          <p className="text-2xl font-semibold"> {nft.name}</p>
                          <div style={{ height: '20px', overflow: 'hidden' }}>
                            <p className="text-gray-400">{nft.description}</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-2xl font-bold">Not For Sale</p>
                          <button onClick={() => handleListForSale(nft.tokenId)} className="font-bold mt-4 text-lg btn btn-dark text-white rounded p-4 shadow-lg">List For Sale</button>
                        </div>
                      </div>
                  ))
              ) : (
                  <h5 className="text-center">None</h5>
              )}
            </div>
          </div>

        </div>
    )
    
  } else {
    return (<h1 className="py-10 px-20 text-3xl">Loading...</h1>)
  }

  
  
}
