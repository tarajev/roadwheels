import { GetMonthName } from './BasicComponents';

export default function CalendarMonth({ offset = 0, children, startDate, endDate, reservations, onDateSelect }) {
  return (
    <div className='pt-2 h-fit border-y-2 rounded-lg grid col-span-1 shadow-md w-full bg-gray-50'>
      <div className='flex flex-wrap justify-center w-full h-fit bg-[#669676] text-white'>
        <p>{GetMonthName((new Date().getMonth() + offset) % 12)} {new Date().getFullYear()}.</p>
      </div>
      <ul className='p-2 m-2 grid grid-cols-7 gap-0.5 justify-center text-center h-fit rounded-md bg-gray-50'>
        <li key={'Mon'} className='shadow-md'>Mon</li>
        <li key={'Tue'} className='shadow-md'>Tue</li>
        <li key={'Wed'} className='shadow-md'>Wed</li>
        <li key={'Thu'} className='shadow-md'>Thu</li>
        <li key={'Fri'} className='shadow-md'>Fri</li>
        <li key={'Sat'} className='shadow-md'>Sat</li>
        <li key={'Sun'} className='shadow-md'>Sun</li>
        <ListDays
          offset={offset}
          startDate={startDate}
          endDate={endDate}
          onDateSelect={onDateSelect}
          reservations={reservations}
        />
      </ul>
      {children}
    </div>
  );
}

function ListDays({ offset = 0, startDate, endDate, onDateSelect, reservations = [] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const baseDate = new Date();
  const year = baseDate.getFullYear();
  const currentMonth = baseDate.getMonth();
  const month = (currentMonth + offset) % 12;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: adjustedFirstDay });

  const normalize = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const isReserved = (d) => reservations.some(r => d >= r.start && d <= r.end);

  const isSelected = (d) =>
    startDate
    && ((endDate && d >= normalize(startDate) && d <= normalize(endDate))
      || (!endDate && d.getTime() === normalize(startDate).getTime()));

  const findConflict = (start, end) => {
    const s = normalize(start);
    const e = normalize(end);

    const futureReservations = reservations
      .filter(r => r.start > s && r.start <= e)
      .sort((a, b) => a.start - b.start);

    return futureReservations.length > 0 ? futureReservations[0] : null;
  };

  const handleClick = (day) => {
    const d = normalize(new Date(year, month, day));

    if (!startDate || endDate || d < startDate) {
      return onDateSelect(d);
    }

    const conflict = findConflict(startDate, d);
    if (conflict) {
      const lastFree = new Date(conflict.start);
      lastFree.setDate(lastFree.getDate() - 1);
      return onDateSelect(lastFree);
    }

    onDateSelect(d);
  };

  return (
    <>
      {emptyCells.map((_, i) => <li key={`empty_${i}`} />)}
      {daysArray.map((day) => {
        const d = normalize(new Date(year, month, day));
        const reserved = isReserved(d);
        const disabled = (offset === 0 && d <= today) || reserved;

        return (
          <button
            key={`${day}_${month}`}
            disabled={disabled}
            onClick={() => handleClick(day)}
            className={`py-1 flex color-button-list items-center justify-center shadow-md 
              ${isSelected(d) ? "!bg-[#669676]" : ""} 
              ${reserved ? "!bg-[#c54d43] !text-white cursor-not-allowed" : ""} 
              ${d.getTime() === today.getTime() ? "ring-1 ring-black" : ""}`}
          >
            {day}
          </button>
        );
      })}
    </>
  );
}
