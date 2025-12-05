import React from 'react'
import { jobs } from '../store/data'
import { Header, JobListingOwnerActions } from "../components";
import UpdateJob from '../components/UpdateJob';

const JobListing = () => {
  return (
    <div className="bg-gradient-to-br from-[#D2C1B6] via-white to-[#456882]/10 min-h-screen py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B3C53]/5 to-[#234C6A]/5"></div>
      <Header />
      <div className="mt-8 px-4 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <JobListingOwnerActions jobListing={jobs} editable={true} />
          <UpdateJob />
        </div>
      </div>
    </div>
  );
}

export default JobListing