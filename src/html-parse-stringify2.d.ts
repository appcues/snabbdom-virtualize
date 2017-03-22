// just enough to get us through
declare module 'html-parse-stringify2' {
    export interface ASTNode {
        type: string
        content: string
        name?: string
        children?: ASTNode[]
        attrs?: {
            [key: string]: string
        }
    }

    export const parse: (html: string) => ASTNode[]
}
