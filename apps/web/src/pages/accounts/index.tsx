import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { PlusIcon } from '@web/components/PlusIcon';
import dayjs from 'dayjs';
import { StatusDropdown } from '@web/components/StatusDropdown';
import { trpc } from '@web/utils/trpc';
import { statusMap } from '@web/constants';
import { useEffect, useState } from 'react';

const AccountPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);

  const { refetch, data, isFetching } = trpc.account.list.useQuery({});

  const queryUtils = trpc.useUtils();

  const { mutateAsync: updateAccount } = trpc.account.edit.useMutation({});

  const { mutateAsync: deleteAccount } = trpc.account.delete.useMutation({});

  const { mutateAsync: addAccount } = trpc.account.add.useMutation({});

  const { mutateAsync, data: loginData } =
    trpc.platform.createLoginUrl.useMutation({
      onSuccess(data) {
        if (data.uuid) {
          setCount(60);
        }
      },
    });

  const { data: loginResult } = trpc.platform.getLoginResult.useQuery(
    {
      id: loginData?.uuid ?? '',
    },
    {
      refetchIntervalInBackground: false,
      enabled: !!loginData?.uuid,
      async onSuccess(data) {
        if (data.vid && data.token) {
          const name = data.username!;
          await addAccount({ id: `${data.vid}`, name, token: data.token });

          setIsOpen(false);
          toast.success('添加成功', {
            description: `用户名：${name}(${data.vid})`,
          });
          refetch();
        } else if (data.message) {
          toast.error(`登录失败: ${data.message}`);
        }
      },
    },
  );

  useEffect(() => {
    let timerId;
    if (count > 0 && isOpen) {
      timerId = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    }
    return () => timerId && clearTimeout(timerId);
  }, [count, isOpen]);

  const openModal = () => {
    setIsOpen(true);
    mutateAsync();
  };

  const closeModal = async () => {
    setIsOpen(false);
    await queryUtils.platform.getLoginResult.cancel();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="title-brutal">账号管理</h1>
        <div className="font-mono font-bold">共{data?.items.length || 0}个账号</div>
      </div>
      <div className="mb-6">
        <button
          className="btn-brutal btn-brutal-primary px-6 py-3 flex items-center justify-center gap-2"
          onClick={openModal}
        >
          <PlusIcon />
          添加微信账号
        </button>
      </div>
      <div className="card-brutal">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="font-mono font-bold p-4 text-left">ID</th>
                <th className="font-mono font-bold p-4 text-left">用户名</th>
                <th className="font-mono font-bold p-4 text-left">状态</th>
                <th className="font-mono font-bold p-4 text-left">更新时间</th>
                <th className="font-mono font-bold p-4 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">暂无数据</td>
                </tr>
              ) : isFetching ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : (
                data?.items.map((item) => {
                  const isBlocked = data?.blocks.includes(item.id);

                  return (
                    <tr key={item.id} className="border-b border-gray-300 hover:bg-gray-100">
                      <td className="p-4">{item.id}</td>
                      <td className="p-4">{item.name}</td>
                      <td className="p-4">
                        {isBlocked ? (
                          <span className="tag-brutal tag-brutal-inactive">
                            今日小黑屋
                          </span>
                        ) : (
                          <span className={`tag-brutal ${statusMap[item.status].color === 'success' ? 'tag-brutal-active' : 'tag-brutal-inactive'}`}>
                            {statusMap[item.status].label}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {dayjs(item.updatedAt).format('YYYY-MM-DD')}
                      </td>
                      <td className="p-4 flex gap-2">
                        <StatusDropdown
                          value={item.status}
                          onChange={(value) => {
                            updateAccount({
                              id: item.id,
                              data: { status: value },
                            }).then(() => {
                              toast.success('更新成功!');
                              refetch();
                            });
                          }}
                        ></StatusDropdown>

                        <button
                          className="btn-brutal bg-red-600 text-white px-4 py-2 text-sm"
                          onClick={() => {
                            deleteAccount(item.id).then(() => {
                              toast.success('删除成功!');
                              refetch();
                            });
                          }}
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  );
                }) || []
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card-brutal max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="subtitle-brutal">添加微信账号</h2>
              <button
                className="text-gray-900 hover:text-blue-600"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className="m-auto pb-8 text-center">
              {loginData ? (
                <div>
                  <div className="relative">
                    {loginResult?.message && (
                      <div className="absolute top-0 left-0 bottom-0 right-0 bg-white bg-opacity-75 flex justify-center items-center">
                        <div className="text-xl">
                          {loginResult?.message}
                        </div>
                      </div>
                    )}
                    <QRCodeSVG size={150} value={loginData?.scanUrl} />
                  </div>
                  <div className="mt-4 font-mono">
                    微信扫码登录{' '}
                    {!loginResult?.message && count > 0 && (
                      <span className="text-red-600">({count}s)</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="m-auto flex justify-center items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                  <span className="font-mono">二维码加载中</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
