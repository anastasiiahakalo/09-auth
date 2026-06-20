'use client';

import type { Note } from '@/types/note';
import css from './NoteDetails.module.css';

type Props = {
  note: Note;
};

export default function NoteDetailsClient({ note }: Props) {
  return (
    <main className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </div>
    </main>
  );
}