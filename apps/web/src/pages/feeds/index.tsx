import { PlusIcon } from '@web/components/PlusIcon';
import { trpc } from '@web/utils/trpc';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { serverOriginUrl } from '@web/utils/env';
import ArticleList from './list';

const Feeds = () => {
  const { id } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const { refetch: refetchFeedList, data: feedData } = trpc.feed.list.useQuery(
    {},
    {
      refetchOnWindowFocus: true,
    },
  );

  const navigate = useNavigate();

  const queryUtils = trpc.useUtils();

  const { mutateAsync: getMpInfo, isLoading: isGetMpInfoLoading } =
    trpc.platform.getMpInfo.useMutation({});
  const { mutateAsync: updateMpInfo } = trpc.feed.edit.useMutation({});

  const { mutateAsync: addFeed, isLoading: isAddFeedLoading } =
    trpc.feed.add.useMutation({});
  const { mutateAsync: refreshMpArticles, isLoading: isGetArticlesLoading } =
    trpc.feed.refreshArticles.useMutation();
  const {
    mutateAsync: getHistoryArticles,
    isLoading: isGetHistoryArticlesLoading,
  } = trpc.feed.getHistoryArticles.useMutation();

  const { data: inProgressHistoryMp, refetch: refetchInProgressHistoryMp } =
    trpc.feed.getInProgressHistoryMp.useQuery(undefined, {
      refetchOnWindowFocus: true,
      refetchInterval: 10 * 1e3,
      refetchOnMount: true,
      refetchOnReconnect: true,
    });

  const { data: isRefreshAllMpArticlesRunning } =
    trpc.feed.isRefreshAllMpArticlesRunning.useQuery();

  const { mutateAsync: deleteFeed, isLoading: isDeleteFeedLoading } =
    trpc.feed.delete.useMutation({});

  const [wxsLink, setWxsLink] = useState('');

  const [currentMpId, setCurrentMpId] = useState(id || '');

  const handleConfirm = async () => {
    console.log('wxsLink', wxsLink);
    // TODO show operation in progress
    const wxsLinks = wxsLink.split('\n').filter((link) => link.trim() !== '');
    for (const link of wxsLinks) {
      console.log('add wxsLink', link);
      const res = await getMpInfo({ wxsLink: link });
      if (res[0]) {
        const item = res[0];
        await addFeed({
          id: item.id,
          mpName: item.name,
          mpCover: item.cover,
          mpIntro: item.intro,
          updateTime: item.updateTime,
          status: 1,
        });
        await refreshMpArticles({ mpId: item.id });
        toast.success('添加成功', {
          description: `公众号 ${item.name}`,
        });
        await queryUtils.article.list.reset();
      } else {
        toast.error('添加失败', { description: '请检查链接是否正确' });
      }
    }
    refetchFeedList();
    setWxsLink('');
    setIsOpen(false);
  };

  const isActive = (key: string) => {
    return currentMpId === key;
  };

  const currentMpInfo = useMemo(() => {
    return feedData?.items.find((item) => item.id === currentMpId);
  }, [currentMpId, feedData?.items]);

  const handleExportOpml = async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!feedData?.items?.length) {
      console.warn('没有订阅源');
      return;
    }

    let opmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <opml version="2.0">
      <head>
        <title>WeWeRSS 所有订阅源</title>
      </head>
      <body>
    `;

    feedData?.items.forEach((sub) => {
      opmlContent += `    <outline text="${sub.mpName}" type="rss" xmlUrl="${window.location.origin}/feeds/${sub.id}.atom" htmlUrl="${window.location.origin}/feeds/${sub.id}.atom"/>
