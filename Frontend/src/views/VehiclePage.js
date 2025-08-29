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
import ConfirmReservation from './ConfirmReservation';
import VehicleReservations from '../components/VehicleReservations';

export default function VehiclePage() {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const { type, vehicleId } = useParams();
  const [overlayActive, setOverlayActive] = useState(false);
  const [vehicle, setVehicle] = useState([]);

  // Reservation data
  const [showConfirmReservation, setShowConfirmReservation] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [showReservation, setShowReservation] = useState(false);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const handleDateSelect = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    }
    else if (startDate && !endDate) {
      if (date >= startDate) {
        if (date.getTime() === startDate.getTime())
          setEndDate(null);
        else
          setEndDate(date);
      }
      else {
        setStartDate(date);
        setEndDate(null);
      }
    }
  };

  const getVehicleReservations = async () => {
    await axios.get(APIUrl + `Reservation/GetReservationsForVehicle/${vehicleId}`, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`
      }
    })
      .then(response => {
        const parsed = response.data.map(r => {
          const id = r.id;
          const status = r.status;
          const userId = r.userId;
          const start = new Date(r.startDate);
          const end = new Date(r.endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          return { id, userId, start, end, status };
        });
        setReservations(parsed);
      })
      .catch(error => console.warn(error));
  };

  const onDeleteReservation = async (reservation) => {
    if (!reservation) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = reservation.start.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // Ako ne brise rezervaciju 2 dana pre pickup vozila, prikazi opciju za brisanje
    if (diffDays > 2) {
      const confirmed = window.confirm("Are you sure you want to delete this reservation?");
      if (!confirmed) {
        return;
      }
    }
    else {
      window.alert("You can only cancel a reservation 2 days in advance! You will still be charged if you don't pick up the vehicle.");
      return;
    }

    await axios
      .delete(APIUrl + `Reservation/CancelReservation/${reservation.id}`, {
        headers: {
          Authorization: `Bearer ${contextUser.jwtToken}`
        }
      })
      .then(() => {
        alert("Reservation cancelled successfully.");
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
        alert("Failed to cancel reservation.");
      });
  };

  useEffect(() => {
    getVehicleDetails();
    getVehicleReservations();
  }, [])

  const getVehicleDetails = async () => {
    await axios.get(APIUrl + `Vehicle/GetVehicleDetailsById/${type}/${vehicleId}`, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`
      }
    })
      .then(response => {
        setVehicle(response.data);
      })
      .catch(error => {
        console.error(error);
      })
  }

  return (
    <>
      {showConfirmReservation &&
        <ConfirmReservation
          exitPopup={() => setShowConfirmReservation(false)}
          startDate={startDate}
          endDate={endDate}
          userID={contextUser.id}
          vehicleID={vehicleId}
          vehicleType={vehicle.type}
          pricePerDay={vehicle.pricePerDay}
        />
      }

      <Page overlayActive={overlayActive} loading={true} overlayHandler={setOverlayActive}>
        <div className='font-cambria'>
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

          {!showReservation
            ? <Button
              onClick={() => setShowReservation(true)}
              disabled={contextUser.role == "Guest"}
              className="flex mx-auto py-3 px-16 h-fit rounded-lg text-xl">
              {
                contextUser.role == "Guest" 
                ? "Log in to book this vehicle."
                : "Looking to book this vehicle?"
              }
            </Button>
            : <VehicleReservations
              startDate={startDate}
              endDate={endDate}
              handleDateSelect={handleDateSelect}
              onDeleteReservation={onDeleteReservation}
              reservations={reservations}
              overlayRemove={setShowConfirmReservation}
            />
          }
        </div>
      </Page>
    </>
  );
}