import InsuranceForm from './LifeInsuranceForm';

const ManageUsers = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-800">👥 Manage Users</h1>
        <p className="text-gray-500 mt-1">
          View all registered users, assign roles (getCustomerCollection(), Agent, Admin), or disable accounts.
        </p>
      </header>

      {/* Future: Table/List of Users */}
      <div className="mb-8 border rounded-xl p-4 bg-gray-50">
        <p className="text-lg font-semibold text-blue-600 mb-2">🚧 User list and role management coming soon...</p>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Submit Insurance Application</h2>
        <InsuranceForm />
      </section>
    </div>
  );
};

export default ManageUsers;
