import type { PaginationParams } from './pagination-params';
import './Pagination.css'

type PaginationProps = {
    paginationParams: PaginationParams;
    onPageChange: (page: number) => void;
}

const Pagination = ({
    paginationParams,
    onPageChange,
} : PaginationProps) => {

  const pageCount = Math.ceil(paginationParams.totalItems / paginationParams.pageSize);
  const canGoPrevious = paginationParams.pageNumber > 1;
  const canGoNext = paginationParams.pageNumber < pageCount;

  return (
    <div className="pagination">
        <a className="pagination-link" href='#' onClick={() => { if (canGoPrevious) onPageChange(1) }}>&lt;&lt;</a>
        <a className="pagination-link" href='#' onClick={() => { if (canGoPrevious) onPageChange(paginationParams.pageNumber - 1) }}>&lt;</a>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => {
            return <a className="pagination-link" href="#" key={page} onClick={() => onPageChange(page)}>{page}</a>
        })}
        <a className="pagination-link"  href='#' onClick={() => { if (canGoNext) onPageChange(paginationParams.pageNumber + 1) }}>&gt;</a>
        <a className="pagination-link" href='#' onClick={() => { if (canGoNext) onPageChange(pageCount) }}>&gt;&gt;</a>
    </div>
  )
}
export default Pagination;