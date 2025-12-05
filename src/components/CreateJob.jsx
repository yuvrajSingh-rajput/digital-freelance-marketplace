import React, { useState } from 'react'
import { setGlobalState, truncate, useGlobalState } from '../store'
import { FaTimes } from 'react-icons/fa'
import { addJobListing } from '../services/blockchain'
import { toast } from 'react-toastify'

const CreateJob = () => {
  const [createModal] = useGlobalState('createModal')
  const [jobTitle, setJobTitle] = useState('')
  const [prize, setPrize] = useState('')
  const [description, setDescription] = useState('')
  const [skill, setSkill] = useState('')
  const [skills, setSkills] = useState([])

  const addSkills = () => {
    if (skills.length != 5) {
      setSkills((prevState) => [...prevState, skill])
    }
    setSkill('')
  }

  const removeSkill = (index) => {
    skills.splice(index, 1)
    setSkills(() => [...skills])
  }

  const closeModal = () => {
    setGlobalState('createModal', 'scale-0')
    setJobTitle('')
    setPrize('')
    setDescription('')
    setSkill('')
    setSkills([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!jobTitle || !description || skills.length === 0 || !prize) {
      return alert('Please fill all fields and add at least one skill')
    }

    const tags = skills.join(',')

    try {
      const tx = await addJobListing({
        jobTitle,
        description,
        tags,
        prize,
      })

      if (tx && typeof tx.wait === 'function') {
        await tx.wait()
      }

      closeModal()
    } catch (err) {
      console.error('create job error:', err)
      alert(err?.message || 'Transaction failed or was rejected')
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black/60 backdrop-blur-sm transform z-50 transition-transform duration-300 ${createModal}`}
    >
      <div className="bg-white shadow-2xl rounded-3xl w-11/12 max-w-lg relative overflow-hidden border border-[#456882]/10">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 z-10 text-[#456882] hover:text-[#1B3C53] transition-all duration-200 p-2 hover:bg-gray-100 rounded-full"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B3C53] to-[#234C6A] pt-8 pb-6 px-8">
          <h3 className="text-3xl font-bold text-white text-center">Create a Job</h3>
        </div>

        {/* Form */}
        <div className="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Job Title */}
            <div className="mb-6">
              <label htmlFor="jt" className="block text-sm font-semibold text-[#1B3C53] mb-2">
                Job Title
              </label>
              <input
                id="jt"
                value={jobTitle}
                placeholder="e.g. Content Writer..."
                type="text"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-transparent transition-all bg-white hover:border-[#234C6A]/50"
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </div>

            {/* Prize */}
            <div className="mb-6">
              <label htmlFor="prize" className="block text-sm font-semibold text-[#1B3C53] mb-2">
                Prize (ETH)
              </label>
              <input
                id="prize"
                value={prize}
                placeholder="e.g. 0.04"
                step={0.0001}
                type="text"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-transparent transition-all bg-white hover:border-[#234C6A]/50"
                onChange={(e) => setPrize(e.target.value)}
                required
              />
            </div>

            {/* Featured Skills */}
            <div className="mb-4">
              <label htmlFor="skill" className="block text-sm font-semibold text-[#1B3C53] mb-2">
                Featured Skills
              </label>
              <div className="relative">
                <input
                  id="skill"
                  type="text"
                  value={skill}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-transparent transition-all bg-white hover:border-[#234C6A]/50 pr-24"
                  placeholder="e.g. React, JavaScript (max 5)"
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (skill.trim()) addSkills()
                    }
                  }}
                />
                {skills.length < 5 && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 py-2 px-5 bg-gradient-to-r from-[#1B3C53] to-[#234C6A] hover:from-[#234C6A] hover:to-[#1B3C53] text-white text-sm rounded-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={addSkills}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>

            {/* Skills Display */}
            {skills.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-[#D2C1B6]/20 to-[#456882]/10 border border-[#456882]/10">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[#1B3C53] bg-white/80 font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 border border-[#456882]/10"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(i)}
                        type="button"
                        className="text-[#456882] hover:text-red-600 transition-colors duration-200"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="desc" className="block text-sm font-semibold text-[#1B3C53] mb-2">
                Description
              </label>
              <textarea
                id="desc"
                value={description}
                type="text"
                placeholder="Write a compelling description..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-transparent transition-all bg-white hover:border-[#234C6A]/50 resize-none"
                rows="5"
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-[#1B3C53] to-[#234C6A] hover:from-[#234C6A] hover:to-[#1B3C53] text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Create Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateJob