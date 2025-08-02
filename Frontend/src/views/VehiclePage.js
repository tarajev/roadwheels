import { useState, useContext, useEffect } from 'react'
import AuthorizationContext from '../context/AuthorizationContext'
import { Button, Page } from '../components/BasicComponents';
import '../assets/colors.css'
import '../assets/animations.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import seatIcon from '../resources/img/seat-icon.png'
import fuelIcon from '../resources/img/fuel-icon.png'
import gearIcon from '../resources/img/gearbox-icon.png'
import locationIcon from '../resources/img/location-icon.png'
import CalendarMonth from '../components/CalendarMonth';


export default function VehiclePage() {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const { type, vehicleId } = useParams();
  const [overlayActive, setOverlayActive] = useState(false);
  const [vehicle, setVehicle] = useState([]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  useEffect(() => {
    getVehicleDetails();
  }, [])

  const getVehicleDetails = async () => {
    await axios.get(APIUrl + `Vehicle/GetVehicleDetailsById/${type}/${vehicleId}`)
      .then(response => {
        setVehicle(response.data);
        console.log(response.data.imageUrls);
      })
      .catch(error => {
        console.error(error);
      })
  }
  return (
    <Page overlayActive={overlayActive} loading={true} overlayHandler={setOverlayActive}>
      <div className="w-full max-w-2xl mx-auto">
        {vehicle.imageUrls && <Slider {...settings}>
          {vehicle?.imageUrls.map((url, index) => (
            <div key={index}>
              <img
                src={`http://localhost:5050${url}`}
                alt={`vehicle-${index}`}
                className="w-full h-80 object-contain rounded-md shadow"
              />
            </div>
          ))}
        </Slider>}
      </div>

      <div className="grid mb-2 p-4 mx-20 gap-4">
        <span className="text-dark sm:text-2xl md:text-4xl font-bold">{vehicle.brand + " " + vehicle.model}</span>
        <div className='flex text-dark gap-4 font-semibold sm:text-lg md:text-xl lg:text-2xl opacity-80'>
          <span className="flex items-center">
            <img src={seatIcon} alt="seats" className="w-6 h-6 mr-1" />
            {vehicle.seats}
          </span>
          {vehicle.type !== "TouringBicycle" ? (
            <>
              <span className="flex items-center">
                <img src={fuelIcon} alt="fuel" className="w-5 h-5 mr-2" />
                {vehicle.fuelConsumption}
              </span>
              <span className="flex items-center">
                <img src={gearIcon} alt="transmission" className="w-6 h-6 mr-2" />
                {vehicle.transmission}
              </span>
            </>
          ) : null}
          <span className='flex opacity-80'>
            <img src={locationIcon} alt="location" className="w-6 h-6 mr-2" />
            {vehicle.city + ", " + vehicle.country}</span>
        </div>
        <div className='flex'>
          <span className="text-accent text-3xl font-bold">{vehicle.pricePerDay + "$"}</span>
          <span className="text-dark text-xl mt-2 opacity-80">{"/day"}</span>
        </div>
        <p className='sm:text-md md:text-lg lg: text-xl'>{vehicle.description}</p>
      </div>

      <div className='p-2 flex flex-col mx-auto w-fit gap-5 items-center bg-[#f2f1e6] shadow-xl border border-[#c56d43] rounded-xl'>
        <p className='text-4xl font-semibold opacity-50'>Looking to book this vehicle?</p>
        <div className='flex gap-5 w-[52rem]'>
          <CalendarMonth />
          <CalendarMonth offset={1} />
        </div>
        <Button className="py-3 px-16 h-fit rounded-lg text-xl">Book</Button>
        <div className='flex flex-col text-sm text-[#c56d43]'>
          <p className='mx-auto'>Vehicle reservations can only be made up to 1 day in advance.</p>
          <p className='mx-auto'>Please note that cancellations must be made at least 2 days prior to the reservation date.</p>
          <p className='mx-auto'>If a vehicle remains reserved under your name and you fail to pick it up, you will still be charged.</p>
        </div>
      </div>
    </Page>
  );
}