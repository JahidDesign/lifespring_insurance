// File: InsuranceForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  CalendarIcon,
  DocumentIcon,
  HomeIcon,
  BuildingOfficeIcon,
  TruckIcon, // <-- replaced CarIcon
  ClipboardDocumentListIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

export default function InsuranceForm() {
  const { register, handleSubmit, watch, reset } = useForm();
  const insuranceType = watch("insuranceType");
  const [step, setStep] = useState(1); // Step 1 = Fill, Step 2 = Preview
  const [formData, setFormData] = useState(null);

  const onSubmit = (data) => {
    setFormData({ ...data, status: "Pending" });
    setStep(2);
  };

  const confirmSubmit = async () => {
    try {
      await axios.post("https://insurances-lmy8.onrender.com/management", formData);

      Swal.fire({
        icon: "success",
        title: "✅ Application Submitted",
        text: "Your insurance application has been submitted successfully!",
        confirmButtonColor: "#3085d6",
      });

      reset();
      setFormData(null);
      setStep(1);
    } catch (error) {
      console.error("Error submitting:", error);
      Swal.fire({
        icon: "error",
        title: "❌ Submission Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white text-black rounded-2xl shadow-2xl mt-10">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <ClipboardDocumentListIcon className="w-10 h-10 text-blue-600" />
        Insurance Application Form
      </h1>

      {/* Step 1 - Fill Form */}
      {step === 1 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Personal Info */}
          <Section title="1. Personal Information" icon={<UserIcon className="w-6 h-6 text-blue-600" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input icon={<UserIcon />} placeholder="Full Name" {...register("name", { required: true })} />
              <Input type="date" icon={<CalendarIcon />} {...register("dob", { required: true })} />
              <Input icon={<IdentificationIcon />} placeholder="National ID Number" {...register("nid", { required: true })} />
              <Input icon={<PhoneIcon />} placeholder="Phone Number" {...register("phone", { required: true })} />
              <Input type="email" icon={<EnvelopeIcon />} placeholder="Email Address" {...register("email")} />
              <Input icon={<DocumentIcon />} placeholder="Profile Image URL" {...register("image")} />
            </div>
          </Section>

          {/* Section 2: Insurance Details */}
          <Section title="2. Insurance Details" icon={<ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select {...register("insuranceType", { required: true })}>
                <option value="">Select Insurance Type</option>
                <option value="life">Life</option>
                <option value="health">Health</option>
                <option value="vehicle">Vehicle</option>
                <option value="property">Property</option>
              </Select>
              <Input type="number" placeholder="Coverage Amount (USD)" {...register("coverage", { required: true })} />
              <Select {...register("paymentTerm")}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Select>
            </div>
          </Section>

          {/* Section 3: Nominee Info */}
          <Section title="3. Nominee Information" icon={<UserIcon className="w-6 h-6 text-blue-600" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Nominee Full Name" {...register("nomineeName", { required: true })} />
              <Input placeholder="Relation with Nominee" {...register("nomineeRelation")} />
              <Input placeholder="Nominee NID Number" {...register("nomineeNid")} />
            </div>
          </Section>

          {/* Section 4: Health */}
          {(insuranceType === "life" || insuranceType === "health") && (
            <Section title="4. Health Declaration" icon={<HeartIcon className="w-6 h-6 text-red-500" />}>
              <label className="block font-medium mb-2">Do you have any pre-existing condition?</label>
              <Select {...register("healthCondition")} className="mb-4">
                <option>No</option>
                <option>Yes</option>
              </Select>
              <TextArea placeholder="If yes, describe your condition..." {...register("healthDetails")} />
            </Section>
          )}

          {/* Section 5: Vehicle */}
          {insuranceType === "vehicle" && (
            <Section title="5. Vehicle Details" icon={<TruckIcon className="w-6 h-6 text-gray-700" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Vehicle Type (Car/Bike)" {...register("vehicleType")} />
                <Input placeholder="Registration Number" {...register("vehicleReg")} />
                <Input placeholder="Engine Number" {...register("engineNumber")} />
                <Input placeholder="Chassis Number" {...register("chassisNumber")} />
                <Input type="number" placeholder="Estimated Value (USD)" {...register("vehicleValue")} />
              </div>
            </Section>
          )}

          {/* Section 6: Property */}
          {insuranceType === "property" && (
            <Section title="6. Property Details" icon={<HomeIcon className="w-6 h-6 text-green-600" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Property Type (House/Land)" {...register("propertyType")} />
                <Input placeholder="Location" {...register("propertyLocation")} />
                <Input placeholder="Deed Number" {...register("deedNumber")} />
                <Input type="number" placeholder="Estimated Value (USD)" {...register("propertyValue")} />
              </div>
            </Section>
          )}

          {/* Section 7: Optional URLs */}
          <Section title="7. Document URLs (Optional)" icon={<DocumentIcon className="w-6 h-6 text-gray-600" />}>
            <Input placeholder="National ID Document URL" {...register("nidDocumentUrl")} />
            <Input placeholder="Additional Document URLs (comma-separated)" {...register("additionalDocsUrl")} className="mt-2" />
          </Section>

          {/* Next Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md"
            >
              Next: Preview
            </button>
          </div>
        </form>
      )}

      {/* Step 2 - Preview */}
      {step === 2 && formData && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Preview Your Application</h2>
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner space-y-3">
            {Object.entries(formData).map(([key, value]) => (
              <p key={key}>
                <strong className="capitalize">{key}:</strong> {value || "—"}
              </p>
            ))}
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-lg bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={confirmSubmit}
              className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Reusable Components ---------- */
const Section = ({ title, icon, children }) => (
  <div className="border-b pb-6">
    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h2>
    {children}
  </div>
);

const Input = React.forwardRef(({ className = "", icon, ...props }, ref) => (
  <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
    {icon && <span className="pl-2 text-gray-500 w-8">{icon}</span>}
    <input
      ref={ref}
      {...props}
      className={`flex-1 px-3 py-2 bg-white text-black rounded-md focus:outline-none ${className}`}
    />
  </div>
));

const Select = React.forwardRef(({ className = "", ...props }, ref) => (
  <select
    ref={ref}
    {...props}
    className={`w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
));

const TextArea = React.forwardRef(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    {...props}
    className={`w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
));
