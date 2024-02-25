"use client";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import { SearchIcon } from "@/components/icons";
import { Kbd } from "@nextui-org/kbd";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

export default function Home() {
  const router = useRouter();

  function handleCitySubmit(city: string) {
    if (city == "Seattle") {
      router.push("/seattle");
    }
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Infra</h1>
        <h1 className={title({ color: "violet" })}>Status&nbsp;</h1>
        <br />
        <h2 className={subtitle({ class: "mt-4" })}>
          Critical Infrastructure status reports
        </h2>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          href={siteConfig.links.documentation}
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="mt-8">
        <span>
          <Input
            aria-label="Search"
            classNames={{
              inputWrapper: "bg-default-100",
              input: "text-md",
            }}
            endContent={
              <Kbd className="hidden lg:inline-block" keys={["command"]}>
                K
              </Kbd>
            }
            labelPlacement="outside"
            placeholder="Search a city here..."
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCitySubmit(event.currentTarget.value);
              }
            }}
            startContent={
              <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="search"
          />
        </span>
      </div>
    </section>
  );
}
