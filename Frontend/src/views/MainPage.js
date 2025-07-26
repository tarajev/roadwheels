import { useState, useContext } from 'react'
import AuthorizationContext from '../context/AuthorizationContext'
import { Page } from '../components/BasicComponents';
import '../assets/colors.css'
import '../assets/animations.css'
import mainImage from '../resources/img/mainImage2.png'
import SearchBar from '../components/SearchBar';
import VehiclePost from '../components/VehiclePost';

export default function DrawMainPage() {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const [overlayActive, setOverlayActive] = useState(false); // Potrebno za prevenciju background-tabovanja kada je forma aktivna
  const vehicles = [{ "id": "64b8fce7b0e6f67422a1c1a1", "city": "Berlin", "pricePerDay": 75.5, "brand": "Volkswagen", "model": "California", "seats": 4, "mainImage": "https://example.com/images/vw-california.jpg", "type": "Camper" }, { "id": "64b8fce7b0e6f67422a1c1a2", "city": "Paris", "pricePerDay": 45, "brand": "Renault", "model": "Clio", "seats": 5, "mainImage": "https://example.com/images/renault-clio.jpg", "type": "Car" }, { "id": "64b8fce7b0e6f67422a1c1a3", "city": "New York", "pricePerDay": 120, "brand": "Harley-Davidson", "model": "Road King", "seats": 2, "mainImage": "https://example.com/images/harley-roadking.jpg", "type": "TouringMotorbike" }, { "id": "64b8fce7b0e6f67422a1c1a4", "city": "Amsterdam", "pricePerDay": 20, "brand": "Gazelle", "model": "Ultimate T10", "seats": 1, "mainImage": "https://example.com/images/gazelle-bike.jpg", "type": "TouringBicycle" }]

  return (
    <Page overlayActive={overlayActive} loading={true} overlayHandler={setOverlayActive}>
      <div className='px-2 h-1/3 bg-green grid grid-cols-2 gap-4 items-center relative'>
        <div className='col-span-1 text-center ml-2'>
          <h1 className='text-7xl font-lobster text-dark leading-tight'>
            Where the road takes you, we follow
          </h1>
          <p className='text-2xl text-beige mt-4 italic font-cambria'>Drive. Discover. Repeat.</p>
        </div>
        <div className='col-span-1 flex justify-center p-12'>
          <img src={mainImage} alt="Main visual" className='max-h-full mt-[-20px] object-cover' />
        </div>
      </div>
      <SearchBar></SearchBar>
      <div className='flex flex-wrap mt-20 gap-4 justify-center '>
        {vehicles.map((vehicle) => (
          <VehiclePost vehicle={vehicle}></VehiclePost>
        ))
        }
      </div>

    </Page>
  );
}