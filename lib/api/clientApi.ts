import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

export type CreateNoteData = {
  title: string;
  content: string;
  tag: string;
};

type AuthCredentials = {
  email: string;
  password: string;
};

type UpdateMeData = {
  username: string;
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

export const register = async (
  credentials: AuthCredentials
): Promise<User> => {
  const { data } = await api.post<User>('/auth/register', credentials);
  return data;
};

export const login = async (credentials: AuthCredentials): Promise<User> => {
  const { data } = await api.post<User>('/auth/login', credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | null>('/auth/session');
  return data ?? null;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateMe = async (body: UpdateMeData): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', body);
  return data;
};