import { Slots, VNode } from 'vue'
import { To, Path, parsePath } from 'history'

export function invariant(cond: boolean, message: string): void {
    if (!cond) throw new Error(message)
}

export function warning(cond: boolean, message: string): void {
    if (!cond) {
        // eslint-disable-next-line no-console
        if (typeof console !== 'undefined') console.warn(message)

        try {
            // Welcome to debugging @bv3/router (based on React-Router)!
            //
            // This error is thrown as a convenience so you can more easily
            // find the source for a warning that appears in the console by
            // enabling "pause on exceptions" in your JavaScript debugger.
            throw new Error(message)
            // eslint-disable-next-line no-empty
        } catch (e) {}
    }
}

export function renderSlots(slots: Slots, name = 'default'): VNode[] {
    if (!slots[name]) {
        // TODO: if dev throw error
    }

    let children: any
    if (typeof slots[name] !== 'function') {
        warning(
            false,
            `${name} slot is not a function, it's better to use function for slots`,
        )
        children = slots[name]
    } else {
        children = slots[name] && (slots[name] as any)()
    }
    if (Array.isArray(children)) {
        // TODO: check if every item is valid VNode
        return children
    }
    return [children]
}

export const rs = renderSlots

export const trimTrailingSlashes = (path: string) => path.replace(/\/+$/, '')
export const normalizeSlashes = (path: string) => path.replace(/\/\/+/g, '/')
export const joinPaths = (paths: string[]) => normalizeSlashes(paths.join('/'))
export const splitPath = (path: string) => normalizeSlashes(path).split('/')

const alreadyWarned: Record<string, boolean> = {}
export function warningOnce(key: string, cond: boolean, message: string) {
    if (!cond && !alreadyWarned[key]) {
        alreadyWarned[key] = true
        warning(false, message)
    }
}

function resolvePathname(toPathname: string, fromPathname: string): string {
    const segments = splitPath(trimTrailingSlashes(fromPathname))
    const relativeSegments = splitPath(toPathname)

    relativeSegments.forEach(segment => {
        if (segment === '..') {
            // Keep the root "" segment so the pathname starts at /
            if (segments.length > 1) segments.pop()
        } else if (segment !== '.') {
            segments.push(segment)
        }
    })

    return segments.length > 1 ? joinPaths(segments) : '/'
}

/**
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://router.bestvue3.com/api/resolvePath
 */
export function resolvePath(to: To, fromPathname = '/'): Path {
    const { pathname: toPathname, search = '', hash = '' } =
        typeof to === 'string' ? parsePath(to) : to

    const pathname = toPathname
        ? resolvePathname(
              toPathname,
              toPathname.startsWith('/') ? '/' : fromPathname,
          )
        : fromPathname

    return { pathname, search, hash }
}
