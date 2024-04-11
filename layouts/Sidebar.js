import Image from '@/components/Image'
import { nanoid } from 'nanoid'

export default function Sidebar({ widgets }) {
  return (
    <div className="md p-4 md:w-1/3">
      {widgets.map((widget, key) => (
        <Widget key={nanoid()} widget={widget} />
      ))}
    </div>
  )
}

function Widget({ widget }) {
  return (
    <div className="pb-[80px]" key={nanoid()}>
      <h1 className="pb-5 pt-2 text-2xl font-light">{widget.title}</h1>
      {widget.content.map(({ title, imgSrc, articles }) => (
        <div key={nanoid()} className="w-100 flex flex-wrap pb-5">
          {imgSrc && (
            <Image
              src={imgSrc}
              alt="avatar"
              width="50px"
              height="50px"
              className="rounded-full md:w-1/4"
            />
          )}
          {title && <p className="ml-3 self-center text-xl font-normal md:w-2/3">{title}</p>}

          {articles.map((article) => (
            <li className="list-none p-3" key={nanoid()}>
              {widget.includeImg && (
                <Image
                  src={article.images[0]}
                  alt="image"
                  width="320px"
                  height="200px"
                  className="rounded"
                />
              )}
              <div className="border-b-[1px] border-gray-200 py-2">
                <a href={`blog/${article.slug}`}>{article.title}</a>
              </div>
            </li>
          ))}
        </div>
      ))}
    </div>
  )
}
