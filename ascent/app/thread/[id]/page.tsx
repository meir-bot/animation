import { ThreadView } from '@/components/chat/ThreadView'

export default async function ThreadPage({ params }: PageProps<'/thread/[id]'>) {
  const { id } = await params
  return <ThreadView threadId={id} />
}
