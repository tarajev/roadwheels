import { useState, useContext, useEffect } from 'react'
import AuthorizationContext from '../context/AuthorizationContext'
import { Page } from '../components/BasicComponents';
import '../assets/colors.css'
import '../assets/animations.css'
import mainImage from '../resources/img/mainImage2.png'
import SearchBar from '../components/SearchBar';
import VehiclePost from '../components/VehiclePost';
import axios from 'axios';

export default function DrawMainPage() {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const [overlayActive, setOverlayActive] = useState(false); // Potrebno za prevenciju background-tabovanja kada je forma aktivna
  const vehicles1 = [{ id: "64b8fce7b0e6f67422a1c1a1", city: "Berlin", pricePerDay: 75.5, brand: "Volkswagen", model: "California", seats: 4, mainImage: "https://example.com/images/vw-california.jpg", type: "Camper", transmission: "Automatic", fuelConsumption: 9.5 }, { id: "64b8fce7b0e6f67422a1c1a2", city: "Paris", pricePerDay: 45, brand: "Renault", model: "Clio", seats: 5, mainImage: "https://example.com/images/renault-clio.jpg", type: "Car", transmission: "Manual", fuelConsumption: 5.8 }, { id: "64b8fce7b0e6f67422a1c1a3", city: "New York", pricePerDay: 120, brand: "Harley-Davidson", model: "Road King", seats: 2, mainImage: "https://example.com/images/harley-roadking.jpg", type: "TouringMotorbike", transmission: "Manual", fuelConsumption: 6.2 }, { id: "64b8fce7b0e6f67422a1c1a4", city: "Amsterdam", pricePerDay: 20, brand: "Gazelle", model: "Ultimate T10", seats: 1, mainImage: "https://example.com/images/gazelle-bike.jpg", type: "TouringBicycle" }];

  const vehicleTypeDisplayNames = {
    Camper: "Camper",
    Car: "Car",
    TouringMotorcycle: "Touring Motorcycle",
    TouringBike: "Touring Bike"
  };

  const take = 12;
  const [vehicles, setVehicles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [skip, setSkip] = useState(0);
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [moreAvailable, setMoreAvailable] = useState(true);
  const [page, setPage] = useState(0);
  const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 150, behavior: "smooth" }); 
  }, []);

  useEffect(() => {
    getAllCountries();
  }, [])

  useEffect(() => {
    if (searchParams)
      searchVehicles(searchParams.country, searchParams.city, searchParams.vehicleType, searchParams.pickUpDate, searchParams.returnDate);
  }, [page])

  const getAllCountries = async () => {
    var route = "Country/GetAvailableCountries";
    await axios.get(APIUrl + route)
      .then(result => {
        const formatted = {};
        result.data.forEach(country => {
          formatted[country.name] = Object.keys(country.cityWithVehicles);
        });
        setShowNotFoundMessage(false);
        setCountries(formatted);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const searchVehicles = async (country, city, vehicleType, pickUpDate, returnDate) => {
    setVehicleType(vehicleTypeDisplayNames[vehicleType]);
    setSearchParams({ country, city, vehicleType, pickUpDate, returnDate });

    var route = "Vehicle/GetAvailableVehiclesByLocation";
    await axios.get(APIUrl + route, {
      params: {
        country: country,
        city: city,
        type: vehicleType,
        startDate: pickUpDate,
        endDate: returnDate,
        skip: page * take,
        take: take + 1
      }
    }).then(result => {
      setShowNotFoundMessage(false);
      //setVehicles(result.data);
      if (result.data.length > take) {
        setMoreAvailable(true);
        result.data.pop();
      }
      else
        setMoreAvailable(false);
      setVehicles(result.data);
    })
      .catch(error => {
        console.log(error);
        setVehicles([]);
        setShowNotFoundMessage(true);
      })
  }

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
        <SearchBar onSearch={searchVehicles} locations={countries}></SearchBar>
      </div>
      <div className='flex flex-wrap mt-20 gap-4 justify-center '>
        {vehicles.map((vehicle) => (
          <VehiclePost vehicle={vehicle}></VehiclePost>
        ))
        }
        {showNotFoundMessage ? `We currently don't have any ${vehicleType}s available at the requested location. Please try a different search.` : ""}
      </div>

      {vehicles.length > 0 &&
        <div className='flex justify-center mt-10 items-center gap-2'>
          <button
            onClick={() => {
              if (page > 0)
                setPage((prev) => prev - 1);
            }}
            disabled={page == 0}
            className="p-2 place-self-center bg-accent rounded-md shadow-md text-white flex items-center gap-2 hover:bg-orange disabled:opacity-50 disabled:hover:bg-accent "
          >Prev
          </button>
          <div className='text-lg font-cambria'>{page + 1}</div>
          <button
            onClick={() => {
              setPage((prev) => prev + 1);
            }}
            disabled={!moreAvailable}
            className="p-2 place-self-center bg-accent rounded-md text-white flex items-center gap-2 hover:bg-orange disabled:opacity-50 disabled:hover:bg-accent"
          >Next
          </button>
        </div>}

    </Page>
  );
}