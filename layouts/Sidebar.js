import Image from '@/components/Image'

export default function Sidebar({ widgets }) {
  return (
    <div className="md p-4 md:w-1/3">
      {widgets.map((widget, key) => (
        <Widget key={`widget-${key}`} widget={widget} />
      ))}
    </div>
  )
}

function Widget({ widget }) {
  return (
    <div className="pb-[80px]">
      <h1 className="pb-5 pt-2 text-2xl font-light">{widget.title}</h1>
      {widget.content.map(({ title, imgSrc, articles }) => (
        <div key={title} className="pb-5">
          {title && <p className="p-2 text-2xl font-normal">{title}</p>}
          {imgSrc && (
            <Image
              src={imgSrc}
              alt="avatar"
              width="320px"
              height="320px"
              className="w-100 h-100 my-auto rounded"
            />
          )}

          {articles.map((article) => (
            <li className="list-none p-3" key={article.slug}>
              <div className="border-b-[1px] border-gray-200 py-2">
                <a href={article.slug}>{article.title}</a>
              </div>
            </li>
          ))}
        </div>
      ))}
    </div>
  )
}
