import { useRef, useState } from 'react'

type SearchResult = {
  data: () => Promise<SearchResultData>
  id: string
  score: number
  words: Array<number>
}

type SearchResultData = {
  anchors: any[]
  content: string
  excerpt: string
  filters: {}
  locations: number[]
  meta: {
    image: string
    image_alt: string
    title: string
  }
  raw_content: string
  raw_url: string
  sub_results: any[]
  url: string
  weighted_locations: any[]
  word_count: number
}

declare global {
  interface Window {
    pagefind: {
      search: (query: string) => Promise<{ results: SearchResult[] }>
    }
  }
}

export default function SearchApp() {
  const searchInput = useRef<HTMLInputElement>(null)
  const [searchResults, setSearchResults] = useState<SearchResultData[]>([])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchInput.current?.value
    if (!query) {
      setSearchResults([])
      return
    }
    const { results } = await window.pagefind.search(query)

    if (results.length === 0) {
      setSearchResults([])
    } else {
      setSearchResults(
        await Promise.all(
          results.map(async (result) => {
            return await result.data()
          }),
        ),
      )
    }
  }

  return (
    <div>
      <form id="search-form" onSubmit={handleSubmit}>
        <label htmlFor="query">Search</label>
        <input type="search" id="query" name="query" autoFocus={true} ref={searchInput} />
        <button type="submit">Search</button>
      </form>

      <section>
        <h2>Results</h2>
        <p>There are {searchResults.length} results that match your query.</p>
        {searchResults.map((result) => (
          <SearchResultItem key={result.url} result={result} />
        ))}
      </section>
    </div>
  )
}

const SearchResultItem = ({ result }: { result: SearchResultData }) => {
  return (
    <article>
      <h2>
        <a href={result.url}>{result.meta.title}</a>
      </h2>
      <div dangerouslySetInnerHTML={{ __html: result.excerpt }} />
    </article>
  )
}
