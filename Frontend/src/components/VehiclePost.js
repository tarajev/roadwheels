import car from '../resources/img/car.webp'
import seatIcon from '../resources/img/seat-icon.png'
import fuelIcon from '../resources/img/fuel-icon.png'
import gearIcon from '../resources/img/gearbox-icon.png'
import { useNavigate } from 'react-router-dom'

export default function VehiclePost({ vehicle, country, city }) {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/vehicle/${vehicle.type}/${vehicle.id}`);
  }

  return (
    <div className={`grid w-[300px] h-fit p-5 cursor-default shadow-xl rounded-md`}>
      <div className="flex w-fit h-fit mb-2 text-bold rounded-lg hover:bg-white cursor-pointer" onClick={() => handleOnClick()}>
        <img className="object-contain h-30" src={car} /> {/* da se izmeni ako se photos izmeni */}
      </div>
      <div className="grid mb-2 gap-4">
        <span className="text-dark text-xl font-bold font-cambria">{vehicle.brand + " " + vehicle.model}</span>
        <div className='flex text-dark gap-4 font-semibold sm:text-md md:text-lg opacity-80 font-cambria'>
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
        </div>
        <div className='flex'>
          <span className="text-accent text-xl font-bold font-cambria">{vehicle.pricePerDay + "$"}</span>
          <span className="text-dark text-lg font-cambria opacity-80">{"/day"}</span>
        </div>

      </div>
    </div>
  );
}
