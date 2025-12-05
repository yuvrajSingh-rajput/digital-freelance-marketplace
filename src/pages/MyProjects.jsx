import React from 'react'
import {
  DeleteJob,
  Header,
  JobListingOwnerActions,
  Payout,
  UpdateJob,
} from '../components'
import { useGlobalState } from '../store'

const MyProjects = () => {
  const [myjobs] = useGlobalState('myjobs')
  const [connectedAccount] = useGlobalState('connectedAccount')

  return (
    <div className="bg-gradient-to-br from-[#D2C1B6] via-white to-[#456882]/10 min-h-screen  relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B3C53]/5 to-[#234C6A]/5"></div>
      <Header />
      <div className="mt-8 px-4 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {myjobs.map((myjob, i) => (
              <JobListingOwnerActions
                key={i}
                jobListing={myjob}
                editable={myjob.owner == connectedAccount}
              />
            ))}

            {myjobs.length < 1 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-[#456882]/20">
                <h2 className="text-2xl font-semibold text-[#456882] mb-2">No Posted Jobs Yet</h2>
                <p className="text-[#456882]/70 italic">Create your first job listing to get started!</p>
              </div>
            )}
          </div>
          <UpdateJob />
          <DeleteJob />
          <Payout />
        </div>
      </div>
    </div>
  )
}

export default MyProjects