// File: AllPolicies.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  FileText,
  DollarSign,
  Settings,
  Plus,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

// Import actual components

import PaymentsTable from "./PaymentsTable";
import InsuranceServicesList from "./InsuranceServicesList";
import InsuranceCardSection from "./InsuranceCardSection";
import InsPaymentsTable from "./InsPaymentsTable";
import ProfileTableAPI from "./ProfileTable";

const SectionCard = ({
  icon: Icon,
  title,
  gradientFrom,
  gradientTo,
  children,
  actions,
}) => (
  <div className="group relative w-full">
    {/* Glowing background effect */}
    <div
      className={`absolute -inset-1 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-3xl blur opacity-0 group-hover:opacity-30 transition-all duration-700`}
    ></div>

    {/* Main card */}
    <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] overflow-hidden w-full">
      {/* Top gradient bar */}
      <div
        className={`h-1 w-full bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`}
      ></div>

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-2xl blur opacity-50`}
              ></div>
              <div
                className={`relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-${gradientFrom} to-${gradientTo} rounded-2xl flex items-center justify-center shadow-2xl`}
              >
                <Icon className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                {title}
              </h2>
              <div
                className={`w-8 h-1 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-full`}
              ></div>
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2 flex-wrap">{actions}</div>
          )}
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>

      {/* Bottom accent */}
      <div
        className={`h-0.5 w-full bg-gradient-to-r from-${gradientFrom}/20 to-${gradientTo}/20`}
      ></div>
    </div>
  </div>
);

const AllPolicies = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 md:p-8 relative overflow-hidden">
    {/* ✅ SEO Helmet + Favicon */}
    <Helmet>
      <title>Insurance Policies | Smart Insurance</title>
      <meta
        name="description"
        content="View and manage all your policies, claims, payments, and insurance services in one smart dashboard."
      />
      <meta
        name="keywords"
        content="insurance dashboard, claims, policies, payments, management"
      />
      <link rel="icon" href="insurance.png" sizes="any" />
      <link rel="icon" type="image/png" href="insurance.png" />
      <link rel="apple-touch-icon" href="insurance.png" />
    </Helmet>

    <div className="max-w-full mx-auto relative z-10 space-y-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-tight">
          Insurance Policies
        </h1>
        <p className="text-gray-600 text-lg font-medium">
          Manage your policies, claims, and payments in one place
        </p>
      </div>

      {/* Sections */}
      <InsuranceCardSection/>

      <SectionCard
        icon={DollarSign}
        title="Payment History"
        gradientFrom="green-500"
        gradientTo="emerald-500"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25">
            <Plus className="w-4 h-4" /> Add Payment
          </button>
        }
      >
        <PaymentsTable />
      </SectionCard>

      <SectionCard
        icon={Shield}
        title="Insurance Services"
        gradientFrom="purple-500"
        gradientTo="violet-500"
        actions={
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            <Plus className="w-4 h-4" /> Add Service
          </Link>
        }
      >
        <InsuranceServicesList />
      </SectionCard>

      <SectionCard
        icon={Settings}
        title="Management Center"
        gradientFrom="red-500"
        gradientTo="rose-500"
        actions={
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25"
          >
            <Plus className="w-4 h-4" /> Add Policy
          </Link>
        }
      >
        <InsPaymentsTable />
      </SectionCard>
      <SectionCard
        icon={Settings}
        title="Management Center"
        gradientFrom="red-500"
        gradientTo="rose-500"
      >
        <ProfileTableAPI />
      </SectionCard>
    </div>
  </div>
);

export default AllPolicies;
