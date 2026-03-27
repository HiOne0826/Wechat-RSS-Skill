import { Toaster } from 'sonner';
import { Outlet } from 'react-router-dom';
import { Link } from '@nextui-org/react';
import { GitHubIcon } from '@web/components/GitHubIcon';

import Nav from '../components/Nav';

export function BaseLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-hidden">
        <Nav></Nav>
        <div className="bg-white border-b-2 border-gray-900 py-3 px-4">
          <div className="max-w-7xl mx-auto flex justify-center items-center gap-4">
            <div className="bg-blue-600 text-white px-4 py-2 font-mono font-bold text-sm shadow-[4px_4px_0px_#1A1A1A]">
              🎉 NEW
            </div>
            <div className="font-mono font-bold text-gray-900 text-lg">
              支持安装到 Claude Code & OpenClaw!
            </div>
            <div className="h-6 w-px bg-gray-900"></div>
            <div className="font-mono text-sm text-gray-600">
              复制链接提供给 Agent 即可安装：
            </div>
            <a
              href="https://github.com/cooderl/wewe-rss"
              target="_blank"
              className="bg-gray-900 text-white px-4 py-2 font-mono font-bold text-sm border-2 border-gray-900 hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_#3B82F6] hover:shadow-[2px_2px_0px_#3B82F6] hover:-translate-x-[2px] hover:-translate-y-[2px]"
            >
              GitHub 项目链接
            </a>
          </div>
        </div>
        <div className="h-[calc(100vh-160px)] max-w-[1280px] mx-auto pb-6">
          <Outlet />
        </div>
      </main>
      <footer className="bg-gray-100 border-t-2 border-gray-900 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-4">
          <div className="font-mono text-sm">
            特别鸣谢 WeWe RSS
          </div>
          <Link
            href="https://github.com/cooderl/wewe-rss"
            target="_blank"
            className="text-gray-900 hover:text-blue-600"
          >
            <GitHubIcon />
          </Link>
        </div>
      </footer>
      <Toaster richColors position="top-right" />
    </div>
  );
}