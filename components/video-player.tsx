const VideoPlayer = (props: { libraryId?: string; videoId?: string }) => {
  const {
    libraryId = '515933',
    videoId = 'b42c8ac6-8576-49b6-a2f3-b0f13dcb3f95',
  } = props;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
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
