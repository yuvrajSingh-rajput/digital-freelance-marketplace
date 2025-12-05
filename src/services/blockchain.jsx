import { setGlobalState } from '../store'
import abi from '../abis/src/contracts/DappWorks.sol/DappWorks.json'
import address from '../abis/contractAddress.json'
import { ethers } from 'ethers'
import { logOutWithCometChat } from './chat'

const { ethereum } = window
const ContractAddress = address.address
const ContractAbi = abi.abi
let tx

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const getEthereumContract = async () => {
  const accounts = await ethereum.request({ method: 'eth_accounts' })
  const provider = accounts[0]
    ? new ethers.providers.Web3Provider(ethereum)
    : new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
  const signer = provider.getSigner();

  const contract = new ethers.Contract(ContractAddress, ContractAbi, signer)
  return contract
}

const isWalletConnected = async () => {
  try {
    if (!ethereum) {
      reportError('Please install Metamask')
      return Promise.reject(new Error('Metamask not installed'))
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0])
    } else {
      console.log('No accounts found.')
    }

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0])
      console.log('Account changed: ', accounts[0])
      await loadData()
      await loadAssignmentData()
      await isWalletConnected()
      logOutWithCometChat()
    })
    await loadData()
    await loadAssignmentData()

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0])
    } else {
      setGlobalState('connectedAccount', '')
      console.log('No accounts found')
    }
  } catch (error) {
    reportError(error)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])
  } catch (error) {
    reportError(error)
  }
}
// Add this helper function (near the top)
const refetchAllData = async () => {
  await loadData();  // For jobs
  await loadAssignmentData();  // For assignments
};

// Update addJobListing (after tx.wait)
const addJobListing = async ({ jobTitle, description, tags, prize }) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.addJobListing(jobTitle, description, tags, {
        value: toWei(prize),
      })
      await tx.wait()

      await refetchAllData()  // NEW: Refetch everything
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
};

const updateJob = async ({ id, jobTitle, description, tags }) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.updateJob(id, jobTitle, description, tags)
      await tx.wait()

      await loadData()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const deleteJob = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.deleteJob(id)
      await tx.wait()

      await loadData()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const bidForJob = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.bidForJob(id)
      await tx.wait()

      await getJobs()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const acceptBid = async (id, jId, bidder) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.acceptBid(id, jId, bidder)
      await tx.wait()

      await loadData()
      await getBidders(jId)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const dispute = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.dispute(id)
      await tx.wait()

      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const resolved = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.resolved(id)
      await tx.wait()

      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const revoke = async (jId, id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.revoke(jId, id)
      await tx.wait()

      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const payout = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.payout(id)
      await tx.wait()

      await getMyJobs()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

// Update createAssignment (after tx.wait)
const createAssignment = async ({ title, description, tags }) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.createAssignment(title, description, tags)
      await tx.wait()

      await refetchAllData()  // NEW: Refetch everything
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
};

const applyForAssignment = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.applyForAssignment(id)
      await tx.wait()

      await getAssignments()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const acceptApplicant = async (id, applicantIndex) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.acceptApplicant(id, applicantIndex)
      await tx.wait()

      await loadAssignmentData()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const completeAssignment = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.completeAssignment(id)
      await tx.wait()

      await getAssignment(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

// const issueCertificate = async (id) => {
//   if (!ethereum) return alert('Please install Metamask')
//   return new Promise(async (resolve, reject) => {
//     try {
//       const contract = await getEthereumContract()
//       tx = await contract.issueCertificate(id)
//       await tx.wait()

//       await loadAssignmentData()
//       resolve(tx)
//     } catch (err) {
//       reportError(err)
//       reject(err)
//     }
//   })
// }

const assignmentApplicationStatus = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const status = await contract.hasAppliedForAssignment(id, await getSignerAddress())
    setGlobalState('assignmentStatus', status)
  } catch (err) {
    reportError(err)
  }
}

// src/services/blockchain.js - Updated getAssignmentApplicants
const getAssignmentApplicants = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const applicants = await contract.getAssignmentApplicants(id)
    setGlobalState('assignmentApplicants', applicants.map(addr => ({ account: addr.toLowerCase(), index: 0, assignmentId: parseInt(id) }))) // Temporary, will be updated in component
  } catch (err) {
    reportError(err)
  }
}

const getAcceptedStudentForAssignment = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const student = await contract.assignmentListings(id)
    setGlobalState('acceptedStudent', student.acceptedStudent.toLowerCase())
  } catch (err) {
    reportError(err)
  }
}

const getAssignments = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const assignments = await contract.getAssignments()
    setGlobalState('assignments', structuredAssignments(assignments))
  } catch (err) {
    reportError(err)
  }
}

const getMyAssignments = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const assignments = await contract.getMyAssignments()
    setGlobalState('myAssignments', structuredAssignments(assignments))
  } catch (err) {
    reportError(err)
  }
}

