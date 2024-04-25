const Loading = () => {
  return (
    <div className="relative mt-40">
      <div className="h-32 w-32 rounded-full border-t-8 border-b-8 border-gray-200"></div>
      <div className="absolute top-0 left-0 h-32 w-32 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
      </div>
    </div>
  );
};

export default Loading;