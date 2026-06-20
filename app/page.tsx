import Link from 'next/link';
import css from './Home.module.css';

export default function Home() {
  return (
    <main className={css.main}>
      <h1 className={css.title}>NoteHub</h1>
      <p className={css.description}>Your personal notes manager.</p>
      <Link href="/notes/filter/all" className={css.button}>
        Go to notes
      </Link>
    </main>
  );
}