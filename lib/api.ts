import axios from 'axios';
import type { Note } from '@/types/note';

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

export type CreateNoteData = {
  title: string;
  content: string;
  tag: string;
};

export const fetchNotes = async (
  search: string = '',
  page: number = 1,
  tag?: string
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { search, page };

  if (tag) params.tag = tag;

  const { data } = await api.get<NotesResponse>('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (body: CreateNoteData): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', body);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};