const getMyAssignmentApplications = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const assignments = await contract.getMyAssignmentApplications()
    setGlobalState('myAssignmentApplications', structuredAssignments(assignments))
  } catch (err) {
    reportError(err)
  }
}

const getAssignment = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const assignment = await contract.getAssignment(id)
    setGlobalState('assignment', structuredAssignments([assignment])[0])
  } catch (err) {
    reportError(err)
  }
}

const loadAssignmentData = async () => {
  await getAssignments()
  await getMyAssignments()
  await getMyAssignmentApplications()
}

// Existing getters
const bidStatus = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const status = await contract.bidStatus(id)
    setGlobalState('status', status)
  } catch (err) {
    reportError(err)
  }
}

const getBidders = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const bidders = await contract.getBidders(id)
    setGlobalState('bidders', structuredBidder(bidders))
  } catch (err) {
    reportError(err)
  }
}

const getFreelancers = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const freelancers = await contract.getFreelancers(id)
    setGlobalState('freelancers', structuredFreelancers(freelancers))
  } catch (err) {
    reportError(err)
  }
}

const getAcceptedFreelancer = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const freelancer = await contract.getAcceptedFreelancer(id)
    setGlobalState('freelancer', structuredFreelancers([freelancer])[0])
  } catch (err) {
    reportError(err)
  }
}

const getJobs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const jobs = await contract.getJobs()
    setGlobalState('jobs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}

const getMyJobs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const jobs = await contract.getMyJobs()
    setGlobalState('myjobs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}

const getMyGigs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const jobs = await contract.getAssignedJobs()
    setGlobalState('mygigs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}

const getMyBidJobs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const jobs = await contract.getJobsForBidder()
    setGlobalState('mybidjobs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}

const getJob = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getEthereumContract()
    const job = await contract.getJob(id)
    setGlobalState('job', structuredJobs([job])[0])
  } catch (err) {
    reportError(err)
  }
}

const loadData = async () => {
  await getJobs()
  await getMyJobs()
  await getMyGigs()
  await getMyBidJobs()
}

// Structuring functions
const structuredJobs = (jobs) =>
  jobs
    .map((job) => ({
      id: job.id.toNumber(),
      owner: job.owner.toLowerCase(),
      freelancer: job.freelancer.toLowerCase(),
      jobTitle: job.jobTitle,
      description: job.description,
      tags: job.tags.split(','),
      prize: fromWei(job.prize),
      paidOut: job.paidOut,
      timestamp: job.timestamp,
      listed: job.listed,
      disputed: job.disputed,
      bidders: job.bidders.map((address) => address.toLowerCase()),
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredAssignments = (assignments) =>
  assignments
    .map((assignment) => ({
      id: assignment.id.toNumber(),
      owner: assignment.owner.toLowerCase(),
      acceptedStudent: assignment.acceptedStudent.toLowerCase(),
      title: assignment.title,
      description: assignment.description,
      tags: assignment.tags.split(','),
      completed: assignment.completed,
      certified: assignment.certified,
      timestamp: assignment.timestamp,
      active: assignment.active,
      applicants: assignment.applicants.map((addr) => addr.toLowerCase()),
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredBidder = (bidders) =>
  bidders.map((bidder) => ({
    id: bidder.id.toNumber(),
    jId: bidder.jId.toNumber(),
    account: bidder.account.toLowerCase(),
  }))

const structuredFreelancers = (freelancers) =>
  freelancers.map((freelancer) => ({
    id: freelancer.id.toNumber(),
    jId: freelancer.jId.toNumber(),
    account: freelancer.account.toLowerCase(),
    bool: freelancer.isAssigned,
  }));

const issueCertificate = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getEthereumContract()
      tx = await contract.issueCertificate(id)
      const receipt = await tx.wait()
      const txHash = receipt.transactionHash

      // Get details for modal
      await getAssignment(id)
      const assignment = getGlobalState('assignment')
      const connectedAccount = getGlobalState('connectedAccount')

      // Show certificate modal
      setGlobalState('showCertificateModal', true)
      setGlobalState('certificateData', { 
        assignment, 
        txHash, 
        issuer: connectedAccount,
        date: new Date().toLocaleDateString()
      })

      await loadAssignmentData()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
};

export {
  connectWallet,
  isWalletConnected,
  addJobListing,
  updateJob,
  deleteJob,
  bidForJob,
  acceptBid,
  dispute,
  resolved,
  revoke,
  payout,
  bidStatus,
  getBidders,
  getFreelancers,
  getAcceptedFreelancer,
  getJobs,
  getMyJobs,
  getJob,
  getMyBidJobs,
  getMyGigs,
  loadData,
  // New exports for assignments
  createAssignment,
  applyForAssignment,
  acceptApplicant,
  completeAssignment,
  issueCertificate,
  assignmentApplicationStatus,
  getAssignmentApplicants,
  getAcceptedStudentForAssignment,
  getAssignments,
  getMyAssignments,
  getMyAssignmentApplications,
  getAssignment,
  loadAssignmentData
}