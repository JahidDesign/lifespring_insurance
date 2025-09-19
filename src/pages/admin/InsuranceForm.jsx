import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const InsuranceForm = () => {
  const [form, setForm] = useState({
    applicantName: '',
    email: '',
    address: '',
    nid: '',
    nomineeName: '',
    nomineeRelation: '',
    healthDisclosure: [],
  });

  const healthOptions = [
    'Diabetes',
    'High Blood Pressure',
    'Heart Disease',
    'Asthma',
    'Cancer',
    'None',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const updated = checked
        ? [...prev.healthDisclosure, value]
        : prev.healthDisclosure.filter((item) => item !== value);
      return { ...prev, healthDisclosure: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      applicantName: form.applicantName,
      email: form.email,
      address: form.address,
      nid: form.nid,
      nominee: {
        name: form.nomineeName,
        relationship: form.nomineeRelation,
      },
      healthDisclosure: form.healthDisclosure,
      status: 'Pending', // default status
      applicationDate: new Date().toISOString(),
    };

    try {
      await axios.post('https://insurances-lmy8.onrender.com/management', payload);
      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        text: 'Your insurance application is now pending.',
        confirmButtonColor: '#3085d6',
      });

      // Reset form
      setForm({
        applicantName: '',
        email: '',
        address: '',
        nid: '',
        nomineeName: '',
        nomineeRelation: '',
        healthDisclosure: [],
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Something went wrong. Please try again later.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-black max-w-3xl mx-auto p-8 rounded-2xl shadow-md border border-gray-200"
    >
      <h2 className="text-3xl font-bold mb-6">📝 Insurance Application Form</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="applicantName"
          value={form.applicantName}
          onChange={handleChange}
          placeholder="Full Name"
          className="input-style"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="input-style"
          required
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Full Address"
          className="input-style"
          required
        />
        <input
          name="nid"
          value={form.nid}
          onChange={handleChange}
          placeholder="NID Number"
          className="input-style"
          required
        />
      </div>

      <h3 className="text-xl font-semibold mb-4">👥 Nominee Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="nomineeName"
          value={form.nomineeName}
          onChange={handleChange}
          placeholder="Nominee Name"
          className="input-style"
          required
        />
        <input
          name="nomineeRelation"
          value={form.nomineeRelation}
          onChange={handleChange}
          placeholder="Relationship to Nominee"
          className="input-style"
          required
        />
      </div>

      <h3 className="text-xl font-semibold mb-4">🩺 Health Disclosure</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
        {healthOptions.map((opt) => (
          <label key={opt} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={opt}
              checked={form.healthDisclosure.includes(opt)}
              onChange={handleCheckbox}
              className="accent-blue-600"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition duration-300"
      >
        🚀 Submit Application
      </button>
    </form>
  );
};

export default InsuranceForm;
