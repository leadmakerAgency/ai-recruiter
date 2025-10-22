// src/app/[slug]/page.tsx
import InterviewFlow from "@/components/InterviewFlow";
import { slugAgentMap } from "@/lib/utils";

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const agentId = slugAgentMap[slug];

  if (!agentId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg">No agent mapped for "{slug}"</p>
      </div>
    );
  }

  return <InterviewFlow slug={slug} agentId={agentId} />;
}
