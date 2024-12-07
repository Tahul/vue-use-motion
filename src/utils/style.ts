import type { ValueType } from 'style-value-types'
import { alpha, color, complex, degrees, filter, number, progressPercentage, px, scale } from 'style-value-types'

type ValueTypeMap = Record<string, ValueType>

/**
 * ValueType for "auto"
 */
export const auto: ValueType = {
  test: (v: any) => v === 'auto',
  parse: v => v,
}

/**
 * ValueType for ints
 */
const int = {
  ...number,
  transform: Math.round,
}

export const valueTypes: ValueTypeMap = {
  // Color props
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,

  // Border props
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  borderWidth: px,
  borderTopWidth: px,
  borderRightWidth: px,
  borderBottomWidth: px,
  borderLeftWidth: px,
  borderRadius: px,
  radius: px,
  borderTopLeftRadius: px,
  borderTopRightRadius: px,
  borderBottomRightRadius: px,
  borderBottomLeftRadius: px,

  // Positioning props
  width: px,
  maxWidth: px,
  height: px,
  maxHeight: px,
  size: px,
  top: px,
  right: px,
  bottom: px,
  left: px,

  // Spacing props
  padding: px,
  paddingTop: px,
  paddingRight: px,
  paddingBottom: px,
  paddingLeft: px,
  margin: px,
  marginTop: px,
  marginRight: px,
  marginBottom: px,
  marginLeft: px,

  // Transform props
  rotate: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px,
  translateX: px,
  translateY: px,
  translateZ: px,
  x: px,
  y: px,
  z: px,
  perspective: px,
  transformPerspective: px,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px,

  // Misc
  zIndex: int,
  filter,
  WebkitFilter: filter,

  // SVG
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int,

  // custom SVG properties
  pathLength: auto,
  pathOffset: auto,
  pathSpacing: auto,
}

/**
 * Return the value type for a key.
 *
 * @param key
 */
export const getValueType = (key: string) => valueTypes[key]

/**
 * Transform the value using its value type if value is a `number`, otherwise return the value.
 *
 * @param value
 * @param type
 */
export function getValueAsType(value: any, type?: ValueType) {
  return type && typeof value === 'number' && type.transform ? type.transform(value) : value
}

/**
 * Get default animatable
 *
 * @param key
 * @param value
 */
export function getAnimatableNone(key: string, value: string): any {
  let defaultValueType = getValueType(key)
  if (defaultValueType !== filter)
    defaultValueType = complex
  // If value is not recognised as animatable, ie "none", create an animatable version origin based on the target
  return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : undefined
}

/**
 * A quick lookup for custom SVG props.
 */
const SVGPathProps = new Set(['pathLength', 'pathOffset', 'pathSpacing'])
export function isSVGPathProp(key: string): boolean {
  return SVGPathProps.has(key)
}

/**
 * Determine whether it is an svg element
 * @param target
 */
export function isSVGElement(target: HTMLElement | SVGElement): boolean {
  return !!((target as SVGElement)?.ownerSVGElement || target.tagName.toLowerCase() === 'svg')
}

/**
 * Build SVG path properties from custom properties
 * pathLength always normalize to 1
 * pathOffset to stroke-dashoffset
 * pathLength and pathSpacing to stroke-dasharray
 *
 * pathLength: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pathLength
 * the path is always normalize to 1, so you need deal with other paths by yourself
 * base the total length is 1.
 * for example stroke-dasharray will assume the start of the path being 0 and
 * the end point the value defined in the pathLength attribute as 1.
 *
 * @param target
 * @param length
 * @param spacing
 * @param offset
 */
export function setSVGPath(target: SVGElement, length: number, spacing = 1, offset = 0) {
  target.setAttribute('pathLength', '1') // normalize to 1
  target.setAttribute('stroke-dashoffset', `${offset}`)
  target.setAttribute('stroke-dasharray', `${length} ${spacing}`)
}

/**
 * Get pathLength pathSpacing pathOffset from svg element
 * Convert stroke-dashoffset stroke-dasharray to custome properties
 * @param target
 */
export function getSVGPath(target: SVGElement) {
  // pathLength is normalize to 1
  const pathLength = target.getAttribute('pathLength') ? 1 : undefined
  const pathOffset = target.getAttribute('stroke-dashoffset') ? Number.parseFloat(target.getAttribute('stroke-dashoffset')!) : undefined
  // TODO need to support odd?
  // sinle: dashes and gaps are same size
  // two: dashes and gaps are different sizes
  // odd: dashes and gaps of various sizes with an odd number of values, [4,1,2] is equivalent to [4,1,2,4,1,2]
  const pathSpacing = target.getAttribute('stroke-dasharray') ? Number.parseFloat(target.getAttribute('stroke-dasharray')!.split(' ')[1]!) : undefined
  return {
    pathLength,
    pathSpacing,
    pathOffset,
  }
}
