/** Route a local image through the Netlify Image CDN at a given width. */
export function cdn(src: string, width: number, opts: { h?: number } = {}) {
  const params = new URLSearchParams({ url: src, w: String(width), fm: 'webp', q: '80' })
  if (opts.h) {
    params.set('h', String(opts.h))
    params.set('fit', 'cover')
  }
  return `/.netlify/images?${params.toString()}`
}

export function srcSet(src: string, widths: Array<number>) {
  return widths.map((w) => `${cdn(src, w)} ${w}w`).join(', ')
}
