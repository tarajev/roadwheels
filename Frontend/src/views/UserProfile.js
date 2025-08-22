import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Page, Link, GetMonthName } from '../components/BasicComponents'
import imagePlaceholder from '../resources/img/image-placeholder.png'
import star from '../resources/img/star-rating.png'
import AuthorizationContext from '../context/AuthorizationContext'
import axios from 'axios'
import DrawEditProfile from './EditProfile'
import RideHistoryList from '../components/RideHistoryList'


export default function DrawProfile() {
  const [showChangeProfile, setShowChangeProfile] = useState(false);

  const { APIUrl, contextUser} = useContext(AuthorizationContext);
  const [user, setUser] = useState({});
  const [userRides, setUserRides] = useState([]);
  const [page, setPage] = useState(1);
  const [ridesPerPage, setRidesPerPage] = useState(9);
  const [overlayActive, setOverlayActive] = useState(false); // Potrebno za prevenciju background-tabovanja kada je forma aktivna
  const { userID } = useParams();
  const [moreAvailable, setMoreAvailable] = useState(true);
  const navigate = useNavigate();


  const handleChangeProfileClick = () => {
    setShowChangeProfile(true);
  };

  const handleExitChangeProfileClick = () => {
    setShowChangeProfile(false);
  };

  const updateProfileInformation = (updatedUser) => {
    setUser((prev) => ({
      ...prev,
      phoneNumber: updatedUser.phoneNumber,
      name: updatedUser.name
    }));
  }

  useEffect(() => {
    if (showChangeProfile)
      setOverlayActive(true);
    else
      setOverlayActive(false);
  }, [showChangeProfile])

  useEffect(() => {
    if (contextUser.jwtToken) {
      getUserRideHistory();
      getProfileData();
    }
  }, [contextUser, userID]);

  useEffect(() => {
    if (contextUser.jwtToken) {
      getUserRideHistory();
    }
  }, [page])

  const getProfileData = async () => {
    console.log("id:" + contextUser.id);
    await axios.get(APIUrl + `User/GetUser/${userID}`, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`
      }
    })
      .then(request => {
        var data = { ...request.data }
        setUser(data)
      })
      .catch(error => {
        console.log(error);
        if (error.response) {
          switch (error.response.status) {
            case 401:
              navigate("../Unauthorized");
              break;
            case 404:
              navigate("../NotFound");
              break;
          }
        }
      })
  }

  const getUserRideHistory = async () => {
    await axios.get(APIUrl + `Reservation/GetUserReservations/${userID}/${page}`, {
      /* headers: {
         Authorization: `Bearer ${contextUser.jwtToken}`
       }*/
    })
      .then(request => {
        if (request.data.length > ridesPerPage) { //limit je postavljen na 10, prikazuje se 9 po stranici, taj jedan nam je da znamo da li ima još ili ne za peginaciju (next)
          setMoreAvailable(true);
          request.data.pop();
        }
        else
          setMoreAvailable(false);
        setUserRides(request.data);
      })
      .catch(error => {
        console.log(error);
      })
  }



  return (
    <Page loading={true} overlayActive={overlayActive} overlayHandler={setOverlayActive}>
      {showChangeProfile && <DrawEditProfile handleExitClick={handleExitChangeProfileClick} user={user} updateProfileInformation={updateProfileInformation} />}
      <div className='grid gap-4 grid-cols-12 bg-green bg-opacity-70  px-3 pt-3 pb-2 rounded-t-md'>
        <div className='col-span-9 sm:col-span-10 flex flex-col '>
          <div className='flex h-fit'>
            <p className='sm:pt-3 text-3xl'>
              {user.name}
            </p>
          </div>
          <InfoBlock obj={user} />
          <div>
            {user.id === contextUser.id && <Link onClick={handleChangeProfileClick} className="block my-1 font-semibold italic" preventTab={overlayActive}>Update profile</Link>}
          </div>
        </div>
      </div>
      <hr className='border-4  border-orange' />
      <h1 className='text-xl col-span-12 font-bold font-cambria text-orange mt-4'>Rides History</h1>
      <div className='grid gap-2 grid-cols-12 p-2 grid-rows-auto mt-1 h-auto sm:max-h-[490px] w-full bg-green bg-opacity-70'>
        <div className='col-span-12'>
          <RideHistoryList rides={userRides} />
          {userRides.length > 0 &&
            <div className='flex justify-center mt-3 items-center gap-2'>
              <button
                onClick={() => {
                  if (page > 1)
                    setPage((prev) => prev - 1);
                }}
                disabled={page == 1}
                className="p-2 place-self-center bg-green opacity-80 rounded-md text-white flex items-center gap-2 hover:bg-green hover:opacity-100 disabled:opacity-50 disabled:hover:bg-green"
              >Prev
              </button>
              <div className='text-lg font-cambria'>{page}</div>
              <button
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
                disabled={!moreAvailable}
                className="p-2 place-self-center bg-green opacity-80 rounded-md text-white flex items-center gap-2 hover:bg-green hover:opacity-100 disabled:opacity-50 disabled:hover:bg-green"
              >Next
              </button>
            </div>}
        </div>
      </div>
    </Page>
  );

  function InfoBlock({ obj }) {
    let keys = Object.keys(obj);
    const exclude = ["id", "passwordHash", "password", "role", "city", "country", "name"]
    let render = keys.filter(keys => !exclude.includes(keys));
    const attributeType = {
      email: "Email",
      phoneNumber: "Phone Number",
    }
    return (
      <>
        {render.map(key => (
          <InfoItem key={key} type={attributeType[key]} value={obj[key]} />
        ))}
      </>
    )
  }

  function InfoItem({ type, value }) {
    if (type === "Slika")
      return null;
    return (
      <>
        {value && <div className='flex flex-wrap text-md'>
          <p className='font-semibold mr-2'>{type}:</p>
          <p className='text-balance break-all'>{value}</p>
        </div>}
      </>
    );
  }
}