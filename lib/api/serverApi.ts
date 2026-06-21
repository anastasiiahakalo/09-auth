import { cookies } from 'next/headers';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import { api } from './api';

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export const fetchNotes = async (
  search: string = '',
  page: number = 1,
  tag?: string
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = {
    search,
    page,
    perPage: 12,
  };

  if (tag) {
    params.tag = tag;
  }

  const { data } = await api.get<NotesResponse>('/notes', {
    params,
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return data;
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | null>('/auth/session', {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return data ?? null;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me', {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return data;
};