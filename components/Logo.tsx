import Image from 'next/image'

type Props = {
  /** Rendered size in px. next/image serves a matching resolution. */
  size?: number
  className?: string
  priority?: boolean
}

/**
 * The Scaffold mark.
 *
 * alt is empty on purpose: everywhere this appears it sits beside the word
 * "Scaffold" or a heading that names the product, so giving it alt text would
 * make a screen reader announce the name twice.
 */
export default function Logo({ size = 28, className = '', priority = false }: Props) {
  return (
    <Image
      src="/scaffold-logo.png"
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 rounded-[22%] ${className}`}
    />
  )
}
