// Updated MobileHeader.jsx - Add Assignments link
import React from 'react'
import { Link } from 'react-router-dom'
import { connectWallet } from '../services/blockchain'
import { truncate, useGlobalState } from '../store'

const MobileHeader = ({ toggle }) => {
  const [connectedAccount] = useGlobalState('connectedAccount')

  return (
    <section
      className={`md:hidden block absolute top-16 right-0 py-4 px-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-[#456882]/20 z-50 transition-all duration-300 ${
        toggle ? 'visible opacity-100 translate-x-0' : 'invisible opacity-0 translate-x-4'
      }`}
    >
      <div className="flex flex-col space-y-4">
        <Link to={'/mybids'} className="text-[#456882] hover:text-[#1B3C53] font-semibold transition-all duration-300 py-2 border-b border-[#456882]/10 hover:border-[#234C6A]">
          My Bids
        </Link>
        <Link to={'/myjobs'} className="text-[#456882] hover:text-[#1B3C53] font-semibold transition-all duration-300 py-2 border-b border-[#456882]/10 hover:border-[#234C6A]">
          My Jobs
        </Link>
        <Link to={'/assignments'} className="text-[#456882] hover:text-[#1B3C53] font-semibold transition-all duration-300 py-2 border-b border-[#456882]/10 hover:border-[#234C6A]">
          Assignments
        </Link>
        <Link to={'/myprojects'} className="text-[#456882] hover:text-[#1B3C53] font-semibold transition-all duration-300 py-2 border-b border-[#456882]/10 hover:border-[#234C6A]">
          My Projects
        </Link>
        <Link to={'/messages'} className="text-[#456882] hover:text-[#1B3C53] font-semibold transition-all duration-300 py-2 border-b border-[#456882]/10 hover:border-[#234C6A]">
          Messages
        </Link>

        {connectedAccount ? (
          <button className="bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white py-2 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 mt-2">
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
        ) : (
          <button
            className="bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white py-2 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 mt-2"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </section>
  )
}

export default MobileHeader