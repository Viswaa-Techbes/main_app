"use client"

import React from "react"
import NextLink from "next/link"

type LinkProps = React.ComponentProps<typeof NextLink>

export default function Link(props: LinkProps) {
  const { children, ...rest } = props

  // Ensure Next Link always receives a single React element child.
  // If callers pass multiple nodes (icon + text), wrap them in a span.
  if (!children) return <NextLink {...rest} />

  if (React.Children.count(children) !== 1 || !React.isValidElement(children)) {
    return <NextLink {...rest}><span>{children}</span></NextLink>
  }

  return <NextLink {...rest}>{children}</NextLink>
}
