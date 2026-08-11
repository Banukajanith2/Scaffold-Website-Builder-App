'use client'

import CTABlock from '@/components/builder/blocks/CTABlock'
import FeaturesBlock from '@/components/builder/blocks/FeaturesBlock'
import FooterBlock from '@/components/builder/blocks/FooterBlock'
import HeroBlock from '@/components/builder/blocks/HeroBlock'
import TestimonialBlock from '@/components/builder/blocks/TestimonialBlock'
import TextBlock from '@/components/builder/blocks/TextBlock'
import type { Block } from '@/types'

type Props = { block: Block; isSelected: boolean; onClick: () => void }

export default function BlockRenderer({ block, isSelected, onClick }: Props) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} isSelected={isSelected} onClick={onClick} />
    case 'features':
      return <FeaturesBlock block={block} isSelected={isSelected} onClick={onClick} />
    case 'testimonial':
      return <TestimonialBlock block={block} isSelected={isSelected} onClick={onClick} />
    case 'text':
      return <TextBlock block={block} isSelected={isSelected} onClick={onClick} />
    case 'cta':
      return <CTABlock block={block} isSelected={isSelected} onClick={onClick} />
    case 'footer':
      return <FooterBlock block={block} isSelected={isSelected} onClick={onClick} />
    default: {
      // Exhaustiveness guard: adding a BlockType without a renderer fails the build.
      const exhaustive: never = block.type
      return exhaustive
    }
  }
}
