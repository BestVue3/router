import { invariant } from './utils'
import { Params } from './types'

/**
 * Returns a path with params interpolated.
 *
 * @see https://reactrouter.com/api/generatePath
 */
export default function generatePath(
    path: string,
    params: Params = {},
): string {
    return path
        .replace(/:(\w+)/g, (_, key) => {
            invariant(params[key] != null, `Missing ":${key}" param`)
            return params[key]
        })
        .replace(/\/*\*$/, () =>
            params['*'] == null ? '' : params['*'].replace(/^\/*/, '/'),
        )
}
