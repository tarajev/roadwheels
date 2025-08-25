import { useContext, useState } from "react";
import axios from "axios";
import AuthorizationContext from '../context/AuthorizationContext';
import { FormInput, Checkbox, FormButton, MultiFileUpload } from '../components/BasicComponents';

export default function VehicleEdit({ formRef, vehicle, onCancel }) {
  const { contextUser, APIUrl } = useContext(AuthorizationContext);
  const [formData, setFormData] = useState({ ...vehicle });
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);

    const hasVehicleChanged = JSON.stringify(vehicle) !== JSON.stringify(formData);
    const hasImagesChanged = selectedFiles.length > 0;

    try {
      // Update vozila
      if (hasVehicleChanged) {
        await axios.put(`${APIUrl}Vehicle/UpdateVehicle`, formData, {
          headers: {
            Authorization: `Bearer ${contextUser.jwtToken}`,
          },
        });
      }

      // Dodavanje slika ako postoje
      if (hasImagesChanged) {
        const formDataUpload = new FormData();
        selectedFiles.forEach(file => formDataUpload.append("files", file));

        await axios.post(
          `${APIUrl}Vehicle/UploadVehicleImages/${formData.id}/${formData.type}`,
          formDataUpload,
          {
            headers: {
              Authorization: `Bearer ${contextUser.jwtToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      window.location.reload();
    }
    catch (error) {
      console.error("Error updating vehicle:", error);
      alert("Failed to update vehicle.");
    }
    finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async () => {
    await axios
      .delete(`${APIUrl}Vehicle/DeleteVehicle`, {
        params: {
          type: vehicle.type,
          id: vehicle.id,
          country: vehicle.country,
          city: vehicle.city
        },
        headers: {
          Authorization: `Bearer ${contextUser.jwtToken}`
        }
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to delete vehicle.");
      });
  }

  return (
    <div className="overlay show font-cambria">
      <div className="sm:flex sm:items-center hidescrollbar sm:justify-center h-screen overflow-y-auto">
        <div
          ref={formRef}
          className="w-full max-w-sm p-6 bg-white mx-auto rounded-md shadow-2xl fade-in"
        >
          <div className="mb-4">
            <p className="justify-self-center text-xl text-green font-bold">
              Edit Vehicle
            </p>
            <div className="border border-accent" />
          </div>

          <FormInput
            text="Model"
            required
            value={formData.model || ""}
            onChange={(e) => handleChange("model", e.target.value)}
          />

          <FormInput
            text="Country"
            required
            value={formData.country || ""}
            onChange={(e) => handleChange("country", e.target.value)}
          />

          <FormInput
            text="City"
            value={formData.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
          />

          <FormInput
            text="Seats"
            type="number"
            value={formData.seats?.toString() ?? ""}
            onChange={(e) => handleChange("seats", parseInt(e.target.value, 10) || 0)}
          />

          <FormInput
            text="Price per Day (€)"
            type="number"
            value={formData.pricePerDay?.toString() || ""}
            onChange={(e) => handleChange("pricePerDay", parseFloat(e.target.value) || 0)}
          />

          <Checkbox
            checked={formData.needsRepair}
            onChange={(e) => handleChange("needsRepair", e.target.checked)}
          >
            Needs Repair
          </Checkbox>

          <FormInput
            text="Description"
            multiline
            rows={3}
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <MultiFileUpload
            className="w-full mt-4"
            width="100%"
            height="40px"
            text="Note: Uploading will add additional photos, not replace them."
            buttonText="Add Photos"
            setPictures={setSelectedFiles}
            limitInMegabytes={5}
          />

          <div className="flex justify-between">
            <div>
              <FormButton
                text="Delete"
                className="bg-red-500 hover:bg-red-700"
                onClick={deleteVehicle}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <FormButton
                text="Cancel"
                className="bg-gray-400"
                onClick={onCancel}
              />
              <FormButton
                text="Update"
                className="bg-green hover:opacity-80 hover:bg-green"
                loading={loading}
                onClick={handleUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
