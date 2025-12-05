import { useEffect } from 'react'
import { getConversations } from '../services/chat'
import { Link } from 'react-router-dom'
import { setGlobalState, useGlobalState, truncate } from '../store'
import Identicon from 'react-identicons'
import { Header } from '../components'

const RecentConversations = () => {
  const [recentConversations] = useGlobalState('recentConversations')
  const [currentUser] = useGlobalState('currentUser')

  useEffect(() => {
    getConversations().then((users) =>
      setGlobalState('recentConversations', users)
    )
  }, [currentUser])

  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-[#D2C1B6] via-white to-[#456882]/10 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B3C53]/5 to-[#234C6A]/5"></div>
        <div className="w-full sm:w-3/5 mx-auto mt-8 px-3 relative z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#456882]/20 p-8">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#1B3C53] to-[#234C6A] bg-clip-text text-transparent mb-8">Your Recent Chats</h1>
            <div className="space-y-3">
              {recentConversations?.map((conversation, index) => (
                <Link
                  className="flex items-center space-x-3 w-full my-3 border-b border-b-[#456882]/10 p-4 bg-white/50 rounded-2xl hover:bg-white/70 transition-all duration-300 shadow-sm hover:shadow-md border border-[#456882]/10"
                  to={`/chats/${conversation.conversationWith.uid}`}
                  key={index}
                >
                  <Identicon
                    className="rounded-full shadow-sm bg-[#D2C1B6]/30"
                    string={conversation.conversationWith.uid}
                    size={40}
                  />
                  <p className="text-lg font-semibold text-[#1B3C53]">{truncate(conversation.conversationWith.name, 4, 4, 11)}</p>
                </Link>
              ))}
              {recentConversations?.length < 1 && (
                <div className="text-center py-12">
                  <p className="text-xl text-[#456882]/60 italic">You don't have any recent chats</p>
                  <p className="text-sm text-[#456882]/40 mt-2">Start a conversation to see it here!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RecentConversations