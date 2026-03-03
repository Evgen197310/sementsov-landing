export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-[#1e3a51] border-t-[#c9a962] rounded-full animate-spin" />
        <p className="text-[#8b9caa] text-sm">Загрузка...</p>
      </div>
    </div>
  );
}
