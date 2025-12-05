import React from 'react'
import { Header, JobBid } from '../components'
import { useGlobalState } from '../store'

const MyJobs = () => {
  const [mygigs] = useGlobalState('mygigs')

  return (
    <div className="bg-gradient-to-br from-[#D2C1B6] via-white to-[#456882]/10 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B3C53]/5 to-[#234C6A]/5"></div>
      <Header />
      <div className="mt-8 px-4 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-[#1B3C53] mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#456882]/20">
            {mygigs.length > 0
              ? 'Assigned Tasks'
              : "You Don't Have Any Assigned Tasks"}
          </h3>
          <div className="space-y-6">
            {mygigs.length > 0
              ? mygigs.map((mygig, i) => (
                  <JobBid key={i} jobListing={mygig} />
                ))
              : <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-[#456882]/20">
                  <p className="text-[#456882] text-lg italic mb-4">Check back later for new assignments!</p>
                </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyJobs