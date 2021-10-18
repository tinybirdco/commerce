import NextLink, { LinkProps as NextLinkProps } from 'next/link'

const Link: React.FC<NextLinkProps> = ({ href, scroll, children, ...props }) => {
  return (
    <NextLink href={href} scroll={scroll}>
      <a {...props}>{children}</a>
    </NextLink>
  )
}

export default Link
