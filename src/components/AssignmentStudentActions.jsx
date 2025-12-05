import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { completeAssignment } from '../services/blockchain'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const AssignmentStudentActions = ({ assignmentListing }) => {
  const handleComplete = async (id) => {
    try {
      await toast.promise(
        new Promise(async (resolve, reject) => {
          await completeAssignment(id)
          resolve()
        }),
        {
          pending: 'Marking as complete...',
          success: 'Assignment marked as complete! 👌',
          error: 'Failed to complete 🤯',
        }
      )
    } catch (err) {
      console.error('Completion error:', err)
      toast.error('Failed to complete assignment')
    }
  }

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#456882]/20 overflow-hidden p-6 transition-all duration-300 hover:shadow-xl hover:border-[#234C6A]/30">
      <h4 className="text-xl font-bold text-[#1B3C53] mb-3 line-clamp-2">{assignmentListing.title}</h4>
      <div className="flex items-center mb-4">
        <FaCheckCircle className="text-lg text-[#234C6A] mr-2" />
        <span className="text-lg font-semibold text-[#456882]">Ready for Completion</span>
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
      <div className="flex space-x-2">
        {!assignmentListing.completed && (
          <button
            onClick={() => handleComplete(assignmentListing.id)}
            className="px-4 py-2.5 bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Complete Assignment
          </button>
        )}
        {assignmentListing.completed && !assignmentListing.certified && (
          <p className="text-sm text-[#456882]/80 italic">Waiting for certificate issuance...</p>
        )}
        {assignmentListing.owner !== ZERO_ADDRESS && (
          <Link
            to={`/chats/${assignmentListing.owner}`}
            className="px-4 py-2.5 border border-[#1B3C53] text-[#1B3C53] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            Chat with Owner
          </Link>
        )}
      </div>
    </div>
  )
}

export default AssignmentStudentActions