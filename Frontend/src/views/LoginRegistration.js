import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, Exit, FormInput, Password, FormButton, Checkbox } from '../components/BasicComponents';
import userIcon from "../resources/img/icon-user2.png"
import authorIcon from "../resources/img/icon-author.png"
import '../assets/colors.css';
import '../assets/animations.css';
import '../assets/App.css'
import axios from 'axios';
import AuthorizationContext from '../context/AuthorizationContext';
import IconButtonCard from '../components/IconButtonCard';

export function DrawRegistration({ onLoginClick, exitRegistration, handleLoginClick }) {
  const { APIUrl } = useContext(AuthorizationContext);
  const formRef = useRef(null); // Za click van forme
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [invalidEmail, setInvalidEmail] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setIsEmailValid(validateEmail(email));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setInvalidEmail(false);
    if (emailTouched)
      setIsEmailValid(validateEmail(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  const disableSubmit = () => {
    if (!email || !password || !phoneNumber || !confirmPassword || !isEmailValid || !passwordMatch) {
      return true;
    }
    return false;
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    const phoneRegex = /^\+?[0-9]{6,15}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
  };


  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await axios.post(APIUrl + "User/CreateUser", {
      email: email,
      password: password,
      name: fullName,
      phoneNumber: phoneNumber
    })
      .then(() => {
        exitRegistration();
      }
      )
      .catch(err => {
        console.log(err);
        setInvalidEmail(true);
      }); //ovde ako dodje do greške da se ispiše da se pokuša ponovo ili tako nesto
    setIsLoading(false);
  }

  const exitRegistrationForm = () => {
    handleLoginClick();
    exitRegistration();
  }

  useEffect(() => { // Za click van forme
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target))
        exitRegistrationForm();
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleLoginClick]);

  return (
    <div className="overlay show">
      <div className="sm:flex sm:items-center hidescrollbar sm:justify-center h-screen overflow-y-auto">
        <div ref={formRef} className='w-full max-w-sm p-6 bg-white mx-auto rounded-md shadow-2xl fade-in'>
          <Exit
            blue
            className="ml-auto text-sm w-4"
            onClick={exitRegistrationForm}
          />
          <div className="flex items-center justify-center">
            <h1 className="block font-cambria sm:text-3xl font-semibold text-orange justify-self-center self-center mx-auto">RoadWheels</h1>
          </div>
          <form className="mt-4" onSubmit={handleRegisterSubmit}>
            <FormInput
              text="Full Name"
              required
              value={fullName}
              onChange={handleFullNameChange}
            />
            <FormInput
              text="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              required
              alertCond={!!phoneError}
              alertText={phoneError}
            />
            <FormInput
              text="Email"
              type="email"
              required
              value={email}
              onBlur={handleEmailBlur}
              onChange={handleEmailChange}
              alertCond={(!isEmailValid && emailTouched) || invalidEmail}
              alertText={invalidEmail ? "E-Mail is already in use!" : "Invalid E-Mail format!"}
            />
            <Password
              text="Password"
              required
              visibility
              value={password}
              onChange={handlePasswordChange}
              className={"!text-black"}
            />
            <Password
              text="Confirm Password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handlePasswordBlur}
              alertCond={!passwordMatch && passwordTouched}
              alertText="Passwords do not match!"
              className={"!text-black"}
            />
            <FormButton
              loading={isLoading}
              text="Register"
              disabled={disableSubmit()}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="block text-sm text-gray-400">
                <span className="text-sm text-red-600">*</span>
                Mandatory fields.
              </span>
              <span className="text-sm text-gray-400">
                Own an account?
                <Link href="#" className="text-sm ml-1" onClick={onLoginClick}>
                  Log in.
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function DrawLogin({ onRegisterClick, handleLoginClick }) {
  const { APIUrl, contextUser, contextSetUser } = useContext(AuthorizationContext);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);
  const [forgottenInfo, setForgottenInfo] = useState(false);
  const [forgottenInfoSent, setForgottenInfoSent] = useState(false);
  const [forgottenInfoError, setForgottenInfoError] = useState(null);

  const formRef = useRef(null); // Za click van forme
  const isFormValid = email.trim() !== '' && password.trim() !== '';

  useEffect(() => {
    setTimeout(() => {
      setForgottenInfoError(null);
      setForgottenInfoSent(false);
    }, 3000);
  }, [forgottenInfoSent, forgottenInfoError])

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailTouched)
      setIsEmailValid(validateEmail(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setIsEmailValid(validateEmail(email));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    await axios.post(APIUrl + "Auth/Login", {
      email: email,
      password: password,
    })
      .then(response => {
        let now = new Date();
        localStorage.setItem('RoadWheelsUser', JSON.stringify(response.data));
        localStorage.setItem('RoadWheelsExpiryDate', now);

        handleLoginClick();
      })
      .catch(error => {
        console.log(error);
        setLoginError("Pogrešan E-Mail ili šifra!");
      })
    setIsLoading(false);
  }

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;
    return emailRegex.test(email);
  };

  useEffect(() => { // Za click van forme
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target))
        handleLoginClick();
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleLoginClick]);

  useEffect(() => {
    if (forgottenInfo) {
      forgottenLoginCredentials(email);
    }
    setForgottenInfo(false);
  }, [forgottenInfo]);

  const forgottenLoginCredentials = async (email) => {
    // TOOD
  }

  return (
    <div className="overlay show">
      <div className="flex items-center justify-center h-screen">
        <div ref={formRef} className='w-full max-w-sm p-6 bg-white rounded-md shadow-2xl fade-in'>
          <Exit
            blue
            className="ml-auto text-sm w-5"
            onClick={handleLoginClick}
          />

          <div className="flex items-center justify-center">
            <h1 className="block font-cambria sm:text-3xl font-semibold text-orange justify-self-center self-center mx-auto">RoadWheels</h1>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-4">
            <FormInput
              text="Email"
              type="email"
              value={email}
              alertCond={!isEmailValid}
              alertText="Invalid E-Mail format!"
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            />

            <Password
              text="Password"
              visibility
              value={password}
              onChange={handlePasswordChange}
              className={""}
            />

            <FormButton
              text="Log In"
              loading={isLoading}
              disabled={!isFormValid}
            />

            <div className="flex justify-end mt-3">
              <span className="block text-sm text-gray-400">
                Don't have an account?
              </span>
              <Link href="#" className="text-sm ml-1" onClick={onRegisterClick}>
                Sign up now!
              </Link>
            </div>
            <div className="flex justify-center mt-3 color-primary">
              {loginError.length > 0 && <span className="text-red-500"> {loginError} </span>}
              {forgottenInfoSent && !forgottenInfoError && <span className='color-primary'>Uspešno poslata šifra na mail-u!</span>}
              {forgottenInfoError && <span className='text-red-500'>{forgottenInfoError !== 400 ? "Unesite mail u odgovarajućem polju." : "Korisnik nije pronadjen."}</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}