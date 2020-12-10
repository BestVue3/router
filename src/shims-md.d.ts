declare module '*.md' {
    interface Markdown {
        markup: string
        headers: any[]
        title: string
    }
    const markdown: Markdown
    export default markdown
}
