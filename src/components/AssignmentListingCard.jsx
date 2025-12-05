// New file: src/components/AssignmentListingCard.jsx - Similar to JobListingCard but free
import React from 'react'
import { FaCertificate } from 'react-icons/fa'
import { applyForAssignment } from '../services/blockchain' // Assume new function
import { toast } from 'react-toastify'
import { useGlobalState } from '../store'
import { useNavigate } from 'react-router-dom'

const AssignmentListingCard = ({ assignmentListing }) => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const navigate = useNavigate()

  const handleApply = async (id) => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await applyForAssignment(id)
          .then(async () => {
            resolve()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Applying...',
        success: 'Application sent successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const manageAdminTasks = () => {
    navigate('/myassignments') // New page for my assignments
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#456882]/20 overflow-hidden p-6 transition-all duration-300 hover:shadow-xl hover:border-[#234C6A]/30 mb-6">
      <h4 className="text-xl font-bold text-[#1B3C53] mb-3 line-clamp-2">{assignmentListing.title}</h4>
      <div className="flex items-center mb-4">
        <FaCertificate className="text-lg text-[#234C6A] mr-2" />
        <span className="text-lg font-semibold text-[#456882]">
          Certificate on Completion
        </span>
      </div>
      <div className="flex items-center mb-4 text-sm flex-wrap gap-2">
        {assignmentListing.tags.length > 0
          ? assignmentListing.tags.map((tag, i) => (
              <span 
                key={i} 
                className="px-3 py-1.5 bg-gradient-to-r from-[#D2C1B6]/50 to-[#456882]/20 text-[#1B3C53] rounded-full font-medium text-xs shadow-sm"
              >
                {tag}
              </span>
            ))
          : null}
      </div>
      <p className="text-[#456882]/80 text-sm leading-relaxed mb-5 line-clamp-3 pr-2">{assignmentListing.description}</p>
      {connectedAccount != assignmentListing.owner &&
      !assignmentListing.applicants.includes(connectedAccount) ? (
        <button
          onClick={() => handleApply(assignmentListing.id)}
          className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          Apply for Free
        </button>
      ) : connectedAccount != assignmentListing.owner &&
        assignmentListing.applicants.includes(connectedAccount) ? (
        <button className="px-4 py-2.5 text-sm bg-gradient-to-r from-[#D2C1B6]/30 to-[#456882]/20 text-[#1B3C53] rounded-xl font-medium border border-[#456882]/20">
          Application Pending
        </button>
      ) : (
        <button
          onClick={manageAdminTasks}
          className="px-4 py-2.5 text-sm bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
        >
          Manage
        </button>
      )}
    </div>
  )
}

export default AssignmentListingCard