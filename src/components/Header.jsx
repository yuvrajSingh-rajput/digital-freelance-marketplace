// Updated Header.jsx - Add Assignments link to navigation
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connectWallet } from '../services/blockchain'
import { truncate, useGlobalState } from '../store'
import { BsList, BsX } from 'react-icons/bs'
import MobileHeader from './MobileHeader'

const Header = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header className="bg-white/90 backdrop-blur-sm w-full mx-auto px-6 py-5 flex justify-between items-center shadow-lg border-b border-[#456882]/20 sticky top-0 z-40">
      <Link className="text-[#1B3C53] font-bold text-3xl tracking-tight bg-gradient-to-r from-[#1B3C53] to-[#234C6A] bg-clip-text text-transparent" to={'/'}>
        FreelanceForge
      </Link>
      <nav className="items-center space-x-10 md:flex hidden">
        <Link to={'/mybids'} className="text-[#456882] hover:text-[#1B3C53] font-semibold transition-all duration-300 border-b-2 border-transparent hover:border-[#234C6A] pb-1">
          My Bids
        </Link>
        <Link to={'/myjobs'} className="text-[#456882] hover:text-[#1B3C53] font-semibold transition-all duration-300 border-b-2 border-transparent hover:border-[#234C6A] pb-1">
          My Jobs
        </Link>
        <Link to={'/assignments'} className="text-[#456882] hover:text-[#1B3C53] font-semibold transition-all duration-300 border-b-2 border-transparent hover:border-[#234C6A] pb-1">
          Assignments
        </Link>
        <Link to={'/myprojects'} className="text-[#456882] hover:text-[#1B3C53] font-semibold transition-all duration-300 border-b-2 border-transparent hover:border-[#234C6A] pb-1">
          My Projects
        </Link>
        <Link to={'/messages'} className="text-[#456882] hover:text-[#1B3C53] font-semibold transition-all duration-300 border-b-2 border-transparent hover:border-[#234C6A] pb-1">
          Messages
        </Link>

        {connectedAccount ? (
          <button className="bg-gradient-to-r from-[#1B3C53] to-[#234C6A] hover:from-[#234C6A] hover:to-[#1B3C53] text-white py-3 px-8 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl border border-white/20">
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
        ) : (
          <button
            className="bg-gradient-to-r from-[#1B3C53] to-[#234C6A] hover:from-[#234C6A] hover:to-[#1B3C53] text-white py-3 px-8 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl border border-white/20"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </nav>

      <div className="md:hidden block relative" onClick={handleToggle}>
        {!isOpen ? (
          <BsList className="text-3xl cursor-pointer text-[#456882] hover:text-[#1B3C53] transition-all duration-300" />
        ) : (
          <BsX className="text-3xl cursor-pointer text-[#456882] hover:text-[#1B3C53] transition-all duration-300" />
        )}
        <MobileHeader toggle={isOpen} />
      </div>
    </header>
  )
}

export default Header