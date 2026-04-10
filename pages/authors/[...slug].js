import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { getFileBySlug, getAllFilesFrontMatter } from '@/lib/mdx'
import { PageSEO } from '@/components/SEO'
import Link from '@/components/Link'

const DEFAULT_LAYOUT = 'AuthorLayout'

export async function getStaticPaths() {
  const authors = await getAllFilesFrontMatter('authors')
  const paths = authors.map((author) => ({
    params: {
      slug: [author.slug],
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const authorSlug = params.slug[0]
  const author = await getFileBySlug('authors', [authorSlug])

  // Get all posts by this author
  const allPosts = await getAllFilesFrontMatter('blog')
  const authorPosts = allPosts.filter((post) => post.authors && post.authors.includes(authorSlug))

  return { props: { author, authorPosts } }
}

export default function AuthorPage({ author, authorPosts }) {
  const { name } = author.frontMatter

  return (
    <>
      <PageSEO title={`${name} - Autor`} description={`Artículos de ${name}`} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {name}
          </h1>
        </div>
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <MDXLayoutRenderer
            layout={author.frontMatter.layout || DEFAULT_LAYOUT}
            mdxSource={author.mdxSource}
            frontMatter={author.frontMatter}
          />
        </div>

        {authorPosts.length > 0 && (
          <div className="space-y-2 pb-8 pt-6 md:space-y-5">
            <h2 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
              Artículos publicados
            </h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {authorPosts.map((post) => (
                <li key={post.slug} className="py-4">
                  <article className="space-y-2">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold leading-8 tracking-tight">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <p className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {post.summary}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-8">
          <Link
            href="/about"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            &larr; Ver todos los autores
          </Link>
        </div>
      </div>
    </>
  )
}
