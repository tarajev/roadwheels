import { useState, useEffect } from "react";
import { Link } from "./BasicComponents";
import { Loader } from "./BasicComponents";
import VehicleReservationsEmployee from "./VehicleReservationsEmployee";

export default function VehicleTable({ editVehicle, selectedCard, vehicles, preventTab }) {
  return (
    <table className="w-full">
      <thead>
        <tr className='from-accent bg-gradient-to-br to-orange uppercase color-accent text-left text-xs text-white font-medium leading-4'>
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
          <th className="px-6 py-3"></th>
        </tr>
      </thead>
      <TableBody editVehicle={editVehicle} selectedCard={selectedCard} vehiclesWithReservations={vehicles} preventTab={preventTab} />
    </table>
  );
}

function TableBody({ editVehicle, selectedCard, vehiclesWithReservations, preventTab }) {
  const [openVehicleIndex, setOpenVehicleIndex] = useState(null);

  useEffect(() => {
    setOpenVehicleIndex(null);
  }, [selectedCard]);

  const toggleDetails = (index) => {
    setOpenVehicleIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {vehiclesWithReservations.map((vehicleWithRes, index) => (
        <tbody key={`${vehicleWithRes.vehicle?.id ?? index}_${index}`} className={index % 2 === 0 ? "bg-beige" : "bg-yellow-50"}>
          <tr>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
              <div className="flex items-center gap-2 relative">
                <VehicleLogo vehicle={vehicleWithRes.vehicle} />

                <div className="text-sm font-medium leading-5 text-gray-900">
                  <Link route={`/vehicle/${selectedCard}/${vehicleWithRes.vehicle?.id}`}>
                    {vehicleWithRes.vehicle?.brand ?? "Unknown"}
                  </Link>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicleWithRes.vehicle?.model ?? "-"}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicleWithRes.vehicle?.year ?? "-"}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicleWithRes.vehicle?.transmission ?? "-"}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicleWithRes.vehicle?.fuelConsumption ?? "-"}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicleWithRes.vehicle?.seats ?? "-"}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicleWithRes.vehicle?.needsRepair ? "Yes" : "No"}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicleWithRes.vehicle?.country ?? "-"}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicleWithRes.vehicle?.city ?? "-"}</td>
            <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{vehicleWithRes.vehicle?.pricePerDay ?? "-"}$</td>
            <td className="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
              <Link
                className="!text-green"
                preventTab={preventTab}
                onClick={() => toggleDetails(index)}
              >
                <div className="flex gap-2">
                  {vehicleWithRes.reservations > 0 && (
                    <span className="bg-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                      {vehicleWithRes.reservations}
                    </span>
                  )}
                  {openVehicleIndex === index ? "Hide Reservations" : "Show Reservations"}
                </div>
              </Link>
            </td>
            <td className="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
              <Link className="!text-green" preventTab={preventTab} onClick={() => editVehicle(vehicleWithRes.vehicle)}>Edit</Link>
            </td>
          </tr>

          {openVehicleIndex === index && (
            <VehicleReservationsEmployee vehicleId={vehicleWithRes.vehicle.id} />
          )}
        </tbody>
      ))}
    </>
  );
}

function VehicleLogo({ vehicle }) {
  const fallbackSrc = `https://cdn-0.motorcycle-logos.com/thumbs/Logo-${vehicle?.brand ?? 'unknown'}.png`;
  const [imgSrc, setImgSrc] = useState(
    `https://www.carlogos.org/car-logos/${vehicle?.brand.toLowerCase() ?? 'unknown'}-logo.png`
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newSrc = `https://www.carlogos.org/car-logos/${vehicle?.brand.toLowerCase() ?? 'unknown'}-logo.png`;
    if (imgSrc !== newSrc) {
      setImgSrc(newSrc);
      setLoading(true);
    }
  }, [vehicle?.brand]);

  return (
    <>
      {loading &&
        <div className="w-10 h-7 flex justify-center">
          <Loader />
        </div>}

      <img
        className="w-10 h-7"
        src={imgSrc}
        alt={`${vehicle?.brand ?? 'unknown'} logo`}
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