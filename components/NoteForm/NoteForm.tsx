'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

const tags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    },
  });

  const formAction = (formData: FormData) => {
    const title = String(formData.get('title') ?? '');
    const content = String(formData.get('content') ?? '');
    const tag = String(formData.get('tag') ?? 'Todo');

    mutation.mutate({ title, content, tag });
  };

  return (
    <form className={css.form} action={formAction}>
      <input
        className={css.input}
        name="title"
        placeholder="Title"
        defaultValue={draft.title}
        onChange={(e) => setDraft({ title: e.target.value })}
      />

      <textarea
        className={css.textarea}
        name="content"
        placeholder="Content"
        defaultValue={draft.content}
        onChange={(e) => setDraft({ content: e.target.value })}
      />

      <select
        className={css.select}
        name="tag"
        defaultValue={draft.tag}
        onChange={(e) => setDraft({ tag: e.target.value })}
      >
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <div className={css.actions}>
        <button className={css.submitButton} type="submit" disabled={mutation.isPending}>
          Create note
        </button>

        <button className={css.cancelButton} type="button" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}