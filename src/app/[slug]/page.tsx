import InterviewSetup from '@/components/InterviewSetup';

export default async function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  await params; // Just await to satisfy Next.js 15
  
  return <InterviewSetup />;
}

export async function generateStaticParams() {
  return [
    { slug: 'tammy' },
    { slug: 'edson' },
    { slug: 'griffin' },
  ];
}
