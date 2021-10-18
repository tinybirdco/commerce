import cn from 'classnames'
import Link from '@components/ui/Link'

export default function Filter({
  renderItem,
  items,
  handleClick,
  filterName,
  currentFilter,
  currentParams,
  filterPlural,
  activeFilter,
  toggleFilter,
}) {
  let resetFilter = {
    ...currentParams,
  }

  resetFilter[filterName] = ''

  return (
    <div className="relative inline-block w-full">
      <div className="lg:hidden">
        <span className="rounded-md shadow-sm">
          <button
            type="button"
            onClick={(e) => handleClick(e, filterName)}
            className="flex justify-between w-full rounded-sm border border-accent-3 px-4 py-3 bg-accent-0 text-sm leading-5 font-medium text-accent-4 hover:text-accent-5 focus:outline-none focus:border-blue-300 focus:shadow-outline-normal active:bg-accent-1 active:text-accent-8 transition ease-in-out duration-150"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
          >
            {currentFilter || filterPlural}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>
      <div
        className={`origin-top-left absolute lg:relative left-0 mt-2 w-full rounded-md shadow-lg lg:shadow-none z-10 mb-10 lg:block ${
          activeFilter !== filterName || toggleFilter !== true ? 'hidden' : ''
        }`}
      >
        <div className="rounded-sm bg-accent-0 shadow-xs lg:bg-none lg:shadow-none">
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <ul>
              <li className="block text-sm leading-5 text-accent-4 lg:text-base lg:no-underline lg:font-bold lg:tracking-wide hover:bg-accent-1 lg:hover:bg-transparent hover:text-accent-8 focus:outline-none focus:bg-accent-1 focus:text-accent-8">
                <h3
                  className={
                    'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                  }
                >
                  {filterName[0].toUpperCase() + filterName.slice(1)}
                </h3>
              </li>
              <li
                className={cn(
                  'block text-sm leading-5 text-accent-4 hover:bg-accent-1 lg:hover:bg-transparent hover:text-accent-8 focus:outline-none focus:bg-accent-1 focus:text-accent-8',
                  {
                    underline: !currentFilter,
                  }
                )}
              >
                <Link
                  href={{ pathname: '/admin', query: resetFilter }}
                  scroll={false}
                >
                  <a
                    onClick={(e) => handleClick(e, filterName)}
                    className={
                      'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                    }
                  >
                    {filterPlural}
                  </a>
                </Link>
              </li>
              {items ? (
                items.map((item) => {
                  const queryParams = {
                    ...currentParams,
                  }

                  queryParams[filterName] = item

                  return (
                    <li
                      key={item}
                      className={cn(
                        'block text-sm leading-5 text-accent-4 hover:bg-accent-1 lg:hover:bg-transparent hover:text-accent-8 focus:outline-none focus:bg-accent-1 focus:text-accent-8',
                        {
                          underline: currentFilter === item,
                        }
                      )}
                    >
                      <Link
                        href={{
                          pathname: '/admin',
                          query: queryParams,
                        }}
                        scroll={false}
                      >
                        <a
                          onClick={(e) => handleClick(e, filterName)}
                          className={
                            'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'
                          }
                        >
                          {item}
                        </a>
                      </Link>
                    </li>
                  )
                })
              ) : (
                <li className="block text-sm leading-5 text-accent-4 hover:bg-accent-1 lg:hover:bg-transparent hover:text-accent-8 focus:outline-none focus:bg-accent-1 focus:text-accent-8">
                  <span className="'block lg:inline-block px-4 py-2 lg:p-0 lg:my-2 lg:mx-4'">
                    Loading items...
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
