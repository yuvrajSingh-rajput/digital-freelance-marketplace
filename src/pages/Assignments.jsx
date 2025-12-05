// src/pages/Assignments.jsx - Fixed with useEffect import
import React, { useState, useEffect } from 'react'
import { useGlobalState, setGlobalState } from '../store'
import { FaPlus } from "react-icons/fa";
import { Header} from '../components'
import AssignmentListingCard from '../components/AssignmentListingCard';
import CreateAssignment from '../components/CreateAssignment';
import { getAssignments } from '../services/blockchain'

const Assignments = () => {
  const [assignments] = useGlobalState('assignments')

  useEffect(() => {
    getAssignments()
  }, [])

  const openModal = () => {
    setGlobalState("createAssignmentModal", "scale-100")
  }

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-[#D2C1B6] min-h-screen">
      <Header />
      <section className="min-h-[89vh] bg-gradient-to-br from-[#D2C1B6] via-white to-[#456882]/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B3C53]/5 to-[#234C6A]/5"></div>
        <button
          className="p-4 bg-gradient-to-r from-[#1B3C53] to-[#234C6A] hover:from-[#234C6A] hover:to-[#1B3C53] rounded-full text-white fixed bottom-8 right-8 shadow-xl hover:shadow-2xl transition-all duration-300 z-50 border border-white/20"
          onClick={openModal}
        >
          <FaPlus className="text-lg" />
        </button>
        <main className="mt-20 sm:px-12 px-6 relative z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-[#456882]/20 overflow-hidden">
            <h3 className="text-[#1B3C53] text-3xl font-bold border-b border-[#456882]/30 py-8 px-8 bg-gradient-to-r from-[#1B3C53]/5 to-[#234C6A]/5">
              College Assignments
            </h3>
            <div className="p-8">
              {assignments.length > 0
                ? assignments.map((assignment, i) => (
                    <AssignmentListingCard
                      key={i}
                      assignmentListing={assignment}
                    />
                  ))
                : <p className="text-[#456882] text-center py-12 text-lg italic bg-[#D2C1B6]/30 rounded-2xl p-6">No assignments posted yet. Be the first to create one!</p>}
            </div>
          </div>
        </main>
        <CreateAssignment />
      </section>
    </div>
  )
}

export default Assignments