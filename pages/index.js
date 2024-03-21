import { useEffect, useState } from 'react'
import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Sidebar from '@/layouts/Sidebar'
import Tag from '@/components/Tag'
import Box from '@/components/Box'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import Ticker from 'react-ticker'
import { fetchFinance } from '../pages/api/yahoo'
import { isEmpty } from 'lodash'

import NewsletterForm from '@/components/NewsletterForm'

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  const authors = await getAllFilesFrontMatter('authors')

  const widgets = [
    {
      title: 'Nuestros autores',
      content: [
        {
          title: authors[0].name,
          imgSrc: authors[1].avatar,
          articles: posts.filter((post) => post.authors[0] === 'folivares').slice(0, 3),
        },
        {
          title: authors[2].name,
          imgSrc: authors[2].avatar,
          articles: posts.filter((post) => post.authors[0] === 'luisrivases').slice(0, 3),
        },
        {
          title: authors[4].name,
          imgSrc: authors[4].avatar,
          articles: posts.filter((post) => post.authors[0] === 'olivaresrafael').slice(0, 3),
        },
      ],
    },
    {
      title: 'Últimas Publicaciones',
      content: [
        {
          articles: posts.slice(0, 6),
        },
      ],
    },
    {
      title: 'EL FUTURO YA ESTÁ AQUÍ',
      content: [
        {
          articles: posts.filter((post) => /EL FUTURO YA ESTÁ AQUÍ/.test(post.title)),
        },
      ],
    },
  ]

  return { props: { posts, widgets } }
}

export default function Home({ posts, widgets }) {
  const [maxDisplay, setMaxDisplay] = useState(12)
  const [ticker, setTicker] = useState([])

  const refreshTicker = async () =>
    await fetch(`/api/yahoo`, {
      method: 'GET',
    })

  useEffect(() => {
    isEmpty(ticker) &&
      refreshTicker().then(async (data) => {
        const resonse = await data.json()
        setTicker(resonse)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const GetRatesFromAPI = () =>
    !isEmpty(ticker) ? (
      <p style={{ whiteSpace: 'nowrap' }}>
        {ticker.map((tick) => (
          <span key={tick.symbol}>
            <span className="pr-2">{tick.symbol}</span>
            <span className="pr-2">{tick.regularMarketPrice}</span>
            <span
              className={
                tick.regularMarketChangePercent > 0 ? 'pr-8 text-green-500' : 'pr-8 text-red-500'
              }
            >
              {tick.regularMarketChangePercent.toFixed(2)}%
            </span>
          </span>
        ))}
      </p>
    ) : (
      <p style={{ visibility: 'hidden' }}>Placeholder</p>
    )

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      {!isEmpty(ticker) && (
        <div className="mt-4 border-2 border-red-400">
          {<Ticker offset={8}>{() => <GetRatesFromAPI />}</Ticker>}
        </div>
      )}

      <div className="divide-y divide-gray-300 dark:divide-gray-700">
        <div className="container py-8">
          <div className="-m-4 flex flex-wrap">
            <Box
              title={posts[0].title}
              description={posts[0].summary}
              imgSrc={posts[0].images[0]}
              href={`/blog/${posts[0].slug}`}
              tags={posts[0].tags}
            />
          </div>
          <div className="-m-4 flex flex-wrap">
            <Sidebar widgets={widgets} />
            <div className="md py-4 md:w-2/3">
              {posts.slice(1, maxDisplay).map((d) => (
                <Box
                  key={d.title}
                  title={d.title}
                  description={d.summary}
                  imgSrc={d.images[0]}
                  href={`/blog/${d.slug}`}
                  tags={d.tags}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {posts.length > maxDisplay && (
        <div className="flex justify-end text-base font-medium leading-6">
          <button
            onClick={() => setMaxDisplay(maxDisplay + 4)}
            className="text-primary-900 hover:text-primary-400 dark:text-primary-600 dark:hover:text-primary-800"
            aria-label="all posts"
          >
            Mostrar más &rarr;
          </button>
        </div>
      )}
      {siteMetadata.newsletter.provider !== '' && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm title={siteMetadata.newsletter.title} />
        </div>
      )}
    </>
  )
}

function Li({ slug, date, title, summary, tags, image }) {
  return (
    <li key={slug} className="py-12">
      <article>
        <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0">
          <div className="mx-3">
            <Link href={`/blog/${slug}`} aria-label={`Link to ${title}`}>
              <Image
                alt={title}
                src={image}
                className="object-cover object-center md:h-36 lg:h-48"
                layout="responsive"
                width={250}
                height={180}
              />
            </Link>
          </div>

          <div className="space-y-5 xl:col-span-3">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold leading-8 tracking-tight">
                  <Link
                    href={`/blog/${slug}`}
                    className="text-gray-900 hover:text-primary-800 dark:text-gray-100"
                  >
                    {title}
                  </Link>
                </h2>
                <dl className="mt-0">
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-xs font-light leading-6 text-gray-300 dark:text-gray-100">
                    <time dateTime={date}>{formatDate(date)}</time>
                  </dd>
                </dl>
                <div className="flex flex-wrap">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              </div>

              <div className="prose max-w-none text-gray-500 dark:text-gray-400">{summary}</div>
            </div>

            <div className="text-base font-medium leading-6">
              <Link
                href={`/blog/${slug}`}
                className="text-primary-900 hover:text-primary-300  dark:text-primary-500 dark:hover:text-primary-800"
                aria-label={`Read "${title}"`}
              >
                Leer más &rarr;
              </Link>
            </div>
          </div>
        </div>
      </article>
    </li>
  )
}
