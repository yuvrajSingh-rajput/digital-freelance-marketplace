// src/pages/MyAssignments.jsx - Fixed with useEffect import
import React, { useEffect } from 'react'
import { Header } from '../components'
import AssignmentOwnerActions from '../components/AssignmentOwnerActions'
import { useGlobalState } from '../store'
import { getMyAssignments } from '../services/blockchain'

const MyAssignments = () => {
  const [myAssignments] = useGlobalState('myAssignments')
  const [connectedAccount] = useGlobalState('connectedAccount')

  useEffect(() => {
    getMyAssignments()
  }, [connectedAccount])

  return (
    <div className="bg-gradient-to-br from-[#D2C1B6] via-white to-[#456882]/10 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B3C53]/5 to-[#234C6A]/5"></div>
      <Header />
      <div className="mt-8 px-4 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {myAssignments.map((assignment, i) => (
              <AssignmentOwnerActions
                key={i}
                assignmentListing={assignment}
                editable={assignment.owner == connectedAccount}
              />
            ))}

            {myAssignments.length < 1 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-[#456882]/20">
                <h2 className="text-2xl font-semibold text-[#456882] mb-2">No Assignments Posted Yet</h2>
                <p className="text-[#456882]/70 italic">Post your first assignment to engage students!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAssignments