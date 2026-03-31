import { Link } from '@nextui-org/react';
import { GitHubIcon } from '@web/components/GitHubIcon';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-8 py-24">
        <div className="flex justify-start mb-12">
          <Link
            href="/"
            className="btn-brutal btn-brutal-secondary px-6 py-3 text-base flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/>
              <path d="m12 19-7-7 7-7"/>
            </svg>
            回到主页
          </Link>
        </div>
        <div className="text-center mb-24">
          <h1 className="text-7xl font-mono font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            公众号订阅&AI检索
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-mono leading-loose mb-12">
            一个简洁高效的微信公众号文章订阅和搜索工具，<br/>
            支持 Agent 检索与提醒，让你不错过任何关键信息
          </p>
          <Link
            href="/app/accounts"
            className="btn-brutal btn-brutal-primary px-12 py-5 text-lg inline-block"
          >
            开始使用 →
          </Link>
        </div>

        <div className="card-brutal p-12 mb-24 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="bg-blue-600 text-white px-5 py-2 font-mono font-bold text-sm tracking-wide">
              🎉 NEW
            </div>
            <h2 className="text-2xl font-mono font-bold text-gray-900">安装到 Claude Code & OpenClaw</h2>
          </div>
          <p className="font-mono text-gray-500 text-center text-base mb-10 leading-relaxed">
            复制以下链接提供给 Agent 即可自动安装
          </p>
          <div className="flex justify-center items-center gap-6 mb-10">
            <a
              href="https://github.com/cooderl/wewe-rss"
              target="_blank"
              className="btn-brutal btn-brutal-primary px-8 py-4 flex items-center gap-3 text-base"
            >
              <GitHubIcon size={20} />
              GitHub 项目链接
            </a>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = 'https://github.com/cooderl/wewe-rss/archive/refs/heads/main.zip';
                link.download = 'wewe-rss.zip';
                link.click();
              }}
              className="btn-brutal btn-brutal-secondary px-8 py-4 flex items-center gap-3 text-base"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              下载skill
            </button>
          </div>
          <p className="font-mono text-sm text-gray-400 text-center">
            如果链接无法访问，点击下载按钮获取项目文件
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-24">
          <div className="card-brutal p-10 hover:shadow-[8px_8px_0px_#3B82F6] transition-all duration-200">
            <div className="text-5xl mb-8">📱</div>
            <h3 className="text-xl font-mono font-bold text-gray-900 mb-4">账号管理</h3>
            <p className="text-gray-500 font-mono text-base leading-relaxed">
              添加多个微信公众号，轻松管理订阅源
            </p>
          </div>
          <div className="card-brutal p-10 hover:shadow-[8px_8px_0px_#3B82F6] transition-all duration-200">
            <div className="text-5xl mb-8">🔍</div>
            <h3 className="text-xl font-mono font-bold text-gray-900 mb-4">智能搜索</h3>
            <p className="text-gray-500 font-mono text-base leading-relaxed">
              快速搜索已订阅公众号的文章内容，支持关键词检索
            </p>
          </div>
          <div className="card-brutal p-10 hover:shadow-[8px_8px_0px_#3B82F6] transition-all duration-200">
            <div className="text-5xl mb-8">🤖</div>
            <h3 className="text-xl font-mono font-bold text-gray-900 mb-4">Agent支持</h3>
            <p className="text-gray-500 font-mono text-base leading-relaxed">
              支持Skill形式调用，调用AI定期检索公众号关键信息
            </p>
          </div>
        </div>

        <div className="card-brutal p-12">
          <h2 className="text-2xl font-mono font-bold text-gray-900 mb-12 text-center">功能特性</h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            <div className="flex items-center gap-5 p-5 bg-gray-50 border-2 border-gray-900">
              <span className="text-green-600 text-2xl">✓</span>
              <span className="font-mono text-gray-700 text-base">支持添加多个公众号</span>
            </div>
            <div className="flex items-center gap-5 p-5 bg-gray-50 border-2 border-gray-900">
              <span className="text-green-600 text-2xl">✓</span>
              <span className="font-mono text-gray-700 text-base">自动同步公众号文章</span>
            </div>
            <div className="flex items-center gap-5 p-5 bg-gray-50 border-2 border-gray-900">
              <span className="text-green-600 text-2xl">✓</span>
              <span className="font-mono text-gray-700 text-base">生成 RSS 订阅源</span>
            </div>
            <div className="flex items-center gap-5 p-5 bg-gray-50 border-2 border-gray-900">
              <span className="text-green-600 text-2xl">✓</span>
              <span className="font-mono text-gray-700 text-base">支持导出 OPML 文件</span>
            </div>
            <div className="flex items-center gap-5 p-5 bg-gray-50 border-2 border-gray-900">
              <span className="text-green-600 text-2xl">✓</span>
              <span className="font-mono text-gray-700 text-base">无需认证即可使用</span>
            </div>
            <div className="flex items-center gap-5 p-5 bg-gray-50 border-2 border-gray-900">
              <span className="text-green-600 text-2xl">✓</span>
              <span className="font-mono text-gray-700 text-base">纯本地运行</span>
            </div>
            <div className="flex items-center gap-5 p-6 bg-blue-50 border-2 border-blue-600 md:col-span-2">
              <span className="text-blue-600 text-2xl">✓</span>
              <span className="font-mono text-blue-700 text-base font-bold">支持以Skill形式供agent调用</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;