type AdminPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function AdminPagination({ page, pageSize, total, onPageChange }: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
      <span>
        Страница {page} из {totalPages} • Всего: {total}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded border border-slate-700 bg-slate-950 px-2 py-1 disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Назад
        </button>
        <button
          type="button"
          className="rounded border border-slate-700 bg-slate-950 px-2 py-1 disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
}
