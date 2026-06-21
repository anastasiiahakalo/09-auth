'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import css from './NotesPage.module.css';

type Props = {
  tag?: string;
};

export default function NotesClient({ tag }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', search, page, tag],
    queryFn: () => fetchNotes(search, page, tag),
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={handleSearch} />

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found.</p>
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          forcePage={page - 1}
          onPageChange={({ selected }) => setPage(selected + 1)}
        />
      )}
    </main>
  );
}