import CalendarMonth from "./CalendarMonth"
import { Button } from "./BasicComponents"

export default function VehicleReservations({ startDate, endDate, handleDateSelect, onDeleteReservation, reservations, overlayRemove }) {
  return (
    <div className='p-2 flex flex-col mx-auto w-fit gap-5 items-center bg-[#f2f1e6] shadow-xl border border-[#c56d43] rounded-xl fade-in'>
      <p className='text-4xl font-semibold opacity-50'>Looking to book this vehicle?</p>
      <div className='flex gap-5 w-[52rem]'>
        <CalendarMonth startDate={startDate} endDate={endDate} onDateSelect={handleDateSelect} reservations={reservations} onDeleteReservation={onDeleteReservation} />
        <CalendarMonth startDate={startDate} endDate={endDate} onDateSelect={handleDateSelect} reservations={reservations} onDeleteReservation={onDeleteReservation} offset={1} />
      </div>
      <Button disabled={!startDate} onClick={() => overlayRemove(true)} className="py-3 px-16 h-fit rounded-lg text-xl">Book</Button>
    </div>
  )
}