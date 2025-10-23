// src/app/[slug]/page.tsx
import InterviewFlow from '@/components/InterviewFlow';

// Map slugs to agent IDs
const agentIdMap: { [key: string]: string } = {
  tammy: process.env.NEXT_PUBLIC_TAMMY_AGENT_ID || '',
  edson: process.env.NEXT_PUBLIC_EDSON_AGENT_ID || '',
  griffin: process.env.NEXT_PUBLIC_GRIFFIN_AGENT_ID || '',
};

export default async function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agentId = agentIdMap[slug];

  if (!agentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Agent not found</h1>
      </div>
    );
  }

  return <InterviewFlow slug={slug} agentId={agentId} />;
}

export async function generateStaticParams() {
  return [
    { slug: 'tammy' },
    { slug: 'edson' },
    { slug: 'griffin' },
  ];
}
