import { useContext, useEffect, useState } from 'react';
import { Page, Input, Button, Loader } from '../components/BasicComponents';
import { Pagination } from '@mui/material';
import iconCar from '../resources/img/icon-car.png'
import iconCamper from '../resources/img/icon-camper.png'
import iconMotorcycle from '../resources/img/icon-motorcycle.png'
import iconBicycle from '../resources/img/icon-bicycle.png'
import iconPlus from '../resources/img/icon-plus.png'
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import AuthorizationContext from '../context/AuthorizationContext';
import VehicleTable from '../components/VehicleTable';
import VehicleCountCard from '../components/VehicleCountCard';
import VehicleEdit from './VehicleEdit';
import VehicleAdd from './VehicleAdd';

export default function EmployeePanel() {
  const { contextUser, APIUrl } = useContext(AuthorizationContext);
  const [overlayActive, setOverlayActive] = useState(false); // Potrebno za prevenciju background-tabovanja kada je forma aktivna
  const [loading, setLoading] = useState(true);
  const [searchTouched, setSearchTouched] = useState(false);

  const [editVehicleShown, setEditVehicleShown] = useState(false);
  const [addVehicleShown, setAddVehicleShown] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [cars, setCars] = useState([]);
  const [campers, setCampers] = useState([]);
  const [motorcycles, setMotorcycles] = useState([]);
  const [bikes, setBikes] = useState([]);

  const [selectedCard, setSelectedCard] = useState("Car");
  const [vehicleCounts, setVehicleCounts] = useState({
    cars: 0,
    campers: 0,
    motorcycles: 0,
    bicycles: 0
  });
  const [vehicles, setVehicles] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 600);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehiclesByType = () => {
    if (selectedCard == null || page == null) return;

    if (page === 0) {
      const cacheMap = {
        Car: cars,
        Camper: campers,
        TouringMotorcycle: motorcycles,
        TouringBike: bikes
      };

      if (cacheMap[selectedCard]?.length > 0) {
        setVehicles(cacheMap[selectedCard]);
        return;
      };
    }

    axios
      .get(`${APIUrl}Vehicle/GetVehiclesByType`, {
        params: { vehicleType: selectedCard, page }
      })
      .then((response) => {
        setVehicles(response.data);
        console.log(response.data);

        const setterMap = {
          Car: setCars,
          Camper: setCampers,
          TouringMotorcycle: setMotorcycles,
          TouringBike: setBikes
        };

        setterMap[selectedCard]?.(response.data);
      })
      .catch((error) => {
        setVehicles([]);
        console.error(`Error fetching vehicles for type ${selectedCard}:`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openAddVehicle = () => {
    setOverlayActive(true);
    setAddVehicleShown(true);
  }

  const cancelAddVehicle = () => {
    setOverlayActive(false);
    setAddVehicleShown(false);
  }

  const openEditVehicle = (vehicle) => {
    setOverlayActive(true);
    setEditVehicleShown(true);

    const vehicleWithType = { ...vehicle, type: selectedCard };
    setEditingVehicle(vehicleWithType);
  }

  const cancelEditVehicle = () => {
    setOverlayActive(false);
    setEditVehicleShown(false);
    setEditingVehicle(null);
  }

  useEffect(() => {
    axios
      .get(APIUrl + "Vehicle/GetVehicleCounts")
      .then((response) => {
        setVehicleCounts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching vehicle counts:", error);
      });
  }, []);

  useEffect(() => {
    fetchVehiclesByType();
  }, [selectedCard, page]);

  useEffect(() => {
    if (!debouncedSearch) {
      fetchVehiclesByType();
      return;
    }

    if (selectedCard == null || page == null || !searchTouched) return;

    axios
      .get(APIUrl + "Vehicle/SearchVehicle", {
        params: {
          searchTerm: debouncedSearch,
          vehicleType: selectedCard,
          page: page,
        },
      })
      .then((response) => {
        setVehicles(response.data);
        console.log("Search results:", response.data);
      })
      .catch((error) => {
        setVehicles([]);
        console.error("Error fetching search results:", error);
      });
  }, [debouncedSearch]);

  return (
    <>
      {editVehicleShown && <VehicleEdit vehicle={editingVehicle} onCancel={cancelEditVehicle} />}
      {addVehicleShown && <VehicleAdd onCancel={cancelAddVehicle} />}
      <Page loading={true} overlayActive={overlayActive} overlayHandler={setOverlayActive}>
        <div className='p-4 font-cambria'>
          <div className='flex gap-4 justify-center items-center'>
            {loading && <Loader />}
            <h3 className="justify-self-center text-3xl font-bold text-green">
              Employee Panel
            </h3>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-4 w-full mr-4">
            <VehicleCountCard setSelectedFunc={setSelectedCard} setSelectedType={"Car"} selectedCard={selectedCard} logo={iconCar} text="Cars" number={vehicleCounts.cars} preventTab={overlayActive} />
            <VehicleCountCard setSelectedFunc={setSelectedCard} setSelectedType={"Camper"} selectedCard={selectedCard} logo={iconCamper} text="Campers" number={vehicleCounts.campers} preventTab={overlayActive} />
            <VehicleCountCard setSelectedFunc={setSelectedCard} setSelectedType={"TouringMotorcycle"} selectedCard={selectedCard} logo={iconMotorcycle} text="Touring Motorcycles" number={vehicleCounts.motorcycles} preventTab={overlayActive} />
            <VehicleCountCard setSelectedFunc={setSelectedCard} setSelectedType={"TouringBike"} selectedCard={selectedCard} logo={iconBicycle} text="Touring Bikes" number={vehicleCounts.bicycles} preventTab={overlayActive} />
          </div>

          <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-8 xl:grid-cols-4'>
            <div className='grid md:col-span-8 h-fit lg:col-span-8 xl:col-span-4 bg-gray-100 shadow-lg rounded-lg p-3 mt-6'>
              <div className='flex justify-between'>
                <Button
                  preventTab={overlayActive}
                  onClick={openAddVehicle}
                  className="!bg-green hover:opacity-80 h-fit mb-3 px-3 py-1.5 flex flex-nowrap rounded-lg shadow-lg items-center"
                >
                  <img src={iconPlus} className='filter-white w-6 h-auto mr-1 -ml-1' />
                  Add a vehicle
                </Button>
              </div>
              <Input placeholder='Search vehicles...' className="rounded-xl pl-4" onChange={(e) => { setSearchTouched(true); setSearch(e.target.value) }} preventTab={overlayActive} />
            </div>
          </div>

          <div className="flex flex-col mt-8">
            <div className="py-2 -my-2 m:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              {vehicles.length !== 0 ?
                <div className="inline-block w-full overflow-x-scroll shadow-md rounded-lg">
                  <VehicleTable editVehicle={openEditVehicle} selectedCard={selectedCard} vehicles={vehicles} preventTab={overlayActive} />
                </div>
                : null}
              <div className='flex justify-center mt-4 color-primary'>
                {vehicles.length == 20 ?
                  <Pagination
                    size='large'
                    disabled={overlayActive ? true : false}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    className='filter-primary'
                  /> : null}
              </div>
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}