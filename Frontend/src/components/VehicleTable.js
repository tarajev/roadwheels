import { useState, useEffect } from "react";
import { Link } from "./BasicComponents";
import { Loader } from "./BasicComponents";

export default function VehicleTable({ editVehicle, selectedCard, vehicles, preventTab }) {
  return (
    <table className="w-full">
      <thead>
        <tr className='bg-accent uppercase color-accent text-left text-xs text-white font-medium leading-4'>
          <th className="px-6 py-3">Brand</th>
          <th className="px-6 py-3">Model</th>
          <th className="px-6 py-3">Year</th>
          <th className="px-6 py-3">Transmission</th>
          <th className="px-6 py-3">Fuel/100km</th>
          <th className="px-6 py-3">Seats</th>
          <th className="px-6 py-3">Repair?</th>
          <th className="px-6 py-3">Country</th>
          <th className="px-6 py-3">City</th>
          <th className="px-6 py-3">Price</th>
          <th className="px-6 py-3"></th>
        </tr>
      </thead>
      <TableBody editVehicle={editVehicle} selectedCard={selectedCard} vehicles={vehicles} preventTab={preventTab} />
    </table>
  );
}

function TableBody({ editVehicle, selectedCard, vehicles, preventTab }) {
  return (
    <>
      {vehicles.map((vehicle, index) => (
        <tbody key={`${vehicle}_${index}`} className={index % 2 == 0 ? "bg-beige" : "bg-yellow-50"}>
          <tr>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <VehicleLogo vehicle={vehicle} />
                <div className="text-sm font-medium leading-5 text-gray-900">
                  {vehicle.brand}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicle.model}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicle.year}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicle.transmission}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicle.fuelConsumption}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicle.seats}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicle.needsRepair ? "Yes" : "No"}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicle.country}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicle.city}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicle.pricePerDay}$</td>
            <td className="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
              <Link className="!text-green" preventTab={preventTab} onClick={() => editVehicle(vehicle)}>Edit</Link>
            </td>
          </tr>
        </tbody>
      ))}
    </>
  );
}


function VehicleLogo({ vehicle }) {
  const fallbackSrc = `https://cdn-0.motorcycle-logos.com/thumbs/Logo-${vehicle.brand}.png`;
  const [imgSrc, setImgSrc] = useState(
    `https://www.carlogos.org/car-logos/${vehicle.brand.toLowerCase()}-logo.png`
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setImgSrc(`https://www.carlogos.org/car-logos/${vehicle.brand.toLowerCase()}-logo.png`);
    setLoading(true);
  }, [vehicle.brand]);

  return (
    <>
      {loading &&
        <div className="w-10 h-7 flex justify-center">
          <Loader />
        </div>}
        
      <img
        className="w-10 h-7"
        src={imgSrc}
        alt={`${vehicle.brand} logo`}
        style={{ display: loading ? "none" : "block" }}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
            setLoading(true);
          } else {
            setLoading(false);
          }
        }}
      />
    </>
  );
}