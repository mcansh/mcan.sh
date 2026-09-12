import { css } from "remix/ui"
import type { Handle } from "remix/ui"

import { routes } from "../../routes.ts"
import { spaceY } from "../public/css-mixins.ts"
import { DesignSwitcher } from "./shared.tsx"
import type { HomePageProps } from "./shared.tsx"

// ============================================================================
// DESIGN OPTION 1: Minimal & Clean (Current style refined)
// ============================================================================
// A polished version of the existing design with better typography,
// proper dark mode, and improved spacing following ui.sh guidelines
export const homePageOptions = css({
  "&, body": {
    height: "100dvh",
    "@media (prefers-color-scheme: dark)": {
      color: "white",
      backgroundColor: "black",
    },
  },
})

export function HomePage(handle: Handle<HomePageProps>) {
  let designIndex = handle.props.designIndex ?? 0
  let fontIndex = handle.props.fontIndex ?? 0
  return () => (
    <main
      mix={css({
        marginInline: "auto",
        height: "100%",
        maxWidth: "48rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: "1rem",
        textAlign: "center",
      })}
    >
      <div
        mix={css({
          display: "flex",
          flexDirection: "column",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <img
          mix={css({
            "--size": "15rem",
            marginInline: "auto",
            height: "var(--size)",
            width: "var(--size)",
            borderRadius: "calc(infinity * 1px)",
            outline: "1px solid",
            outlineColor: "rgb(0 0 0 / 0.05)",
            "@media (prefers-color-scheme: dark)": {
              outlineColor: "rgb(255 255 255 / 0.1)",
            },
          })}
          width={handle.props.me.width}
          height={handle.props.me.height}
          alt="Logan McAnsh"
          fetchPriority="high"
          src={handle.props.me.url}
          srcSet={handle.props.me.srcSet}
        />
        <div
          mix={[
            spaceY("0.5rem"),
            css({
              marginBlockStart: "1rem",
              maxWidth: "var(--container-xs)",
              "@media (width >= 48rem)": {
                maxWidth: "var(--container-sm)",
              },
            }),
          ]}
        >
          <h1
            mix={css({
              fontSize: "var(--text-4xl)",
              lineHeight: "var(--text-4xl--line-height)",
              fontWeight: 500,
              textWrap: "balance",
            })}
          >
            Logan McAnsh
          </h1>
          <p
            mix={css({
              fontSize: "var(--text-lg)",
              lineHeight: "var(--text-lg--line-height)",
              textWrap: "pretty",
              "@media (width >= 40rem)": {
                fontSize: "var(--text-xl)",
                lineHeight: "var(--text-xl--line-height)",
              },
            })}
          >
            Senior Software Engineer
          </p>
          <p
            mix={css({
              marginBlockStart: "0.5rem",
              fontSize: "var(--text-base)",
              lineHeight: "var(--text-base--line-height)",
              color: "rgb(0 0 0 / 0.6)",
              "@media (prefers-color-scheme: dark)": {
                color: "rgb(255 255 255 / 0.7)",
              },
            })}
          >
            Current: United Wholesale Mortgage
          </p>
          <p
            mix={css({
              fontSize: "var(--text-base)",
              lineHeight: "var(--text-base--line-height)",
              color: "rgb(0 0 0 / 0.6)",
              "@media (prefers-color-scheme: dark)": {
                color: "rgb(255 255 255 / 0.7)",
              },
            })}
          >
            Past: Shopify × Remix
          </p>
        </div>
      </div>
      <div
        mix={[
          css({
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
            paddingBlockEnd: "2rem",
            paddingBlockStart: "1.25rem",
          }),
        ]}
      >
        <a
          href="https://github.com/mcansh"
          mix={css({
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            color: "inherit",
            textDecoration: "none",
            borderBottom: "1px solid currentColor",
            paddingBottom: "2px",
            transition: "opacity 0.15s ease",
            "&:hover": { opacity: 0.7 },
          })}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href={routes.resume.href()}
          mix={css({
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            color: "inherit",
            textDecoration: "none",
            borderBottom: "1px solid currentColor",
            paddingBottom: "2px",
            transition: "opacity 0.15s ease",
            "&:hover": { opacity: 0.7 },
          })}
        >
          Resume
        </a>
      </div>
      <DesignSwitcher designIndex={designIndex} fontIndex={fontIndex} />
    </main>
  )
}
