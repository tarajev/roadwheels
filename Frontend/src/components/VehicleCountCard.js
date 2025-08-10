export default function VehicleCountCard({ setSelectedFunc, setSelectedType, selectedCard, logo, text, number, preventTab }) {
  return ( // mora <a> da bi moglo da se fokusira sa TAB-om
    <a
      href="#"
      tabIndex={preventTab ? -1 : 0}
      onClick={() => setSelectedFunc(setSelectedType)}
      className={`cursor-pointer outline-green col-span-4 sm:col-span-2 lg:col-span-1 bg-gradient-to-r from-accent to-orange border-y border-orange rounded-md animated-shadow ${selectedCard === setSelectedType ? "card-selected" : ""}`}
    >
      <div className="flex items-center px-5 py-6">
        <div className="p-3 bg-green rounded-full">
          <img
            src={logo}
            className='h-8 w-8'
            style={{ filter: "invert(100%) sepia(93%) saturate(26%) hue-rotate(93deg) brightness(108%) contrast(106%)" }}
          />
        </div>

        <div className="mx-5">
          <h4 className="text-2xl font-semibold text-white">
            {number}
          </h4>
          <div className="text-gray-100">
            {text}
          </div>
        </div>
      </div>
    </a>
  );
}