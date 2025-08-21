import { useState, useContext } from "react";
import { Input, Link } from './BasicComponents';
import { DrawLogin, DrawRegistration } from "../views/LoginRegistration";
import iconBurger from "../resources/img/burger-menu.png"
import searchIcon from "../resources/img/icon-search.png"
import BurgerMenu from "./BurgerMenu";
import iconWriteArticle from '../resources/img/icon-writeArticle.png'
import AuthorizationContext from "../context/AuthorizationContext";
import '../assets/colors.css';
import '../assets/App.css';

export default function Header({ overlayActive, overlayHandler }) {
  const { contextUser } = useContext(AuthorizationContext);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  const toggleRegistration = () => {
    setShowRegistration(!showRegistration);
  };

  const exitRegistration = () => {
    setShowRegistration(false);
  }

  const handleLoginClick = () => {
    setShowLogin(!showLogin);
    if (overlayHandler != null)
      overlayHandler(!showLogin);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }

  const burgerMenuItems = [];
  if (contextUser.$type === "Author") burgerMenuItems.push({ route: `/createArticle`, name: "Write Article" });
  if (contextUser.$type === "Author") burgerMenuItems.push({ route: `/author/`, param: contextUser.id, name: "Profile" });
  if (contextUser.role === "Guest") burgerMenuItems.push({ route: `/`, onClick: handleLoginClick, name: "Login" });
  if (contextUser.role !== "Guest") burgerMenuItems.push({ route: '/', onClick: handleLogout, name: "Log out" });

  return (
    <>
      <div className={`pt-16 sticky top-0 z-50`}>
        {showLogin && <div className="overlay" onClick={handleLoginClick}></div>}
        {showLogin && <DrawLoginForm showRegistration={showRegistration} exitRegistration={exitRegistration} toggleRegistration={toggleRegistration} handleLoginClick={handleLoginClick} />}
        <nav className="absolute shadow-xl top-0 left-0 w-full border-b bg-[#F7F5E8] md:flex-row md:flex-nowrap md:justify-start flex items-center p-8">
          <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-2">
            <div className="relative flex hidden lg:block pr-4"> {/*Search postaje deo BurgerMenu za manje ekrane */}
            </div>
            <Link route="/" className="!no-underline absolute block font-cambria sm:text-3xl ml-12 font-semibold !text-orange justify-self-start">
              RoadWheels
            </Link>
            <span className="block lg:hidden ml-auto">
              <BurgerMenu preventTab={overlayActive} icon={iconBurger} listItemArray={burgerMenuItems} size={5} />
            </span>
            <span className="hidden lg:flex items-center mr-1 py-1 max-w-405">
              {contextUser.role == 1 ? //može da se doda [BsonRepresentation(BsonType.String)] i da se čuva kao string
                <div className="flex gap-2">
                  <Link className="!text-gray-400" route="profile/" param={contextUser.id}>
                    Profile
                  </Link>
                  <p className="text-gray-400">|</p>
                </div>
                : <></>
              }
              {contextUser.role == 2 ?
                <div className="flex gap-2">
                  <Link route="/employeePanel" className="!text-gray-400">
                    <div className="flex gap-2">
                      <p>Employee Panel</p>
                    </div>
                  </Link>
                  <p className="text-gray-400">|</p>
                </div>
                : <></>
              }
              {contextUser.role == 0 ?
                <Link className='mx-2 !text-gray-400' preventTab={overlayActive} onClick={handleLoginClick}>
                  Log in
                </Link>
                :
                <Link className='mx-2 !text-gray-400' preventTab={overlayActive} onClick={handleLogout}>
                  Log out
                </Link>
              }
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}

function DrawLoginForm({ showRegistration, exitRegistration, toggleRegistration, handleLoginClick }) {
  return (
    <>
      {showRegistration ? (
        <DrawRegistration onLoginClick={toggleRegistration} exitRegistration={exitRegistration} handleLoginClick={handleLoginClick} />
      ) : (
        <DrawLogin onRegisterClick={toggleRegistration} handleLoginClick={handleLoginClick} />
      )}
    </>
  );
}
