export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#1e3a51] border-t-[#c9a962] rounded-full animate-spin" />
        <p className="text-[#8b9caa] text-sm">Загрузка...</p>
      </div>
    </div>
  );
}
