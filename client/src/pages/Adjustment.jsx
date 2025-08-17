// ...existing code...
<p
  className="text-slate-400 text-sm line-clamp-2 group-hover:text-slate-300 transition-colors duration-200"
  style={{ cursor: "pointer" }}
>
  {post.description}
</p>

{/* Always visible on mobile/low-end devices */}
<div className="flex items-center gap-4 mt-3 sm:hidden">
  <button
    className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-red-400 transition-all duration-200"
    onClick={(e) => {
      e.stopPropagation();
      handleLikePost(post.user?._id);
    }}
  >
    {storeId === post.user?._id ? (
      <Loader2 className="h-5 w-5 animate-spin" />
    ) : (
      <Heart className="w-5 h-5" />
    )}
  </button>
  <button
    className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-blue-400 transition-all duration-200"
    onClick={(e) => {
      e.stopPropagation();
      handleOpenViewSource(index);
    }}
  >
    <Eye className="w-5 h-5" />
  </button>
  <button
    className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-slate-900 transition-all duration-200"
    onClick={(e) => {
      e.stopPropagation();
      toast.success("Feature on the Way..!");
    }}
  >
    <Share2 className="w-5 h-5" />
  </button>
</div>
// ...existing code...