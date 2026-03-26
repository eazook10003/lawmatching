import { supabase } from '../../../lib/supabase'
import ChatBox from './ChatBox'

export default async function ChatPage({
  params,
}: {
  params: Promise<{ engagementId: string }>
}) {
  const { engagementId } = await params

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('engagement_id', engagementId)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-1">채팅</h1>
      <p className="text-sm text-zinc-400 mb-8">의뢰인과 변호사 간의 대화</p>
      <ChatBox engagementId={engagementId} initialMessages={messages || []} />
    </div>
  )
}
