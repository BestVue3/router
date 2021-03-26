// import {
//     ComputedOptions,
//     MethodOptions,
//     ComponentOptionsWithoutProps,
//     ComponentOptionsWithArrayProps,
//     ComponentOptionsWithObjectProps,
//     ComponentOptionsMixin,
//     RenderFunction,
//     ComponentOptionsBase
//   } from './componentOptions'
//   import {
//     SetupContext,
//     AllowedComponentProps,
//     ComponentCustomProps
//   } from './component'
//   import {
//     ExtractPropTypes,
//     ComponentPropsOptions,
//     ExtractDefaultPropTypes
//   } from './componentProps'
//   import { EmitsOptions } from './componentEmits'
//   import { isFunction } from '@vue/shared'
//   import { VNodeProps } from './vnode'
//   import {
//     CreateComponentPublicInstance,
//     ComponentPublicInstanceConstructor
//   } from './componentPublicInstance'

import {
    ComputedOptions,
    MethodOptions,
    ComponentOptionsMixin,
    EmitsOptions,
    ComponentOptionsWithArrayProps,
    DefineComponent,
    VNodeProps,
    AllowedComponentProps,
    ComponentCustomProps,
    SetupContext,
    RenderFunction,
    ComponentOptionsWithoutProps,
    ComponentPropsOptions,
    ComponentOptionsWithObjectProps,
} from 'vue'

export type PublicProps = VNodeProps &
    AllowedComponentProps &
    ComponentCustomProps

export type RouteProps = { path: string; keepalive: boolean }

// defineComponent is a utility that is primarily used for type inference
// when declaring components. Type inference is provided in the component
// options (provided as the argument). The returned value has artificial types
// for TSX / manual render function / IDE support.

// overload 1: direct setup function
// (uses user defined props interface)
export function defineRouteComponent<Props, RawBindings = object>(
    setup: (
        props: Readonly<Props>,
        ctx: SetupContext,
    ) => RawBindings | RenderFunction,
): DefineComponent<Props & RouteProps, RawBindings>

// overload 2: object format with no props
// (uses user defined props interface)
// return type is for Vetur and TSX support
export function defineRouteComponent<
    Props = {},
    RawBindings = {},
    D = {},
    C extends ComputedOptions = {},
    M extends MethodOptions = {},
    Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
    Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
    E extends EmitsOptions = EmitsOptions,
    EE extends string = string
>(
    options: ComponentOptionsWithoutProps<
        Props,
        RawBindings,
        D,
        C,
        M,
        Mixin,
        Extends,
        E,
        EE
    >,
): DefineComponent<
    Props & RouteProps,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
>

// overload 3: object format with array props declaration
// props inferred as { [key in PropNames]?: any }
// return type is for Vetur and TSX support
export function defineRouteComponent<
    PropNames extends string,
    RawBindings,
    D,
    C extends ComputedOptions = {},
    M extends MethodOptions = {},
    Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
    Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
    E extends EmitsOptions = Record<string, any>,
    EE extends string = string
>(
    options: ComponentOptionsWithArrayProps<
        PropNames,
        RawBindings,
        D,
        C,
        M,
        Mixin,
        Extends,
        E,
        EE
    >,
): DefineComponent<
    Readonly<{ [key in PropNames]?: any } & RouteProps>,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
>

// overload 4: object format with object props declaration
// see `ExtractPropTypes` in ./componentProps.ts
export function defineRouteComponent<
    // the Readonly constraint allows TS to treat the type of { required: true }
    // as constant instead of boolean.
    PropsOptions extends Readonly<ComponentPropsOptions>,
    RawBindings,
    D,
    C extends ComputedOptions = {},
    M extends MethodOptions = {},
    Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
    Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
    E extends EmitsOptions = Record<string, any>,
    EE extends string = string
>(
    options: ComponentOptionsWithObjectProps<
        PropsOptions & RouteProps,
        RawBindings,
        D,
        C,
        M,
        Mixin,
        Extends,
        E,
        EE
    >,
): DefineComponent<PropsOptions, RawBindings, D, C, M, Mixin, Extends, E, EE>

// implementation, close to no-op
export function defineRouteComponent(options: unknown) {
    return typeof options === 'function'
        ? { setup: options, name: options.name }
        : options
}
