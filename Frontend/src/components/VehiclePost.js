import car from '../resources/img/car.webp'
import seatIcon from '../resources/img/seat-icon.png'
export default function VehiclePost({ vehicle, country, city }) {

  const handleOnClick = () => {

  }

  return (
    <div className={`grid w-[300px] h-fit p-5 cursor-default shadow-xl rounded-md`}>
      <div className="flex w-fit h-fit mb-2 text-bold rounded-lg hover:bg-white cursor-pointer" onClick={() => handleOnClick()}>
        <img className="object-contain h-30" src={car} /> {/* da se izmeni ako se photos izmeni */}
      </div>
      <div className="grid mb-2 md:text-lg gap-4">
        <span className="text-dark text-xl font-bold font-cambria">{vehicle.brand + " " + vehicle.model}</span>
        <span className="flex items-center text-dark font-semibold sm:text-md md:text-lg opacity-80 font-cambria">
          <img src={seatIcon} alt="seats" className="w-6 h-6 mr-1" />
          {vehicle.seats}
        </span>
        <div className='flex'>
          <span className="text-accent text-xl font-bold font-cambria">{vehicle.pricePerDay + "$"}</span>
            <span className="text-dark text-lg font-cambria opacity-80">{"/day"}</span>
          </div> 
        
      </div>
    </div>
  );
}
