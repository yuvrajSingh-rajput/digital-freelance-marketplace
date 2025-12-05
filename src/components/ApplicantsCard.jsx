import React from 'react'
import { truncate } from '../store'
import { acceptBid } from '../services/blockchain'
import { toast } from 'react-toastify'
import { MdOutlineChat } from 'react-icons/md'
import { Link } from 'react-router-dom'

const ApplicantsCard = ({ bidder }) => {
  const handleAcceptingBid = async (bid, jid, account) => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await acceptBid(bid, jid, account)
          .then(async () => resolve())
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'bid accepted successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className="my-3 bg-white/80 backdrop-blur-sm shadow-lg p-4 rounded-2xl flex justify-between items-center border border-[#456882]/20 transition-all duration-300 hover:shadow-xl hover:border-[#234C6A]/30 flex-wrap"
    >
      <h4 className="text-lg font-semibold text-[#1B3C53]">{truncate(bidder.account, 4, 4, 11)}</h4>
      <div className="flex items-center space-x-3">
        <Link
          to={`/chats/${bidder.account}`}
          className="inline-flex justify-center items-center space-x-2 py-2 px-5 rounded-xl bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white font-medium transition-all duration-300 hover:shadow-md max-sm:text-sm"
        >
          <MdOutlineChat size={18} />
          <span>Chat</span>
        </Link>
        <button
          onClick={() =>
            handleAcceptingBid(bidder.id, bidder.jId, bidder.account)
          }
          className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white font-medium transition-all duration-300 hover:shadow-md max-sm:text-sm shadow-sm hover:shadow-lg"
        >
          Accept
        </button>
      </div>
    </div>
  )
}

export default ApplicantsCard