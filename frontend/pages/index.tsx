import { useState } from 'react';
import Head from 'next/head';
import { VideoForm } from '@/components/VideoForm';
import { VideoSummary } from '@/components/VideoSummary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Home() {
  const [videoId, setVideoId] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (id: string) => {
    setLoading(true);
    setError('');
    setSummary('');
    setVideoId(id);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/summary/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching summary: ${response.status}`);
      }
      
      const data = await response.json();
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || 'Error fetching summary');
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>YouTube Video Summarizer</title>
        <meta name="description" content="Summarize YouTube videos using AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">YouTube Video Summarizer</h1>
        
        <VideoForm onSubmit={handleSubmit} />
        
        {loading && (
          <div className="my-8 flex justify-center">
            <LoadingSpinner />
            <p className="ml-2">Generating summary...</p>
          </div>
        )}
        
        {error && (
          <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {summary && !loading && (
          <VideoSummary videoId={videoId} summary={summary} />
        )}
      </main>
    </>
  );
}
