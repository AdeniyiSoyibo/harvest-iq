export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-end gap-1 h-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-1.5 bg-sky-400 rounded-full wave-bar"
            style={{ height: "100%", animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}
