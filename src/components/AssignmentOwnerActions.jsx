import React, { useEffect } from 'react'
import {
  FaCertificate,
  FaPenAlt,
  FaTrashAlt,
} from 'react-icons/fa'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { setGlobalState } from '../store'
import { Link, useNavigate } from 'react-router-dom'
import { issueCertificate } from '../services/blockchain'
import { toast } from 'react-toastify'

const AssignmentOwnerActions = ({ assignmentListing, editable }) => {
  const navigate = useNavigate()

  const openUpdateModal = () => {
    setGlobalState('updateAssignmentModal', 'scale-100')
    setGlobalState('assignmentListing', assignmentListing)
  }

  const openDeleteModal = () => {
    setGlobalState('deleteAssignmentModal', 'scale-100')
    setGlobalState('assignmentListing', assignmentListing)
  }

  const viewApplicants = (id) => {
    navigate(`/viewassignmentapplicants/${id}`)
  }

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  const handleIssueCertificate = async (id) => {
    try {
      await toast.promise(
        new Promise(async (resolve, reject) => {
          const tx = await issueCertificate(id)
          resolve(tx)
        }),
        {
          pending: 'Issuing certificate...',
          success: 'Certificate issued successfully! PDF downloading... 👌',
          error: 'Failed to issue certificate 🤯',
        }
      )
    } catch (err) {
      console.error('Certificate issuance error:', err)
      toast.error('Failed to issue certificate')
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#456882]/20 overflow-hidden p-6 transition-all duration-300 hover:shadow-xl hover:border-[#234C6A]/30">
      <h4 className="text-xl font-bold text-[#1B3C53] mb-3 line-clamp-2">{assignmentListing.title}</h4>
      <div className="flex items-center mb-4">
        <FaCertificate className="text-lg text-[#234C6A] mr-2" />
        <span className="text-lg font-semibold text-[#456882]">Certificate on Completion</span>
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
        {editable && !assignmentListing.certified && (
          <div className="flex mt-5 space-x-3 flex-wrap gap-2">
            {assignmentListing.active && (
              <>
                <button
                  onClick={openUpdateModal}
                  className="flex items-center px-4 py-2.5 border border-[#234C6A] text-[#234C6A] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 space-x-2 bg-white/50"
                >
                  <FaPenAlt className="text-sm" />
                  <span className="text-sm">Update</span>
                </button>
                <button
                  onClick={openDeleteModal}
                  className="flex items-center px-4 py-2.5 border border-red-500 text-red-500 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 space-x-2 bg-white/50 text-sm"
                >
                  <FaTrashAlt className="text-sm" />
                  <span className="text-sm">Delete</span>
                </button>

                {assignmentListing.acceptedStudent !== ZERO_ADDRESS && (
                  <Link
                    to={`/chats/${assignmentListing.acceptedStudent}`}
                    className="flex items-center px-4 py-2.5 border border-[#1B3C53] text-[#1B3C53] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 space-x-2 bg-white/50"
                  >
                    <span className="text-sm">Chat with Student</span>
                  </Link>
                )}
              </>
            )}

            {assignmentListing.active && (
              <button
                className="text-sm py-2.5 px-4 bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white font-semibold flex items-center space-x-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => viewApplicants(assignmentListing.id)}
              >
                <span>View Applicants</span>
              </button>
            )}
            {!assignmentListing.active && !assignmentListing.certified && (
              <>
                {assignmentListing.acceptedStudent !== ZERO_ADDRESS && (
                  <button
                    onClick={() => handleIssueCertificate(assignmentListing.id)}
                    disabled={!assignmentListing.completed}  // NEW: Disable until completed
                    className={`flex items-center px-4 py-2.5 border border-[#456882] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 space-x-2 ${
                      assignmentListing.completed
                        ? 'text-[#456882] bg-white/50 hover:bg-white/70'
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    }`}
                  >
                    <FaCertificate className="text-sm" />
                    <span className="text-sm">
                      {assignmentListing.completed ? 'Issue Certificate' : 'Complete First'}
                    </span>
                  </button>
                )}
                {assignmentListing.acceptedStudent !== ZERO_ADDRESS && (
                  <Link
                    to={`/chats/${assignmentListing.acceptedStudent}`}
                    className="flex items-center px-4 py-2.5 border border-[#1B3C53] text-[#1B3C53] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 space-x-2 bg-white/50"
                  >
                    <span className="text-sm">Chat with Student</span>
                  </Link>
                )}
              </>
            )}
          </div>
        )}

        {editable && assignmentListing.certified && (
          <div className="">
            <button className="text-sm px-4 py-2.5 text-[#1B3C53] mt-3 flex items-center space-x-2 bg-gradient-to-r from-[#D2C1B6]/50 to-[#456882]/30 rounded-xl font-semibold shadow-sm">
              <span>Certificate Issued</span>
              <IoMdCheckmarkCircleOutline className="text-green-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignmentOwnerActions