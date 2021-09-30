import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import { cloneElement, ReactElement } from "react";


interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  shouldMatchExactHref?: boolean;
}

export default function ActiveLink({ children, shouldMatchExactHref = false, ...rest }: ActiveLinkProps) {

  const { asPath } = useRouter();

  const isActive =
    shouldMatchExactHref
      ? asPath === rest.href || asPath === rest.as
      : asPath.startsWith(String(rest.href)) || asPath.startsWith(String(rest.as));

  return (
    <Link {...rest} >
      {  cloneElement(children, {
        color: isActive ? 'pink.400' : 'gray.300'
      })}
    </Link>
  )
}