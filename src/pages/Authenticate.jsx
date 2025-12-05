import { toast } from 'react-toastify'
import { Header } from '../components'
import { loginWithCometChat, signUpWithCometChat } from '../services/chat'
import { setGlobalState, useGlobalState } from '../store'
import { useNavigate } from 'react-router-dom'

const Authenticate = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const navigate = useNavigate()

  const handleSignUp = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await signUpWithCometChat(connectedAccount)
          .then((user) => resolve(user))
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Signing up...',
        success: 'Signed up successfully, please login 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleLogin = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await loginWithCometChat(connectedAccount)
          .then((user) => {
            setGlobalState('currentUser', user)
            navigate('/messages')
            resolve(user)
          })
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Logging...',
        success: 'Logged in successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#D2C1B6] via-white to-[#456882]/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B3C53]/5 to-[#234C6A]/5"></div>
        <div className="w-full sm:w-3/5 mx-auto mt-20 px-3 relative z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#456882]/20 p-8">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#1B3C53] to-[#234C6A] bg-clip-text text-transparent mb-4">Chats Authentication</h1>
            <p className="text-center text-[#456882] mb-8">
              Login or sign up to chat with your client.
            </p>

            <div className="flex justify-center items-center space-x-3">
              <button
                onClick={handleLogin}
                className="inline-flex justify-center items-center space-x-2 py-3 px-8 rounded-xl bg-gradient-to-r from-[#1B3C53] to-[#234C6A] text-white font-semibold transition-all duration-300 hover:shadow-lg shadow-md max-sm:text-sm"
              >
                Login
              </button>
              <button
                onClick={handleSignUp}
                className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#D2C1B6]/50 to-[#456882]/50 text-[#1B3C53] font-semibold transition-all duration-300 hover:shadow-md shadow-sm border border-[#456882]/20 max-sm:text-sm"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Authenticate