`;
    });

    opmlContent += `    </body>
    </opml>`;

    const blob = new Blob([opmlContent], { type: 'text/xml;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'WeWeRSS-All.opml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="h-full flex justify-between">
        <div className="w-64 p-4 h-full bg-gray-50 border-r-2 border-gray-900">
          <div className="pb-4 flex justify-between items-center">
            <button
              className="btn-brutal btn-brutal-primary px-4 py-2 text-sm flex items-center gap-2"
              onClick={openModal}
            >
              <PlusIcon />
              添加
            </button>
            <div className="font-mono font-bold text-sm">
              共{feedData?.items.length || 0}个订阅
            </div>
          </div>

          {feedData?.items ? (
            <div className="overflow-y-auto h-[calc(100vh-260px)]">
              <div className="mb-2">
                <a
                  href={`/feeds`}
                  className={`block p-2 font-mono font-bold transition-all duration-100 ${isActive('') ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentMpId('');
                  }}
                >
                  全部
                </a>
              </div>
              <div className="border-t-2 border-gray-900 pt-2">
                {feedData?.items.map((item) => {
                  return (
                    <a
                      key={item.id}
                      href={`/feeds/${item.id}`}
                      className={`block p-2 font-mono transition-all duration-100 ${isActive(item.id) ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentMpId(item.id);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <img src={item.mpCover} alt={item.mpName} className="w-6 h-6 rounded-full" />
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.mpName}</span>
                      </div>
                    </a>
                  );
                }) || []}
              </div>
            </div>
          ) : (
            <div className="font-mono text-center py-4">暂无订阅</div>
          )}
        </div>
        <div className="flex-1 h-full flex flex-col">
          <div className="p-4 pb-0 flex justify-between items-center">
            <h3 className="subtitle-brutal flex-1 overflow-hidden text-ellipsis break-keep text-nowrap pr-1">
              {currentMpInfo?.mpName || '全部'}
            </h3>
            {currentMpInfo ? (
              <div className="flex items-center gap-4 text-sm font-mono">
                <div>
                  最后更新时间:
                  {dayjs(currentMpInfo.syncTime * 1e3).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )}
                </div>
                <div className="h-6 w-px bg-gray-900"></div>
                <a
                  href="#"
                  className={`link-brutal ${isGetArticlesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={async (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (isGetArticlesLoading) return;
                    await refreshMpArticles({ mpId: currentMpInfo.id });
                    await refetchFeedList();
                    await queryUtils.article.list.reset();
                  }}
                >
                  {isGetArticlesLoading ? '更新中...' : '立即更新'}
                </a>
                <div className="h-6 w-px bg-gray-900"></div>
                {currentMpInfo.hasHistory === 1 && (
                  <>
                    <a
                      href="#"
                      className={`link-brutal ${((inProgressHistoryMp?.id ? inProgressHistoryMp?.id !== currentMpInfo.id : false) || isGetHistoryArticlesLoading || isGetArticlesLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={async (ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        if ((inProgressHistoryMp?.id ? inProgressHistoryMp?.id !== currentMpInfo.id : false) || isGetHistoryArticlesLoading || isGetArticlesLoading) return;

                        if (inProgressHistoryMp?.id === currentMpInfo.id) {
                          await getHistoryArticles({
                            mpId: '',
                          });
                        } else {
                          await getHistoryArticles({
                            mpId: currentMpInfo.id,
                          });
                        }

                        await refetchInProgressHistoryMp();
                      }}
                    >
                      {inProgressHistoryMp?.id === currentMpInfo.id
                        ? `停止获取历史文章`
                        : `获取历史文章`}
                    </a>
                    <div className="h-6 w-px bg-gray-900"></div>
                  </>
                )}

                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={currentMpInfo?.status === 1}
                      onChange={async (e) => {
                        await updateMpInfo({
                          id: currentMpInfo.id,
                          data: {
                            status: e.target.checked ? 1 : 0,
                          },
                        });

                        await refetchFeedList();
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-2">定时更新</span>
                  </label>
                </div>
                <div className="h-6 w-px bg-gray-900"></div>
                <a
                  href="#"
                  className={`text-red-600 font-mono font-bold ${isDeleteFeedLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={async (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (isDeleteFeedLoading) return;

                    if (window.confirm('确定删除吗？')) {
                      await deleteFeed(currentMpInfo.id);
                      navigate('/feeds');
                      await refetchFeedList();
                    }
                  }}
                >
                  删除
                </a>

                <div className="h-6 w-px bg-gray-900"></div>
                <a
                  href={`${serverOriginUrl}/feeds/${currentMpInfo.id}.atom`}
                  target="_blank"
                  className="link-brutal"
                >
                  RSS
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-4 font-mono">
                <a
                  href="#"
                  className={`link-brutal ${(isRefreshAllMpArticlesRunning || isGetArticlesLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={async (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (isRefreshAllMpArticlesRunning || isGetArticlesLoading) return;
                    await refreshMpArticles({});
                    await refetchFeedList();
                    await queryUtils.article.list.reset();
                  }}
                >
                  {isRefreshAllMpArticlesRunning || isGetArticlesLoading
                    ? '更新中...'
                    : '更新全部'}
                </a>
                <a
                  href="#"
                  className="link-brutal"
                  onClick={handleExportOpml}
                >
                  导出OPML
                </a>
                <div className="h-6 w-px bg-gray-900"></div>
                <a
                  href={`${serverOriginUrl}/feeds/all.atom`}
                  target="_blank"
                  className="link-brutal"
                >
                  RSS
                </a>
              </div>
            )}
          </div>
          <div className="p-2 overflow-y-auto">
            <ArticleList></ArticleList>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card-brutal max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="subtitle-brutal">添加公众号源</h2>
              <button
                className="text-gray-900 hover:text-blue-600"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <label className="block font-mono font-bold mb-2">分享链接</label>
              <textarea
                value={wxsLink}
                onChange={(e) => setWxsLink(e.target.value)}
                autoFocus
                placeholder="输入公众号文章分享链接，一行一条，如 https://mp.weixin.qq.com/s/xxxxxx https://mp.weixin.qq.com/s/xxxxxx"
                className="input-brutal w-full h-32"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="btn-brutal btn-brutal-secondary px-6 py-3"
                onClick={closeModal}
              >
                取消
              </button>
              <button
                className="btn-brutal btn-brutal-primary px-6 py-3"
                disabled={
                  !wxsLink.startsWith('https://mp.weixin.qq.com/s/') ||
                  isAddFeedLoading ||
                  isGetMpInfoLoading ||
                  isGetArticlesLoading
                }
                onClick={handleConfirm}
              >
                {isAddFeedLoading || isGetMpInfoLoading || isGetArticlesLoading ? '添加中...' : '确定'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feeds;