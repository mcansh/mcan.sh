import type { Handle } from "remix/ui";
import { css } from "remix/ui";

import { routes } from "../routes.ts";
import { Document } from "./document.tsx";
import { spaceX, spaceY } from "./public/css-mixins.ts";

type HomePageProps = {
  me: {
    size: number
    url: string
    srcSet: string
  }
}

export function HomePage(handle: Handle<HomePageProps>) {
  return () => (
    <Document
      head={<HomeHead />}
      mix={[
        css({
          "&, body": {
            height: "100dvh",
            fontWeight: 100,
            "@media (prefers-color-scheme: dark)": {
              color: "white",
              backgroundColor: "black",
            },
          },
        }),
      ]}
    >
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
            })}
            width={handle.props.me.size}
            height={handle.props.me.size}
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
              })}
            >
              Logan McAnsh
            </h1>
            <p
              mix={css({
                fontSize: "var(--text-lg)",
                lineHeight: "var(--text-lg--line-height)",

                "@media (width >= 40rem)": {
                  fontSize: "var(--text-xl)",
                  lineHeight: "var(--text-xl--line-height)",
                },
              })}
            >
              Senior Software Engineer
            </p>
            <h2>Current: United Wholesale Mortgage</h2>
            <code>Past: Shopify x Remix</code>
          </div>
        </div>
        <div
          className="flex space-x-4 pt-5 pb-8 [@media(display-mode:standalone)]:pb-0"
          mix={[
            css({
              display: "flex",
              paddingBlockEnd: "2rem",
              paddingBlockStart: "1.25rem",
            }),
            spaceX("1rem"),
          ]}
        >
          <a href="https://github.com/mcansh">GitHub</a>
          <a href={routes.resume.href()}>Resume</a>
        </div>
      </main>
    </Document>
  )
}

function HomeHead() {
  return () => (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
      />
    </>
  )
}
