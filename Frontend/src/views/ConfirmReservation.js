import { useEffect, useRef, useContext } from 'react';
import AuthorizationContext from '../context/AuthorizationContext'
import { Button, Exit } from '../components/BasicComponents';
import axios from 'axios';

export default function ConfirmReservation({ exitPopup, startDate, endDate, userID, vehicleID, vehicleType, pricePerDay }) {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const formRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target))
        exitPopup();
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!startDate) return;

  const days = endDate
    ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
    : 1;

  function toUTCDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00Z`;
  }

  function formatDate(date) {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleConfirm = () => {
    const payload = {
      userId: userID,
      vehicleId: vehicleID,
      startDate: toUTCDateString(startDate),
      endDate: endDate ? toUTCDateString(endDate) : toUTCDateString(startDate),
      vehicleType: vehicleType
    };

    axios.post(`${APIUrl}Reservation/ReserveAVehicle`, payload)
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
        console.error('Reservation error:', error);
        alert('Failed to create reservation.');
      });
  };

  return (
    <div className="overlay show font-cambria">
      <div className="sm:flex sm:items-center hidescrollbar sm:justify-center h-screen overflow-y-auto">
        <div ref={formRef} className="w-full max-w-3xl p-6 bg-white mx-auto rounded-md shadow-2xl fade-in">
          <Exit onClick={exitPopup} className="size-7" />

          <div className="flex flex-col mb-4 text-[#c56d43]">
            <h1 className="mx-auto mb-4 text-black opacity-70 text-2xl font-semibold">
              Are you sure you want to reserve this vehicle?
            </h1>
            <p className="mx-auto">Vehicle reservations can only be made up to 1 day in advance.</p>
            <div className="flex mx-auto">
              Please note that
              <p className='text-red-600 mx-1 font-semibold'>cancellations must be made at least 2 days prior</p>
              to the reservation date.
            </div>
            <p className="mx-auto">If a vehicle remains reserved under your name and you fail to pick it up, you will still be charged.</p>
          </div>

          <div className="flex flex-col items-center mb-6 text-center">
            <p className="text-lg font-medium text-gray-700 mb-2">
              {endDate ? (
                <>
                  Reservation Period:{" "}
                  <span className="text-[#c56d43] font-semibold">
                    {days} day{days > 1 ? "s" : ""}
                  </span>
                </>
              ) : "Reserved Date"}
            </p>

            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-[#c56d43] font-semibold">{formatDate(startDate)}</span>
              {endDate && (
                <>
                  <span className="text-gray-500">→</span>
                  <span className="text-[#c56d43] font-semibold">{formatDate(endDate)}</span>
                </>
              )}
            </div>

            <p className="text-gray-700 mt-3">
              Total price:{" "}
              <span className="text-[#c56d43] font-semibold">
                {(days * pricePerDay).toFixed(2)}$
              </span>
            </p>
          </div>

          <Button
            onClick={handleConfirm}
            className="flex justify-self-center py-3 px-16 h-fit rounded-lg text-xl"
          >
            Confirm reservation
          </Button>
        </div>
      </div>
    </div>
  );
}