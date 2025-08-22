import { unstable_createUseMediaQuery } from '@mui/material';
import calendarIcon from '../resources/img/calendar-icon.png';
import locationIcon from '../resources/img/location-icon.png';
import vehicleIcon from '../resources/img/vehicle-icon.png';
import { useEffect, useState } from "react";

export default function SearchBar({ onSearch, locations }) {

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("City");
    const [vehicleType, setVehicleType] = useState("Camper");
    const [pickUpDate, setPickUpDate] = useState("");
    const [returnDate, setReturnDate] = useState("");

    const handleSearch = () => {
        if (selectedCountry && vehicleType && pickUpDate && returnDate) {
            onSearch(selectedCountry, selectedCity, vehicleType, pickUpDate, returnDate);
        } else {
            alert("Please fill all fields.");
        }
    };

    return (
        <div className="absolute grid grid-cols-[45%_45%_10%] -bottom-10 gap-4 left-1/2 transform -translate-x-1/2 z-10 bg-white p-4 rounded-md shadow-md w-full sm:w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4">
            {/* Leva polovina */}
            <div className="grid grid-cols-3  gap-6 border-r-2 pr-4">
                <div className="py-2 flex flex-col col-span-2">
                    <label className="mb-1">Location</label>
                    <div className="grid grid-cols-[55%_45%] gap-4 items-center">
                        {/* Country */}
                        <div className="flex items-center ">
                            <img src={locationIcon} alt="locationIcon" className="w-5 h-5 mr-1" />
                            <select
                                className="border rounded px-2 py-1 w-full"
                                value={selectedCountry}
                                label="Country"
                                onChange={(e) => {
                                    setSelectedCountry(e.target.value);
                                    setSelectedCity(locations[e.target.value][0]); // reset city
                                }}
                            >
                                <option value="" disabled>Country</option>
                                {Object.keys(locations).map((country) => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        {/* City */}
                        <div className="flex items-center">
                            <select
                                className="border rounded px-2 py-1 w-full mr-2"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option value="City" disabled>City</option>
                                <option value=""> All</option>
                                {locations[selectedCountry]?.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="py-2 flex flex-col col-span-1">
                    <label className="mb-1">Car Type</label>
                    <div className="flex items-center gap-2">
                        <img src={vehicleIcon} alt="Car Type" className="w-5 h-5" />
                        <select className="border rounded px-2 py-1 w-full" onChange={(e) => setVehicleType(e.target.value)}>
                            <option value={"Camper"}>Camper</option>
                            <option value={"Car"}>Car</option>
                            <option value={"TouringMotorcycle"}>Touring Motorcycle</option>
                            <option value={"TouringBike"}>Touring bike</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Desna polovina */}
            <div className="grid grid-cols-2 gap-4 pl-4">
                <div className="py-2 flex flex-col">
                    <label className="mb-1">Pick Up</label>
                    <div className="flex items-center gap-2">
                        <img src={calendarIcon} alt="Pick Up" className="w-5 h-5" />
                        <input onChange={(e) => setPickUpDate(e.target.value)} min={new Date().toISOString().split('T')[0]} type="date" className="border rounded px-2 py-1 w-full" />
                    </div>
                </div>

                <div className="py-2 flex flex-col">
                    <label className="mb-1">Return</label>
                    <div className="flex items-center gap-2">
                        <img src={calendarIcon} alt="Return" className="w-5 h-5" />
                        <input type="date" min={pickUpDate} disabled={!pickUpDate} onChange={(e) => setReturnDate(e.target.value)} className="border rounded px-2 py-1 w-full" />
                    </div>
                </div>
            </div>
            <div className="flex items-center mt-4">
                <button onClick={() => handleSearch()} className="bg-accent text-white rounded px-4 py-2 hover:bg-[#C56D43] transition">
                    Search
                </button>
            </div>


        </div>
    );
}
