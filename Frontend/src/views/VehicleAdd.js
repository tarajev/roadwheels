import { useContext, useState } from "react";
import axios from "axios";
import AuthorizationContext from '../context/AuthorizationContext';
import { FormInput, FormButton, Dropdown, MultiFileUpload } from '../components/BasicComponents';

export default function VehicleAdd({ onCancel }) {
  const { APIUrl, contextUser } = useContext(AuthorizationContext);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: 0,
    transmission: "",
    fuelConsumption: null,
    seats: 0,
    description: "",
    imageUrls: [],
    country: "",
    city: "",
    pricePerDay: 0,
    location: null,
    type: null,
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form");
  const [createdVehicle, setCreatedVehicle] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isValid = () => {
    return (
      formData.brand.trim() !== "" &&
      formData.model.trim() !== "" &&
      formData.country.trim() !== "" &&
      formData.pricePerDay > 0 &&
      formData.seats > 0 &&
      formData.type !== null
    );
  };

  const handleAdd = async () => {
    if (!isValid()) return;

    // Upload slika step
    if (selectedFiles.length === 0) {
      setStep("images");
      return;
    }

    setLoading(true);
    const { type, ...dataWithoutType } = formData;

    try {
      // Dodavanje vozila
      const response = await axios.post(
        `${APIUrl}Vehicle/CreateVehicle/${formData.type}`,
        dataWithoutType,
        { headers: { Authorization: `Bearer ${contextUser.jwtToken}` } }
      );

      const created = response.data;
      setCreatedVehicle(created);

      // Upload slika
      const formDataUpload = new FormData();
      selectedFiles.forEach(file => formDataUpload.append("files", file));

      await axios.post(
        `${APIUrl}Vehicle/UploadVehicleImages/${created.id}/${formData.type}`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${contextUser.jwtToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      window.location.reload();
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay show font-cambria">
      <div className="sm:flex sm:items-center hidescrollbar sm:justify-center h-screen overflow-y-auto">
        <div className="w-full max-w-2xl p-6 bg-white mx-auto rounded-md shadow-2xl fade-in">
          {step === "form" ? (
            <>
              <div className="mb-4">
                <p className="justify-self-center text-xl text-green font-bold">
                  Add Vehicle
                </p>
                <div className="border border-accent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <FormInput
                    text="Brand"
                    required
                    value={formData.brand}
                    onChange={(e) => handleChange("brand", e.target.value)}
                  />

                  <FormInput
                    text="Model"
                    required
                    value={formData.model}
                    onChange={(e) => handleChange("model", e.target.value)}
                  />

                  <FormInput
                    text="Year"
                    type="number"
                    value={formData.year || ""}
                    onChange={(e) => handleChange("year", parseInt(e.target.value, 10) || 0)}
                  />

                  <FormInput
                    text="Seats"
                    required
                    type="number"
                    value={formData.seats || ""}
                    onChange={(e) => handleChange("seats", parseInt(e.target.value, 10) || 0)}
                  />

                  <FormInput
                    text="Fuel Consumption / 100km"
                    type="number"
                    value={formData.fuelConsumption ?? ""}
                    onChange={(e) => handleChange("fuelConsumption", e.target.value === "" ? null : parseFloat(e.target.value))}
                  />

                  <FormInput
                    text="Price per Day (€)"
                    required
                    type="number"
                    value={formData.pricePerDay || ""}
                    onChange={(e) => handleChange("pricePerDay", parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <Dropdown
                    label="Type"
                    required
                    options={["Car", "Camper", "TouringMotorcycle", "TouringBike"]}
                    value={formData.type}
                    onChange={(val) => handleChange("type", val)}
                  />

                  <Dropdown
                    label="Transmission"
                    required
                    options={["Manual", "Automatic"]}
                    value={formData.transmission}
                    onChange={(val) => handleChange("transmission", val)}
                  />

                  <FormInput
                    text="Country"
                    required
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />

                  <FormInput
                    text="City"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />

                  <FormInput
                    text="Description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <FormButton
                  text="Cancel"
                  onClick={onCancel}
                  className="bg-gray-400"
                />

                <FormButton
                  text="Add"
                  disabled={!isValid() || loading}
                  loading={loading}
                  onClick={handleAdd}
                  className="bg-green hover:opacity-90"
                />
              </div>
            </>
          ) : (
            <div className="fade-in">
              <div className="mb-4 text-center">
                <p className="text-xl text-green font-bold">Upload Vehicle Images</p>
                <div className="border border-accent my-2" />
              </div>

              <MultiFileUpload
                text="Select vehicle images"
                buttonText="Select Images"
                setPictures={setSelectedFiles}
                className="flex justify-center"
                width="250px"
                height="50px"
              />

              <div className="flex gap-2 justify-end mt-4">
                <FormButton
                  text="Cancel"
                  onClick={onCancel}
                  className="bg-gray-400"
                />
                <FormButton
                  text="Confirm"
                  disabled={selectedFiles.length === 0 || loading}
                  loading={loading}
                  onClick={handleAdd}
                  className="bg-green hover:opacity-90"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
