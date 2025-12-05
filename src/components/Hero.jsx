import React, { useEffect, useState } from 'react'
import { FaPlus } from "react-icons/fa";
import { useGlobalState, setGlobalState } from '../store';
import JobListingCard  from './JobListingCard'

const Hero = () => {
  const [jobs] = useGlobalState('jobs')

  const openModal = ()=> {
    setGlobalState("createModal","scale-100")
  }

  return (
    <section className="min-h-[89vh] bg-gradient-to-br from-[#D2C1B6] via-white to-[#456882]/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B3C53]/5 to-[#234C6A]/5"></div>
      <button
        className="p-4 bg-gradient-to-r from-[#1B3C53] to-[#234C6A] hover:from-[#234C6A] hover:to-[#1B3C53] rounded-full text-white fixed bottom-8 right-8 shadow-xl hover:shadow-2xl transition-all duration-300 z-50 border border-white/20"
        onClick={openModal}
      >
        <FaPlus className="text-lg" />
      </button>
      <main className="mt-20 sm:px-12 px-6 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-[#456882]/20 overflow-hidden">
          <h3 className="text-[#1B3C53] text-3xl font-bold border-b border-[#456882]/30 py-8 px-8 bg-gradient-to-r from-[#1B3C53]/5 to-[#234C6A]/5">
            {jobs.length > 0 ? "Job Listings" : "No Jobs Yet"}
          </h3>
          <div className="p-8">
            {jobs.length > 0
              ? jobs.map((job, i) => (
                  <JobListingCard
                    key={i}
                    jobListing={job}
                  />
                ))
              : <p className="text-[#456882] text-center py-12 text-lg italic bg-[#D2C1B6]/30 rounded-2xl p-6">Get started by creating your first job listing.</p>}
          </div>
        </div>
      </main>
    </section>
  );
}

export default Hero