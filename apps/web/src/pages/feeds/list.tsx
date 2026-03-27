import { FC, useMemo } from 'react';
import { trpc } from '@web/utils/trpc';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';

const ArticleList: FC = () => {
  const { id } = useParams();

  const mpId = id || '';

  const { data, fetchNextPage, isLoading, hasNextPage } = trpc.article.list.useInfiniteQuery(
    {
      limit: 20,
      mpId: mpId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const items = useMemo(() => {
    const items = data
      ? data.pages.reduce((acc, page) => [...acc, ...page.items], [] as any[])
      : [];

    return items;
  }, [data]);

  return (
    <div className="card-brutal">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="font-mono font-bold p-4 text-left">标题</th>
              <th className="font-mono font-bold p-4 text-left w-64">发布时间</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-4 text-center">暂无数据</td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={2} className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-gray-300 hover:bg-gray-100">
                  <td className="p-4">
                    <a
                      href={`https://mp.weixin.qq.com/s/${item.id}`}
                      target="_blank"
                      className="link-brutal block"
                    >
                      {item.title}
                    </a>
                  </td>
                  <td className="p-4 font-mono text-sm">
                    {dayjs(item.publishTime * 1e3).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {hasNextPage && !isLoading && (
        <div className="flex justify-center mt-4">
          <button
            className="btn-brutal btn-brutal-secondary px-6 py-3"
            onClick={() => fetchNextPage()}
            disabled={isLoading}
          >
            {isLoading ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleList;