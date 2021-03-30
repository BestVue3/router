import { Routes } from '@'

export default (props: any, { slots }: any) => {
    return <Routes {...props} roughlyDisableKeepAlive v-slots={slots} />
}
