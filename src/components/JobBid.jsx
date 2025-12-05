import React from 'react'
import { FaEthereum } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const JobBid = ({ jobListing }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#456882]/20 overflow-hidden p-6 transition-all duration-300 hover:shadow-xl hover:border-[#234C6A]/30">
      <h4 className="text-xl font-bold text-[#1B3C53] mb-3 line-clamp-2">{jobListing.jobTitle}</h4>
      <div className="flex items-center mb-4">
        <FaEthereum className="text-lg text-[#234C6A] mr-2" />
        <span className="text-lg font-semibold text-[#456882]">
          {parseFloat(jobListing.prize).toFixed(2)} ETH
        </span>
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
      <div className="flex">
        <Link
          to={`/chats/${jobListing.owner}`}
          className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          <span className="text-sm">Chat with Owner</span>
        </Link>
      </div>
    </div>
  )
}

export default JobBid