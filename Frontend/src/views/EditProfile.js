import React, { useState, useEffect, useRef } from 'react'
import { useContext } from 'react';
import { Button, FormInput, FileUpload, Password, Checkbox } from '../components/BasicComponents';
import '../assets/colors.css'
import '../assets/animations.css'
import AuthorizationContext from '../context/AuthorizationContext';
import axios from 'axios';

export default function DrawEditProfile({ handleExitClick, user, updateProfileInformation }) {
  const { APIUrl, contextUser } = useContext(AuthorizationContext);
  const [name, setName] = useState(user.name);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [infoEdited, setInfoEdited] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [phoneError, setPhoneError] = useState(false);

  const formRef = useRef(null); // Za click van forme

  const updateProfile = async () => {
    const updatedUser = {
      id: contextUser.id,
      phoneNumber: phoneNumber,
      oldPassword: oldPassword,
      newPassword: newPassword,
      name: name
    }
    const route = `User/UpdateUser`;
    try {
      const response = await axios.put(
        APIUrl + route,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${contextUser.jwtToken}`,
          },
        }
      );

      updateProfileInformation(response.data);
      handleExitClick();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data || "Unexpected error";
      alert("There was an error updating your profile, please try again.");
    }
  };

  useEffect(() => {
    if (name !== user.name ||
      phoneNumber !== user.phoneNumber ||
      newPassword !== "")
      setInfoEdited(false);
    else
      setInfoEdited(true);
  }, [name, phoneNumber, newPassword])

  useEffect(() => { // Za click van forme
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target))
        handleExitClick();
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNewPassword = () => {
    setChangePassword(!changePassword);
    setNewPassword("");
  }
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

  return (
    <div className="left-0 top-0 overlay show">
      <div className="flex items-center hidescrollbar overscroll-contain justify-center h-screen overflow-y-auto">
        <div ref={formRef} className='w-fit bg-white max-w-2xl p-6  border-y-4 border-accent rounded-lg shadow-2xl shadow-blue-500/40 fade-in fade-in'>
          <p className='text-lg pb-1 mb-2 flex justify-center border-b border-accent'>Update your information</p>
          <FormInput
            text="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setNameError(name.length < 7 || !/\s/.test(name))}
            alertCond={nameError}
            alertText={"Full name must include both first and last name."}
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
          <div className="flex flex-row">
            <Checkbox value={changePassword} onChange={toggleNewPassword} preventTab={false} />
            <p>Change password</p>
          </div>
          <Password visibility required text="Current password:" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          {changePassword && <Password visibility optional text="New password:" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />}
          {errorMessage && <p className='px-2 mr-1 py-1 text-red-600'>{errorMessage}</p>}
          <div className='flex justify-end mt-4'>
            <Button className="px-2 mr-1 py-1 rounded-md text-lg" disabled={infoEdited || oldPassword === '' || (newPassword > 0 && newPassword < 4)} onClick={updateProfile}>Confirm changes</Button>
            <Button className="px-2 ml-1 py-1 rounded-md text-lg" onClick={handleExitClick}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 