import React from 'react'
import { useGlobalState, setGlobalState } from '../store'
import { FaTimes, FaPrint } from 'react-icons/fa'

const CertificateModal = () => {
  const [showModal] = useGlobalState('showCertificateModal')
  const [certificateData] = useGlobalState('certificateData')

  if (!showModal || !certificateData) return null

  const handlePrint = () => window.print()

  const handleClose = () => {
    setGlobalState('showCertificateModal', false)
    setGlobalState('certificateData', null)
  }

  const { assignment, txHash, issuer, date } = certificateData

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-transform duration-300 ${showModal ? 'scale-100' : 'scale-0'}`}>
      <div className="bg-white p-8 rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto print:shadow-none print:bg-white print:p-0">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-black print:hidden">
          <FaTimes className="text-xl" />
        </button>
        
        <div className="text-center print:mb-8">
          <h1 className="text-3xl font-bold mb-4 print:text-4xl">Certificate of Completion</h1>
          <h2 className="text-xl font-semibold mb-2 print:text-2xl">{assignment.title}</h2>
          <p className="text-gray-600 mb-4 print:text-lg print:mb-6">{assignment.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 print:grid-cols-1 print:gap-2">
            <div>
              <p><strong>Completed by:</strong></p>
              <p className="font-mono text-sm break-all print:text-base">{assignment.acceptedStudent}</p>
            </div>
            <div>
              <p><strong>Issued by:</strong></p>
              <p className="font-mono text-sm break-all print:text-base">{issuer}</p>
            </div>
          </div>
          
          <p className="mb-4 print:mb-6"><strong>Date:</strong> {date}</p>
          
          <div className="mb-6 print:mb-8">
            <p><strong>Verification Tx Hash:</strong></p>
            <p className="font-mono text-sm break-all print:text-base">0x{txHash.substring(2, 10)}...{txHash.substring(txHash.length - 8)}</p>
            <p className="text-sm print:text-base">
              <a href={`http://localhost:8545/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline print:no-underline">
                View on Local Explorer
              </a>
            </p>
          </div>
          
          <p className="text-sm italic mb-6 print:text-base print:mb-8">This certificate is blockchain-verified via DappWorks</p>
        </div>
        
        <button onClick={handlePrint} className="w-full px-6 py-3 bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 print:hidden">
          <FaPrint className="inline mr-2" /> Print/Save as PDF
        </button>
      </div>
    </div>
  )
}

export default CertificateModal