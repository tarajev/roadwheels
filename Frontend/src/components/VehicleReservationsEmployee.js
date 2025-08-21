import { useEffect, useContext, useState } from "react";
import axios from "axios";
import AuthorizationContext from "../context/AuthorizationContext";
import CalendarMonth from "./CalendarMonth";

export default function VehicleReservationsEmployee({ vehicleId }) {
  const { APIUrl, contextUser } = useContext(AuthorizationContext);
  const [reservations, setReservations] = useState([]);
  const getVehicleReservations = async () => {
    await axios.get(APIUrl + `Reservation/GetReservationsForVehicle/${vehicleId}`, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`
      }
    })
      .then(response => {
        console.log(response.data);
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

  useEffect(() => {
    getVehicleReservations();
  }, [])

  return (
    <tr>
      <td colSpan={12} className="px-6 py-4 appear-from-top transition-all bg-beige">
        <div className="mx-20">
          <div className="flex gap-2">
            <CalendarMonth reservations={reservations} employeeFlag={true} />
            <CalendarMonth reservations={reservations} employeeFlag={true} offset={1} />
          </div>
        </div>
      </td>
    </tr>
  );
}