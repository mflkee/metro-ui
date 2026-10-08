import type { ComponentProps } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Class-strategy theme provider. Put `<html class="dark">` toggling in the hands
 * of next-themes: it sets `.dark` on <html> and keeps it in sync with storage
 * and the OS preference.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
