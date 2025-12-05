// src/pages/ViewAssignmentApplicants.jsx
import React, { useEffect } from 'react'
import { getAssignmentApplicants, getAssignment } from '../services/blockchain'
import { useParams } from 'react-router-dom'
import { useGlobalState } from '../store'
import { Header } from '../components'
import AssignmentApplicantsCard from '../components/AssignmentApplicantsCard'

const ViewAssignmentApplicants = () => {
  const { id } = useParams()
  const [applicants] = useGlobalState('assignmentApplicants')
  const [assignment] = useGlobalState('assignment')

  const fetchApplicants = async () => {
    await getAssignmentApplicants(id)
    await getAssignment(id)
  }

  useEffect(() => {
  fetchApplicants()
}, [id])  // Depend on id for re-fetch on page load

  return (
    <div className="bg-gradient-to-br from-[#D2C1B6] via-white to-[#456882]/10 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B3C53]/5 to-[#234C6A]/5"></div>
      <Header />
      <div className="mt-8 px-4 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1B3C53] mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#456882]/20 text-center">
            {applicants?.length > 0
              ? 'Applicants'
              : !assignment?.active
              ? 'Student Selected'
              : 'No Applicants Yet'}
          </h2>
          <div className="space-y-6">
            {applicants?.length > 0
              ? applicants.map((applicant, i) => (
                  <AssignmentApplicantsCard key={i} applicant={applicant} />
                ))
              : <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-[#456882]/20">
                  <p className="text-[#456882] text-lg italic">
                    {!assignment?.active ? 'Student has been selected. Great job!' : 'No applicants yet. Your assignment will appear here once someone applies.'}
                  </p>
                </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewAssignmentApplicants