import { useState, useContext } from 'react'
import AuthorizationContext from '../context/AuthorizationContext'
import axios from 'axios';
import { Page } from '../components/BasicComponents';
import '../assets/colors.css'
import '../assets/animations.css'

export default function DrawMainPage() {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const [overlayActive, setOverlayActive] = useState(false); // Potrebno za prevenciju background-tabovanja kada je forma aktivna

  return (
    <Page overlayActive={overlayActive} loading={true} overlayHandler={setOverlayActive}>
      <div className='p-4'>
        
      </div>
    </Page>
  );
}