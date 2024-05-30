'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const Nav = ({ children }: { children: React.ReactNode }) => {
  return (
    <nav className='bg-primary text-primary-foreground flex justify-center px-4'>
      {children}
    </nav>
  )
}

export default Nav

export const NavLink = (
  props: Omit<ComponentProps<typeof Link>, 'className'>
) => {
  const pathname = usePathname()
  return (
    <Link
      {...props}
      className={cn(
        'p-4 hover:bg-secondary transition-all duration-300 ease-linear hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground',
        pathname === props.href && 'bg-background text-foreground'
      )}
    />
  )
}
