import {
  Badge,
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tooltip,
} from '@nextui-org/react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useLocation } from 'react-router-dom';
import { appVersion, serverOriginUrl } from '@web/utils/env';
import { useEffect, useState } from 'react';

const navbarItemLink = [
  {
    href: '/app/accounts',
    name: '账号管理',
  },
  {
    href: '/app/feeds',
    name: '公众号源',
  },
];

const Nav = () => {
  const { pathname } = useLocation();
  const [releaseVersion, setReleaseVersion] = useState(appVersion);

  useEffect(() => {
    fetch('https://api.github.com/repos/cooderl/wewe-rss/releases/latest')
      .then((res) => res.json())
      .then((data) => {
        setReleaseVersion(data.name.replace('v', ''));
      });
  }, []);

  const isFoundNewVersion = releaseVersion > appVersion;
  console.log('isFoundNewVersion: ', isFoundNewVersion);

  return (
    <div className="nav-brutal py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            width={28}
            alt="WeWe RSS"
            src={
              serverOriginUrl
                ? `${serverOriginUrl}/favicon.ico`
                : 'https://r2-assets.111965.xyz/wewe-rss.png'
            }
          />
          <Link href="/" className="font-mono font-bold text-xl text-gray-900 hover:text-blue-600">
            WeWe RSS
          </Link>
        </div>
        <div className="hidden sm:flex gap-6">
          {navbarItemLink.map((item) => {
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`font-mono font-bold transition-all duration-100 ${pathname.startsWith(item.href) ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'}`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Nav;