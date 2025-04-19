import React from 'react';

interface VideoSummaryProps {
  videoId: string;
  summary: string;
}

export const VideoSummary: React.FC<VideoSummaryProps> = ({ videoId, summary }) => {
  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="mb-6">
        <iframe
          className="w-full aspect-video rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <div className="prose max-w-none">
          {summary.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
