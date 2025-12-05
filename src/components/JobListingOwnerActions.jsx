import React, { useEffect } from 'react'
import {
  FaEthereum,
  FaPenAlt,
  FaTrashAlt,
  FaMoneyBill,
  FaArrowRight,
} from 'react-icons/fa'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { setGlobalState } from '../store'
import { Link, useNavigate } from 'react-router-dom'
import { getAcceptedFreelancer } from '../services/blockchain'

const JobListingOwnerActions = ({ jobListing, editable }) => {
  const getFreelancer = async () => {
    await getAcceptedFreelancer(jobListing?.id)
  }
  useEffect(() => {
    getFreelancer()
  }, [])
  const navigate = useNavigate()

  const openUpdateModal = () => {
    setGlobalState('updateModal', 'scale-100')
    setGlobalState('jobListing', jobListing)
  }

  const openPayoutModal = () => {
    setGlobalState('payoutModal', 'scale-100')
    setGlobalState('jobListing', jobListing)
  }

  const openDeleteModal = () => {
    setGlobalState('deleteModal', 'scale-100')
    setGlobalState('jobListing', jobListing)
  }

  const viewBidders = (id) => {
    navigate(`/viewbidders/${id}`)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#456882]/20 overflow-hidden p-6 transition-all duration-300 hover:shadow-xl hover:border-[#234C6A]/30">
      <h4 className="text-xl font-bold text-[#1B3C53] mb-3 line-clamp-2">{jobListing.jobTitle}</h4>
      <div className="flex items-center mb-4">
        <FaEthereum className="text-lg text-[#234C6A] mr-2" />
        <span className="text-lg font-semibold text-[#456882]">{jobListing.prize} ETH</span>
      </div>
      <div className="flex items-center mb-4 text-sm flex-wrap gap-2">
        {jobListing.tags.length > 0
          ? jobListing.tags.map((tag, i) => (
              <span 
                key={i} 
                className="px-3 py-1.5 bg-gradient-to-r from-[#D2C1B6]/50 to-[#456882]/20 text-[#1B3C53] rounded-full font-medium text-xs shadow-sm"
              >
                {tag}
              </span>
            ))
          : null}
      </div>
      <p className="text-[#456882]/80 text-sm leading-relaxed mb-5 line-clamp-3 pr-2">{jobListing.description}</p>
      <div className="flex space-x-2">
        {editable && !jobListing.paidOut && (
          <div className="flex mt-5 space-x-3 flex-wrap gap-2">
            {jobListing.listed && (
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

                {jobListing.freelancer !=
                  '0x0000000000000000000000000000000000000000' && (
                  <Link
                    to={`/chats/${jobListing.freelancer}`}
                    className="flex items-center px-4 py-2.5 border border-[#1B3C53] text-[#1B3C53] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 space-x-2 bg-white/50"
                  >
                    <span className="text-sm">Chat with freelancer</span>
                  </Link>
                )}
              </>
            )}

            {jobListing.listed && (
              <button
                className="text-sm py-2.5 px-4 bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white font-semibold flex items-center space-x-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => viewBidders(jobListing.id)}
              >
                <span>View bidders</span>
                <FaArrowRight className="-rotate-45 text-sm" />
              </button>
            )}
            {!jobListing.listed && !jobListing.paidOut && (
              <>
                <button
                  onClick={openPayoutModal}
                  className="flex items-center px-4 py-2.5 border border-[#456882] text-[#456882] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 space-x-2 bg-white/50"
                >
                  <FaMoneyBill className="text-sm" />
                  <span className="text-sm">Pay</span>
                </button>
                {jobListing.freelancer !=
                  '0x0000000000000000000000000000000000000000' && (
                  <Link
                    to={`/chats/${jobListing.freelancer}`}
                    className="flex items-center px-4 py-2.5 border border-[#1B3C53] text-[#1B3C53] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 space-x-2 bg-white/50"
                  >
                    <span className="text-sm">Chat with freelancer</span>
                  </Link>
                )}
              </>
            )}
          </div>
        )}

        {editable && jobListing.paidOut == true && (
          <div className="">
            <button className="text-sm px-4 py-2.5 text-[#1B3C53] mt-3 flex items-center space-x-2 bg-gradient-to-r from-[#D2C1B6]/50 to-[#456882]/30 rounded-xl font-semibold shadow-sm">
              <span>Completed</span>
              <IoMdCheckmarkCircleOutline className="text-green-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobListingOwnerActions