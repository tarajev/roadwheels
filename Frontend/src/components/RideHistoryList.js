export default function RideHistoryList({ rides }) {
  const getCurrency = (country) => {
    if (country === "USA" || country === "Canada") return "$";
    if (country === "UK") return "£";
    return "€";
  };

  return (
    <div className="h-fit">
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="px-4 py-2 text-left border-b">Status</th>
            <th className="px-4 py-2 text-left border-b">Country</th>
            <th className="px-4 py-2 text-left border-b">City</th>
            <th className="px-4 py-2 text-left border-b">Vehicle</th>
            <th className="px-4 py-2 text-left border-b">Pick up date</th>
            <th className="px-4 py-2 text-left border-b">Drop-off date</th>
            <th className="px-4 py-2 text-left border-b">Total price</th>
          </tr>
        </thead>
        <tbody>
          {rides.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                No rides yet.
              </td>
            </tr>
          )}
          {rides.map((ride, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className={`px-4 font-medium py-2 border-b }`}>{ride.status}
              </td>
              <td className="px-4 py-2 border-b">{ride.country}</td>
              <td className="px-4 py-2 border-b">{ride.city}</td>
              <td className="px-4 py-2 border-b">{ride.vehicleBrand + " " + ride.vehicleModel || "Unknown"}</td>
              <td className="px-4 py-2 border-b">{new Date(ride.startDate).toDateString()}</td>
              <td className="px-4 py-2 border-b">{new Date(ride.endDate).toDateString()}</td>
              <td className="px-4 py-2 border-b">{ride.totalPrice}{getCurrency(ride.country)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
