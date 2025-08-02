import { useDebounce } from 'use-debounce';
import { LinearProgress } from '@mui/material';
import '../assets/colors.css';
import '../assets/animations.css';

export default function DrawLoadingScreen({ loading }) {
  const [hideComponent] = useDebounce(loading, 100); // Animacija fade-out-loading traje .1s -> 100ms. Koristi se za "sakrivanje" LoadingScreen-a

  return (
    <div
      style={{ zIndex: 999 }}
      className={`flex ${!loading && !hideComponent ? "hidden" : ""} ${loading ? "" : "fade-out-loading"} font-cambria fixed bg-[#f2f1e6] items-center justify-center h-screen w-screen`}
    >
      <div className="w-full p-8">
        <div className='flex justify-center'>
        <div className=" font-playfair md:text-4xl font-semibold text-[#07090D] mx-auto">RoadWheels</div>
        </div>
        <LinearProgress className="rounded-xl" color="inherit" />
      </div>
    </div>
  );
}
