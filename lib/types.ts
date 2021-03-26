import { VNode, VNodeChild } from 'vue'
import { Action, Location, History } from 'history'

declare const __DEV__: boolean

/**
 * The parameters that were parsed from the URL path.
 */
export type Params = Record<string, string>

export type Navigator = Omit<
    History,
    'action' | 'location' | 'back' | 'forward' | 'listen'
>

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export interface LocationContextObject {
    action?: Action
    location?: Location
    navigator: Navigator
    static: boolean
}

export interface RouteContextObject {
    outlet: VNodeChild
    params: Readonly<Params>
    pathname: string
    route: RouteObject | null
}

export interface RouteObject {
    caseSensitive: boolean
    children?: RouteObject[]
    node: VNode | JSX.Element
    path: string
    keepalive?: boolean
}

export interface RouteMatch {
    route: RouteObject
    pathname: string
    params: Params
}

export interface PathMatch {
    path: string
    pathname: string
    params: Params
}

export type RouteBranch = [string, RouteObject[], number[]]
export type PathPattern =
    | string
    | { path: string; caseSensitive?: boolean; end?: boolean }

export const readOnly: <T extends unknown>(obj: T) => T = __DEV__
    ? obj => Object.freeze(obj)
    : obj => obj

/**
 * A "partial route" object is usually supplied by the user and may omit
 * certain properties of a real route object such as `path` and `element`,
 * which have reasonable defaults.
 */
export interface PartialRouteObject {
    caseSensitive?: boolean
    children?: PartialRouteObject[]
    element?: VNode | JSX.Element
    path?: string
    keepalive?: boolean
}
