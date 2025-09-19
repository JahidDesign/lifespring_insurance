// File: src/routes/AppRoutes.jsx
import React, { useContext, Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

// ---------------- Lazy load pages ----------------
const Home = lazy(() => import("../pages/Home.jsx"));
const About = lazy(() => import("../pages/About.jsx"));
const Blog = lazy(() => import("../pages/Blog.jsx"));
const AllPolicies = lazy(() => import("../pages/AllPolicies.jsx"));
const ContactPage = lazy(() => import("../pages/Contact.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));
const VisitorDetailsPage = lazy(() => import("../pages/VisitorDetailsPage.jsx"));
const InsuranceDetails = lazy(() => import("../pages/InsuranceDetails.jsx"));
const MyBookQuote = lazy(() => import("../pages/MyBookQuote.jsx"));
const BlogDetail = lazy(() => import("../pages/BlogDetail.jsx"));

// ---------------- Admin Pages ----------------
const AdminLayout = lazy(() => import("../components/admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard.jsx"));
const ManagePolicies = lazy(() => import("../pages/admin/ManagePolicies.jsx"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers.jsx"));
const ManageBlog = lazy(() => import("../pages/admin/ManageBlog.jsx"));
const Transactions = lazy(() => import("../pages/admin/Transactions.jsx"));
const ManagementTable = lazy(() => import("../pages/admin/ManagementTable.jsx"));
const AddBlogForm = lazy(() => import("../pages/admin/AddBlogForm.jsx"));
const ManageBlogTable = lazy(() => import("../pages/admin/ManageBlogTable.jsx"));
const InsuranceServiceSection = lazy(() => import("../pages/admin/InsuranceServiceSection.jsx"));
const InsuranceForm = lazy(() => import("../pages/admin/LifeInsuranceForm.jsx")); // ✅ Fixed typo
const QuoteLifeInsuranceForm = lazy(() => import("../pages/QuoteLifeInsuranceFrom.jsx"));
const CarouselSliderForm = lazy(() => import("../pages/InsuranceFormCaro.jsx"));
const HeroCarouselForm = lazy(() => import("../pages/HeroCarouselForm.jsx"));
const HeroCarouselManager = lazy(() => import("../pages/HeroCarouselManager.jsx"));
const InsuranceCarousel = lazy(() => import("../pages/InsuranceCarouselManager.jsx"));
const UserInsuranceTabs = lazy(() => import("../pages/UserInsuranceTabs.jsx"));
const ReviewsSectionForm = lazy(() => import("../pages/ReviewsSectionForm.jsx"));
const AdminReviewsTable = lazy(() => import("../pages/AdminReviewsTable.jsx"));
const VisitorNews = lazy(() => import("../pages/admin/VisitorNews.jsx"));
const ReviewsSection = lazy(() => import("../pages/admin/ReviewsSection.jsx"));
const AddVisitorForm = lazy(() => import("../pages/admin/AddVisitorNewsForm.jsx"));
const AddPolicyForm = lazy(() => import("../pages/admin/AddPolicyForm.jsx"));
const PolicyManagementTable = lazy(() => import("../pages/admin/PolicyTableEdit.jsx")); // ✅ Fixed typo
const ContactManager = lazy(() => import("../pages/admin/adminContact.jsx"));
const ContactTableManager = lazy(() => import("../pages/admin/ContactTableManager.jsx"));
const VisitorNewsTable = lazy(() => import("../pages/admin/VisitorNewsTable.jsx"));
const Messages = lazy(() => import("../pages/admin/Messages.jsx"));
const OurInsurancePolicy = lazy(() => import("../pages/OurInsurancePolicy.jsx")); // ✅ Fixed typo
const InsuranceDashboardManager = lazy(() => import("../pages/InsuranceDashboard.jsx"));

// ---------------- Agent Pages ----------------
const AgentDashboard = lazy(() => import("../components/agents/AgentDashboard.jsx"));

// ---------------- PrivateRoute Component ----------------
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, role, isAdmin } = useContext(AuthContext);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  // Super admin override
  if (isAdmin) return children;

  // Role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ---------------- Management Layout ----------------
const ManagementLayout = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Management Section</h1>
    <Outlet />
  </div>
);

// ---------------- App Routes ----------------
const AppRoutes = () => (
  <Suspense fallback={<p className="text-center mt-20">Loading...</p>}>
    <Routes>
      {/* ---------------- Public Routes ---------------- */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route
        path="/all-policies"
        element={
          <PrivateRoute>
            <AllPolicies />
          </PrivateRoute>
        }
      />
      <Route
        path="/mybook-quote"
        element={
          <PrivateRoute>
            <MyBookQuote />
          </PrivateRoute>
        }
      />
      <Route
        path="/quote-insurance"
        element={
          <PrivateRoute>
            <QuoteLifeInsuranceForm />
          </PrivateRoute>
        }
      />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/visitor/:id" element={<VisitorDetailsPage />} />
      <Route path="/insurance/:id" element={<InsuranceDetails />} />
      <Route path="/blog/:blogId" element={<BlogDetail />} />
      <Route path="/*" element={<NotFound />} />

      {/* ---------------- User Dashboard ---------------- */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* ---------------- Agent Dashboard ---------------- */}
      <Route
        path="/agent/*"
        element={
          <PrivateRoute allowedRoles={["agent"]}>
            <AgentDashboard />
          </PrivateRoute>
        }
      />

      {/* ---------------- Management Section ---------------- */}
      <Route
        path="/management/*"
        element={
          <PrivateRoute allowedRoles={["admin", "agent"]}>
            <ManagementLayout />
          </PrivateRoute>
        }
      >
        <Route path="all-policies" element={<AllPolicies />} />
      </Route>

      {/* ---------------- Admin Panel ---------------- */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />

        {/* Policies */}
        <Route path="manage-policies" element={<ManagePolicies />} />
        <Route path="manage-policies/:mode/:id?" element={<CarouselSliderForm />} />
        <Route path="policies/:mode/:id?" element={<AddPolicyForm />} />

        {/* Insurance */}
        <Route path="insurance-policies/:mode/:id?" element={<InsuranceServiceSection />} />
        <Route path="all-policies/edit" element={<InsuranceDashboardManager />} />
        <Route path="all-policies/add" element={<OurInsurancePolicy />} />

        {/* Users */}
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="manage-users/:mode/:id?" element={<InsuranceForm />} />
        <Route path="manage-users/edit/" element={<UserInsuranceTabs />} />

        {/* Transactions & Applications */}
        <Route path="transactions" element={<Transactions />} />
        <Route path="manage-applications" element={<ManagementTable />} />

        {/* Blog */}
        <Route path="manage-blog" element={<ManageBlog />} />
        <Route path="manage-blog/:mode/:id?" element={<AddBlogForm />} />
        <Route path="manage-blog/edit/:id" element={<ManageBlogTable />} />

        {/* Messages */}
        <Route path="messages-section" element={<Messages />} />
        <Route path="messages-section/:mode/:id?" element={<ContactManager />} />
        <Route path="messages-section/edit/:id" element={<ContactTableManager />} />

        {/* Visitor News */}
        <Route path="visitor-news" element={<VisitorNews />} />
        <Route path="visitor-news/:mode/:id?" element={<AddVisitorForm />} />
        <Route path="visitor-news/edit/:id" element={<VisitorNewsTable />} />

        {/* Reviews Section */}
        <Route path="reviews-section" element={<ReviewsSection />} />
        <Route path="reviews-section/:mode/:id?" element={<ReviewsSectionForm />} />
        <Route path="reviews-section/edit/:id" element={<AdminReviewsTable />} />

        {/* Hero Section */}
        <Route path="hero-section" element={<HeroCarouselManager />} />
        <Route path="hero-section/:mode/:id?" element={<HeroCarouselForm />} />
        <Route path="hero-section/edit/:id" element={<HeroCarouselManager />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
