// File: src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";

// ---------------- Public Pages ----------------
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
const BlogHomeDetail = lazy(() => import("../pages/BlogHomeDetail.jsx"));
const BlogpostHomeForm = lazy(() => import("../pages/BlogpostHomeForm.jsx"));
const AgentBlogpostHomeForm = lazy(() => import("../pages/AgentBlogpostHomeForm.jsx"));
const ManageBlogTableHome = lazy(() => import("../pages/ManageBlogTableHome.jsx"));
const AgentManageBlogTableHome = lazy(() => import("../pages/AgentManageBlogTableHome.jsx"));
const ClaimRequestPage = lazy(() => import("../pages/ClaimRequestPage.jsx"));

// ---------------- Admin Pages ----------------
const AdminLayout = lazy(() => import("../components/admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard.jsx"));
const ManagePolicies = lazy(() => import("../pages/admin/ManagePolicies.jsx"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers.jsx"));
const ManageBlog = lazy(() => import("../pages/admin/ManageBlog.jsx"));
const ManageHomeBlog = lazy(() => import("../pages/admin/ManageHomeBlog.jsx"));
const Transactions = lazy(() => import("../pages/admin/Transactions.jsx"));
const ManagementTable = lazy(() => import("../pages/admin/ManagementTable.jsx"));
const AddBlogForm = lazy(() => import("../pages/admin/AddBlogForm.jsx"));
const ManageBlogTable = lazy(() => import("../pages/admin/ManageBlogTable.jsx"));
const InsuranceServiceSection = lazy(() => import("../pages/admin/InsuranceServiceSection.jsx"));
const InsuranceForm = lazy(() => import("../pages/admin/LifeInsuranceForm.jsx"));
const QuoteLifeInsuranceFrom = lazy(() => import("../pages/QuoteLifeInsuranceFrom.jsx")); // fixed typo
const CarouselSliderForm = lazy(() => import("../pages/InsuranceFormCaro.jsx"));
const HeroCarouselForm = lazy(() => import("../pages/HeroCarouselForm.jsx"));
const HeroCarouselManager = lazy(() => import("../pages/HeroCarouselManager.jsx"));
const UserInsuranceTabs = lazy(() => import("../pages/UserInsuranceTabs.jsx"));
const ReviewsSectionForm = lazy(() => import("../pages/ReviewsSectionForm.jsx"));
const AdminReviewsTable = lazy(() => import("../pages/AdminReviewsTable.jsx"));
const VisitorNews = lazy(() => import("../pages/admin/VisitorNews.jsx"));
const ReviewsSection = lazy(() => import("../pages/admin/ReviewsSection.jsx"));
const AddVisitorForm = lazy(() => import("../pages/admin/AddVisitorNewsForm.jsx"));
const AddPolicyForm = lazy(() => import("../pages/admin/AddPolicyForm.jsx"));
const PolicyManagementTable = lazy(() => import("../pages/admin/PolicyTableEdit.jsx"));
const ContactManager = lazy(() => import("../pages/admin/adminContact.jsx"));
const ContactTableManager = lazy(() => import("../pages/admin/ContactTableManager.jsx"));
const BlogContactManager = lazy(() => import("../pages/admin/adminContact.jsx"));
const VisitorNewsTable = lazy(() => import("../pages/admin/VisitorNewsTable.jsx"));
const Messages = lazy(() => import("../pages/admin/Messages.jsx"));
const OurInsurancePolicy = lazy(() => import("../pages/OurInsurancePolicy.jsx"));
const OurInsurancePolicyAgent = lazy(() => import("../pages/OurInsurancePolicyAgent.jsx"));
const InsuranceDashboardManager = lazy(() => import("../pages/InsuranceDashboard.jsx"));
const AgentInsuranceDashboardManager = lazy(() => import("../pages/AgentInsuranceDashboardManager.jsx"));

// ---------------- Agent Pages ----------------
const AgentLayout = lazy(() => import("../components/agents/AgentLayout.jsx"));
const AgentDashboard = lazy(() => import("../components/agents/AgentDashboard.jsx"));
const AgentPolicies = lazy(() => import("../components/agents/AgentPolicies.jsx"));
const AgentUsers = lazy(() => import("../components/agents/AgentUsers.jsx"));
const AgentMessages = lazy(() => import("../components/agents/AgentMessages.jsx"));
const AgentHomeBlog = lazy(() => import("../pages/agent/AgentHomeBlog.jsx"));
const AgentManageHomeBlog = lazy(() => import("../pages/agent/AgentManageHomeBlog.jsx"));
const AgentBlogForm = lazy(() => import("../pages/agent/AgentBlogForm.jsx"));
const AgentManageBlogTable = lazy(() => import("../pages/agent/AgentManageBlogTable.jsx"));

// ---------------- Customer Pages ----------------
import CustomerLayout from "../components/customer/CustomerLayout.jsx";
import CustomerDashboard from "../components/customer/CustomerDashboard.jsx";
import CustomerPaymentsTable from "../components/customer/CustomerPaymentsTable.jsx";
import PaymentPage from "../components/PaymentPage.jsx";
import CustomerPolicies from "../pages/customer/CustomerPolicies";
import PaymentStatus from "../pages/customer/PaymentStatus";
import Insurance from "../pages/customer/Insurance";
import ReviewsSectionFormCustomer from "../pages/customer/ReviewsSectionFormCustomer.jsx";

// ---------------- Management Layout ----------------
const ManagementLayout = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Management Section</h1>
    <Outlet />
  </div>
);

// ---------------- App Routes ----------------
const AppRoutes = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black text-lg font-medium">Loading...</p>
        </div>
      </div>
    }
  >
    <Routes>
      {/* ---------------- Public Routes ---------------- */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/all-policies" element={<AllPolicies />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/visitor/:id" element={<VisitorDetailsPage />} />
      <Route path="/insurance/:id" element={<InsuranceDetails />} />
      <Route path="/blog/:blogId" element={<BlogDetail />} />
      <Route path="/articles/:id" element={<BlogHomeDetail />} />
      <Route path="/*" element={<NotFound />} />

      {/* ---------------- Private / Authenticated Routes ---------------- */}
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/mybook-quote" element={<PrivateRoute><MyBookQuote /></PrivateRoute>} />
      <Route path="/quote-insurance" element={<PrivateRoute><QuoteLifeInsuranceFrom /></PrivateRoute>} />

      {/* ---------------- Customer Routes ---------------- */}
      <Route path="/customer" element={<PrivateRoute><CustomerLayout /></PrivateRoute>}>
        <Route index element={<CustomerDashboard />} />
        <Route path="reviews" element={<ReviewsSectionFormCustomer />} />
        <Route path="my-policies" element={<CustomerPolicies />} />
        <Route path="payment-status" element={<CustomerPaymentsTable />} />
        <Route path="payment-page" element={<PaymentPage />} />
        <Route path="payments" element={<PaymentStatus />} />
        <Route path="claims" element={<Insurance />} />
      </Route>

      {/* ---------------- Admin Routes ---------------- */}
      <Route path="/admin/*" element={<PrivateRoute allowedRoles={["admin"]}><AdminLayout /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />

        {/* Policies */}
        <Route path="manage-policies" element={<ManagePolicies />} />
        <Route path="manage-policies/:mode/:id?" element={<CarouselSliderForm />} />
        <Route path="policies/:mode/:id?" element={<AddPolicyForm />} />
        <Route path="insurance-policies/:mode/:id?" element={<InsuranceServiceSection />} />
        <Route path="all-policies/edit" element={<InsuranceDashboardManager />} />
        <Route path="all-policies/add" element={<OurInsurancePolicy />} />

        {/* Users */}
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="manage-users/:mode/:id?" element={<InsuranceForm />} />
        <Route path="manage-users/edit" element={<UserInsuranceTabs />} />

        {/* Applications & Transactions */}
        <Route path="transactions" element={<Transactions />} />
        <Route path="manage-applications" element={<ManagementTable />} />

        {/* Blog (Admin + Agent) */}
        <Route path="management-blog" element={<ManageHomeBlog />} />
        <Route path="management-blog/:mode/:id?" element={<BlogpostHomeForm />} />
        <Route path="management-blog/edit" element={<ManageBlogTableHome />} />
        <Route path="manage-blog" element={<ManageBlog />} />
        <Route path="manage-blog/:mode/:id?" element={<AddBlogForm />} />
        <Route path="manage-blog/edit" element={<ManageBlogTable />} />

        {/* Messages */}
        <Route path="messages-section" element={<Messages />} />
        <Route path="messages-section/:mode/:id?" element={<ContactManager />} />
        <Route path="messages-section/edit" element={<ContactTableManager />} />

        {/* Visitor News */}
        <Route path="visitor-news" element={<VisitorNews />} />
        <Route path="visitor-news/:mode/:id?" element={<AddVisitorForm />} />
        <Route path="visitor-news/edit" element={<VisitorNewsTable />} />

        {/* Reviews */}
        <Route path="reviews-section" element={<ReviewsSection />} />
        <Route path="reviews-section/:mode/:id?" element={<ReviewsSectionForm />} />
        <Route path="reviews-section/edit" element={<AdminReviewsTable />} />

        {/* Hero Section */}
        <Route path="hero-section" element={<HeroCarouselManager />} />
        <Route path="hero-section/:mode/:id?" element={<HeroCarouselForm />} />
      </Route>

      {/* ---------------- Agent Routes ---------------- */}
      <Route path="/agent/*" element={<PrivateRoute allowedRoles={["agent"]}><AgentLayout /></PrivateRoute>}>
        <Route index element={<AgentDashboard />} />
        <Route path="policies" element={<AgentPolicies />} />
        <Route path="users" element={<AgentUsers />} />
        <Route path="messages" element={<BlogContactManager />} />
        <Route path="policies/edit" element={<AgentInsuranceDashboardManager />} />
        <Route path="policies/add" element={<OurInsurancePolicyAgent />} />

        {/* Blog (Agent only, shared with Admin) */}
        <Route path="agent-manage-blog" element={<AgentHomeBlog />} />
        <Route path="agent-manage-blog/:mode/:id?" element={<AgentBlogForm />} />
        <Route path="agent-manage-blog/edit" element={<AgentManageBlogTable />} />
        <Route path="agent-management-blog" element={<AgentManageHomeBlog />} />
        <Route path="agent-management-blog/:mode/:id?" element={<AgentBlogpostHomeForm />} />
        <Route path="agent-management-blog/edit" element={<AgentManageBlogTableHome />} />
      </Route>

      {/* ---------------- Management Section (Admin + Agent) ---------------- */}
      <Route path="/management/*" element={<PrivateRoute allowedRoles={["admin","agent"]}><ManagementLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="all-policies" replace />} />
        <Route path="all-policies" element={<AllPolicies />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
