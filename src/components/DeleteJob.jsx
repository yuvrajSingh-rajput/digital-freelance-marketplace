import React from 'react'
import { useGlobalState, setGlobalState } from '../store'
import { FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { deleteJob } from '../services/blockchain'

const DeleteJob = () => {
  const [deleteModal] = useGlobalState('deleteModal')
  const [jobListing] = useGlobalState('jobListing')

  const closeModal = () => {
    setGlobalState('deleteModal', 'scale-0')
    setGlobalState('jobListing', null)
  }

  const handleDelete = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await deleteJob(jobListing.id)
          .then(async () => {
            closeModal()
            resolve()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'job deleted successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black/60 backdrop-blur-sm transform z-50 transition-transform duration-300 ${deleteModal}`}
    >
      <div className="bg-white/95 backdrop-blur-sm text-[#1B3C53] shadow-2xl shadow-[#1B3C53]/10 rounded-3xl w-11/12 md:w-96 max-w-md mx-4 p-8 relative overflow-hidden border border-[#456882]/20">
        <div className="text-center">
          <div className="flex justify-center items-center p-4 my-4 bg-gradient-to-r from-[#D2C1B6]/30 to-[#456882]/10 rounded-2xl">
            <FaTrashAlt className="text-5xl text-red-500" />
          </div>
          <p className="text-lg font-semibold mb-4 leading-relaxed">
            Are you sure you want to delete this job?
          </p>
          <h4 className="text-sm text-red-600 font-medium mb-8">
            This action can't be undone
          </h4>
          <div className="flex justify-between items-center space-x-4">
            <button
              onClick={closeModal}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-[#D2C1B6]/50 to-[#456882]/30 text-[#1B3C53] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#456882]/20"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteJob