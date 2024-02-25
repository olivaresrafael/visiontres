import { useState, useEffect } from 'react'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Image from 'next/image'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import kebabCase from '@/lib/utils/kebabCase'
import { useTheme } from 'next-themes'

const LayoutWrapper = ({ children }) => {
  const { theme, resolvedTheme } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    window.addEventListener('scroll', listenToScroll)
    return () => window.removeEventListener('scroll', listenToScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height])

  const listenToScroll = () => {
    let heightToHideFrom = 200
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
    setHeight(winScroll)

    if (winScroll < heightToHideFrom) {
      isVisible && setIsVisible(false)
    } else {
      setIsVisible(true)
    }
  }

  return (
    <>
      <div className="fixed z-10 flex w-full items-center justify-between border-b-[2px] border-gray-200 border-opacity-60 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
        {isVisible && (
          <Link href="/" aria-label={siteMetadata.headerTitle} className="pl-3 pt-2">
            <Image
              src={`/static/images/logo/logo_long_${theme === 'dark' ? 'white' : 'blue'}.png`}
              alt="PanamEconomics"
              width={300}
              height={41}
            />
          </Link>
        )}

        <div className="grid hidden justify-items-center px-5 md:block">
          {siteMetadata.description.map((line) => (
            <a
              key={line}
              href={`tags/${kebabCase(line)}`}
              className="text-md w-64 px-3 text-center font-semibold text-primary-900 hover:text-primary-700 dark:text-gray-100 dark:hover:text-primary-900"
            >
              {line}
            </a>
          ))}
        </div>
        <div className="flex items-center text-base leading-5">
          <div className="hidden md:block">
            {headerNavLinks.map((link) => {
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                >
                  {link.title}
                </Link>
              )
            })}
          </div>
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
      <SectionContainer>
        <div className="flex h-screen flex-col justify-between">
          <header>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center justify-center">
                <div className="mr-3 pb-3 pt-[70px]">
                  <Image
                    src={`/static/images/logo/logo_panam_${
                      theme === 'dark' ? 'white' : 'blue'
                    }.png`}
                    alt="PanamEconomics"
                    width={300}
                    height={150}
                  />
                </div>
              </div>
            </Link>
            <div className="flex items-center justify-between border-y-[2px] border-gray-200 border-opacity-60 dark:border-gray-700">
              {siteMetadata.subtitles.map(({ title, tag }) => (
                <a
                  key={tag}
                  href={`tags/${kebabCase(tag)}`}
                  className="w-64 p-2 text-center text-sm font-semibold text-primary-900 hover:text-primary-700 dark:text-gray-100 dark:hover:text-primary-900"
                >
                  {title}
                </a>
              ))}
            </div>
          </header>

          <main className="mb-auto">{children}</main>
          <Footer />
        </div>
      </SectionContainer>
    </>
  )
}

export default LayoutWrapper
