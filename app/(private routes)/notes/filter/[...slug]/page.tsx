import type { Metadata } from 'next';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

const ogImage = {
  url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
  width: 1200,
  height: 630,
  alt: 'NoteHub',
};

type Props = {
  params: Promise<{
    slug?: string[];
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug?.[0] ?? 'all';

  const title =
    currentTag === 'all'
      ? 'All notes | NoteHub'
      : `${currentTag} notes | NoteHub`;

  const description =
    currentTag === 'all'
      ? 'Browse all notes in NoteHub.'
      : `Browse notes filtered by ${currentTag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${currentTag}`,
      images: [ogImage],
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;

  const currentTag = slug?.[0] ?? 'all';
  const tag = currentTag === 'all' ? undefined : currentTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, tag],
    queryFn: () => fetchNotes('', 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}