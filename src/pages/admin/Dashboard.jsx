import ApplicationManager from './ApplicationTable';
import InsuranceAgentDashboard from './InsuranceAgentDashboard';
import AdminDashboard from './AdminDashboard';
import CustomerTable from '../CustomerTable';
import PaymentsTable from './PaymentsTableManagment';
import AdminPaymentsTable from './AdminPaymentsTable';
import BlogContactManager from "./adminContact";
const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the admin dashboard. Here you can manage users, policies, blog posts, and monitor transactions.
        </p>
      </div>

      {/* Application Management */}
         <section className="mb-10">
        <CustomerTable />
       </section>
      <section className="mb-10">
        <h2 className="text-xl font-medium mb-2">Payments Management</h2>
        <PaymentsTable />
        </section>

      <section className="mb-5">
        <ApplicationManager />
      </section>

      <section className="mb-5">
        <AdminPaymentsTable />
      </section>

      {/* Agent Overview */}
      <section className="mb-10">
        <h2 className="text-xl font-medium mb-2">Agent Overview</h2>
        <InsuranceAgentDashboard />
      </section>

      {/* Contact Overview */}
      <section className="mb-10">
        <h2 className="text-xl font-medium mb-2">Contact Overview</h2>
        <BlogContactManager/>
      </section>

      {/* Admin Metrics */}
      <section>
        <h2 className="text-xl font-medium mb-2">Admin Stats</h2>
        <AdminDashboard />
      </section>
    </div>
  );
};

export default Dashboard;
