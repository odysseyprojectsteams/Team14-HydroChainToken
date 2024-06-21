import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import axios from 'axios'


export default function CreateItem() {
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()
  //const yourPinataApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0MjQ5OTI3OS0xZjBkLTQxOTEtYTc2Yy1lODAxMTVlMGI5MTQiLCJlbWFpbCI6Im1vaGFtZWRiZW5rZWRpbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGMwODRjYTA0MDM4MGVlZjUwOTIiLCJzY29wZWRLZXlTZWNyZXQiOiIzOWUxZjg4ODgzYTUyMjc5ZTdlZDZmZTFlOTVhZGFlMTZhOWRhZTE4OGJlMGExOGViNDM0NDM2OTIyM2ZlNGY4IiwiaWF0IjoxNzExNjcxOTMwfQ.MA2_fid984qteVNTPds7XCtSeR-phHUr9SQgezJmHo0"
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setuploadingFile] = useState(false);
  const [AllUploaded, SetAllUploaded] = useState(false);
  const pinata_gateway_key = "5-q_dlHrwXDKUxAs1ms5qmRBZYbUznM0pOAfg0ERTSlafrBhYcpJIeuo-qApT6fI";
  
    async function uploadFile(e) {
     
      const file = e.target.files[0];
      setuploadingFile(true);
      try{
            const formData = new FormData();
            formData.append("file",file);
            const resFile = await axios(
                {
                    method: "post",
                    url:"https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    crossOrigin: "anonymous",
                    headers: {
                      pinata_api_key: `8c084ca040380eef5092`,
                      pinata_secret_api_key : `39e1f88883a52279e7ed6fe1e95adae16a9dae188be0a18eb4344369223fe4f8`,
                      'content-Type':'multipart/form-data',
                    },
                }
            );
            setuploadingFile(false);  
            SetAllUploaded(true);
            const imageURL = `https://gray-wooden-tahr-281.mypinata.cloud/ipfs/${resFile.data.IpfsHash}?pinataGatewayToken=${pinata_gateway_key}`;
            setFileUrl(imageURL)
                
        }catch(err){
            console.log(err)
        }
      }

      async function uploadToIpfs(){
        if(!fileUrl) {
          window.alert('Wait untik file is uploaded !');
          return;
        }
        const {name , description ,price} = formInput;
        console.log(name, description , price )
        if(!name || !description || !price || !fileUrl) return;
        setUploading(false);
    
        try{
    
            var jsonData =  JSON.stringify({
                "pinataMetadata":{
                    "name":`${name}.json`
                },
                "pinataContent":{
                    name,description,image:fileUrl
                }
            })
    
            const resFile = await axios(
                {
                    method: "post",
                    url:"https://api.pinata.cloud/pinning/pinJSONToIPFS",
                    data: jsonData,
                    crossOrigin: "anonymous",
                    headers:{
                      pinata_api_key: `8c084ca040380eef5092`,
                      pinata_secret_api_key : `39e1f88883a52279e7ed6fe1e95adae16a9dae188be0a18eb4344369223fe4f8`,
                        'content-Type':'application/json',
                        // 'x-pinata-gateway-token':'8_Nb0Ku3iphoZoaTxkmXx7tbx-3TolAhqr3ePvPK6yXnYAiLJovKfDVxytHEP68P'
                    }
                }
            );
            setUploading(true);  
            const tokenURI = `https://gray-wooden-tahr-281.mypinata.cloud/ipfs/${resFile.data.IpfsHash}?pinataGatewayToken=${pinata_gateway_key}`;
          return tokenURI
        }catch(e){
            console.log("Error uploading file" , e)
        }
    };

  async function listNFTForSale() {
    if (!formInput.name || !formInput.description || !formInput.price) {
      window.alert('Please fill out all fields before listing the NFT for sale.');
      return;
    }
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const url = await uploadToIpfs()
    setUploading(true)
    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()
   
    router.push('/')
  }


  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <input 
          placeholder="Asset Name"
          className="mt-2 border border-blue-300 rounded p-3 block w-full focus:outline-none focus:border-blue-500"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-4 border border-blue-300 rounded p-3 block w-full focus:outline-none focus:border-blue-500"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price"
          type="number"
          className="mt-4 border border-blue-300 rounded p-3 block w-full focus:outline-none focus:border-blue-500"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="mt-4"
          onChange={uploadFile}
        />
        {uploadingFile && (
          <div className="mt-4 flex justify-center items-center">
            <span className="text-gray-700 font-bold">Uploading...</span>
          </div>
        )}
        <button onClick={() => listNFTForSale()} className="mt-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-6 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
         disabled={!AllUploaded}
         >
          Create NFT
        </button>
        {uploading && (
          <div className="mt-4 flex justify-center items-center">
            <span className="text-gray-700 font-bold">Creating the NFT. Please finish the payment process...</span>
          </div>
        )}
      </div>
    </div>
  )
 
}