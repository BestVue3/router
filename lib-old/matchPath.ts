/**
 * this file is driectly copied from `react-router`
 */

import {
    pathToRegexp,
    TokensToRegexpOptions,
    ParseOptions,
    Key,
} from 'path-to-regexp'

const cache: {
    [key: string]: {
        [path: string]: {
            regexp: RegExp
            keys: Key[]
        }
    }
} = {}
const cacheLimit = 10000
let cacheCount = 0

function compilePath(
    path: string,
    options: TokensToRegexpOptions & ParseOptions,
) {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`
    const pathCache = cache[cacheKey] || (cache[cacheKey] = {})

    if (pathCache[path]) return pathCache[path]

    const keys: Key[] = []
    const regexp = pathToRegexp(path, keys, options)
    const result = { regexp, keys }

    if (cacheCount < cacheLimit) {
        pathCache[path] = result
        cacheCount++
    }

    return result
}

export interface MatchPathOptions {
    path?: string | string[]
    exact?: boolean
    strict?: boolean
    sensitive?: boolean
}

export interface Match {
    path: string // the path used to match
    url: string
    isExact: boolean // whether or not we matched exactly
    params: object
}

/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(
    pathname: string,
    options: MatchPathOptions | string = {},
): null | Match {
    if (typeof options === 'string' || Array.isArray(options)) {
        options = { path: options as string }
    }

    const {
        path,
        exact = false,
        strict = false,
        sensitive = false,
    } = options as MatchPathOptions

    const paths = [].concat(path as any)

    return paths.reduce((matched: null | Match, path: string) => {
        if (!path && path !== '') return null
        if (matched) return matched

        const { regexp, keys } = compilePath(path, {
            end: exact,
            strict,
            sensitive,
        })
        const match = regexp.exec(pathname)

        if (!match) return null

        const [url, ...values] = match
        const isExact = pathname === url

        if (exact && !isExact) return null

        return {
            path, // the path used to match
            url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
            isExact, // whether or not we matched exactly
            params: keys.reduce(
                (memo: { [k: string]: string }, key: Key, index: number) => {
                    memo[key.name] = values[index]
                    return memo
                },
                {},
            ),
        }
    }, null)
}

export default matchPath
