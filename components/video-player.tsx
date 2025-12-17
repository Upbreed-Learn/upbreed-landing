import { cn } from '@/lib/utils';

const VideoPlayer = (props: {
  libraryId?: string;
  videoId?: string;
  className?: string;
}) => {
  const {
    libraryId = '515933',
    videoId = 'b42c8ac6-8576-49b6-a2f3-b0f13dcb3f95',
    className,
  } = props;

  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-xl',
        className,
      )}
    >
      <iframe
        src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
};

export default VideoPlayer;
