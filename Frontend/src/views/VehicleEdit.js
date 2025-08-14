import { useContext, useState } from "react";
import axios from "axios";
import AuthorizationContext from '../context/AuthorizationContext';
import { FormInput, Checkbox, FormButton } from '../components/BasicComponents';

export default function VehicleEdit({ formRef, vehicle, onCancel }) {
  const { contextUser, APIUrl } = useContext(AuthorizationContext);
  const [formData, setFormData] = useState({ ...vehicle });
  const [loading, setLoading] = useState(false);

  // TODO: Iz nekog razloga, edit deskripcije ne radi kako treba.

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);

    const changedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== vehicle[key]) {
        changedFields[key] = formData[key];
      }
    });

    const payload = { ...vehicle, ...changedFields };

    axios
      .put(`${APIUrl}Vehicle/UpdateVehicle`, payload)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating vehicle:", error);
      });

    setLoading(false);
  };

  const deleteVehicle = async () => {
    axios
      .delete(`${APIUrl}Vehicle/DeleteVehicle`, {
        params: {
          type: vehicle.type,
          id: vehicle.id,
          country: vehicle.country,
          city: vehicle.city
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
            value={formData.needsRepair}
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
