import { permanentRedirect } from 'next/navigation';

export default function QuizRedirectPage({ params }: { params: { slug: string } }) {
  permanentRedirect(`/quizzes/${params.slug}`);
}
