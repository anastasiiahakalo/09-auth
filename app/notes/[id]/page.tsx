import type { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

const ogImage = {
  url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
  width: 1200,
  height: 630,
  alt: 'NoteHub',
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  const description =
    note.content.length > 120
      ? `${note.content.slice(0, 120)}...`
      : note.content;

  return {
    title: `${note.title} | NoteHub`,
    description,
    openGraph: {
      title: `${note.title} | NoteHub`,
      description,
      url: `https://notehub.com/notes/${id}`,
      images: [ogImage],
    },
  };
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return <NoteDetailsClient note={note} />;
}