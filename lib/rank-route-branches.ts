import { RouteBranch } from './types'

const paramRe = /^:\w+$/
const dynamicSegmentValue = 2
const emptySegmentValue = 1
const staticSegmentValue = 10
const splatPenalty = -2
const isSplat = (s: string) => s === '*'

/**
 * very intresting here
 * they made a score for:
 *  - :id
 *  - *
 *  - /static-path
 * then combine every part of the path together
 * this is the score of `path`
 */
function computeScore(path: string): number {
    const segments = path.split('/')
    let initialScore = segments.length
    if (segments.some(isSplat)) {
        initialScore += splatPenalty
    }

    return segments
        .filter(s => !isSplat(s))
        .reduce(
            (score, segment) =>
                score +
                (paramRe.test(segment)
                    ? dynamicSegmentValue
                    : segment === ''
                    ? emptySegmentValue
                    : staticSegmentValue),
            initialScore,
        )
}

function compareIndexes(a: number[], b: number[]): number {
    const siblings =
        a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i])

    return siblings
        ? // If two routes are siblings, we should try to match the earlier sibling
          // first. This allows people to have fine-grained control over the matching
          // behavior by simply putting routes with identical paths in the order they
          // want them tried.
          a[a.length - 1] - b[b.length - 1]
        : // Otherwise, it doesn't really make sense to rank non-siblings by index,
          // so they sort equally.
          0
}

function stableSort(array: any[], compareItems: (a: any, b: any) => number) {
    // This copy lets us get the original index of an item so we can preserve the
    // original ordering in the case that they sort equally.
    const copy = array.slice(0)
    array.sort(
        (a, b) => compareItems(a, b) || copy.indexOf(a) - copy.indexOf(b),
    )
}

export default function rankRouteBranches(branches: RouteBranch[]): void {
    const pathScores = branches.reduce<Record<string, number>>(
        (memo, [path]) => {
            memo[path] = computeScore(path)
            return memo
        },
        {},
    )

    // Sorting is stable in modern browsers, but we still support IE 11, so we
    // need this little helper.
    stableSort(branches, (a, b) => {
        const [aPath, , aIndexes] = a
        const aScore = pathScores[aPath]

        const [bPath, , bIndexes] = b
        const bScore = pathScores[bPath]

        return aScore !== bScore
            ? bScore - aScore // Higher score first
            : compareIndexes(aIndexes, bIndexes)
    })
}
