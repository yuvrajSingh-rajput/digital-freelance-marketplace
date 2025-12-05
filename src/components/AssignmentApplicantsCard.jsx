// src/components/AssignmentApplicantsCard.jsx - Fixed with proper imports and getGlobalState
import React, { useState, useEffect } from 'react'
import { truncate, getGlobalState } from '../store'  // Import getGlobalState
import { acceptApplicant, getAssignment } from '../services/blockchain'
import { toast } from 'react-toastify'
import { MdOutlineChat } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'  // Import useParams

const AssignmentApplicantsCard = ({ applicant }) => {
  const { id } = useParams()  // Get assignment ID from URL
  const [isActive, setIsActive] = useState(true)  // Track active status
  const [loading, setLoading] = useState(false)  // For button disable during call

  // Fetch latest assignment state on mount
  useEffect(() => {
    const checkActive = async () => {
      try {
        await getAssignment(id)  // Refetch to get latest 'active'
        const currentAssignment = getGlobalState('assignment')  // Use getGlobalState
        setIsActive(currentAssignment?.active || false)
      } catch (err) {
        console.error('Error checking assignment active:', err)
      }
    }
    checkActive()
  }, [id])

  const handleAcceptingApplicant = async (applicantIndex, assignmentId) => {
    if (!isActive) {
      toast.error('Assignment is no longer active. Cannot accept.')
      return
    }

    setLoading(true)  // Disable button during call
    // Refetch just before call for freshness
    await getAssignment(assignmentId)
    const freshAssignment = getGlobalState('assignment')  // Use getGlobalState
    if (!freshAssignment?.active) {
      toast.error('Assignment is no longer active. Cannot accept.')
      setLoading(false)
      return
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await acceptApplicant(assignmentId, applicantIndex)
          .then(async () => {
            await getAssignment(assignmentId)  // Refetch after success
            resolve()
          })
          .catch((err) => reject(err))
      }),
      {
        pending: 'Approving...',
        success: 'Applicant accepted successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
    setLoading(false)
  }

  return (
    <div
      className="my-3 bg-white/80 backdrop-blur-sm shadow-lg p-4 rounded-2xl flex justify-between items-center border border-[#456882]/20 transition-all duration-300 hover:shadow-xl hover:border-[#234C6A]/30 flex-wrap"
    >
      <h4 className="text-lg font-semibold text-[#1B3C53]">{truncate(applicant.account, 4, 4, 11)}</h4>
      <div className="flex items-center space-x-3">
        <Link
          to={`/chats/${applicant.account}`}
          className="inline-flex justify-center items-center space-x-2 py-2 px-5 rounded-xl bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white font-medium transition-all duration-300 hover:shadow-md max-sm:text-sm"
        >
          <MdOutlineChat size={18} />
          <span>Chat</span>
        </Link>
        <button
          onClick={() =>
            handleAcceptingApplicant(applicant.index, applicant.assignmentId)
          }
          disabled={!isActive || loading}
          className={`py-2 px-5 rounded-xl text-white font-medium transition-all duration-300 max-sm:text-sm shadow-sm ${
            isActive && !loading
              ? 'bg-gradient-to-r from-[#1B3C53] to-[#234C6A] hover:shadow-lg'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Approving...' : 'Accept'}
        </button>
      </div>
    </div>
  )
}

export default AssignmentApplicantsCard