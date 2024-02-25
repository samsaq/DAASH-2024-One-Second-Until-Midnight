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
import { useEffect, useState } from "react";
import InfraStatus from "@/components/infraStatus";

export default function Home() {
  const [infraState, setInfraState] = useState([["", ""]]);
  const [dependentData, setDependentData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/status/city/Seattle")
      .then((response) => response.json())
      //.then(data => console.log(data))
      .then((data) => {
        setInfraState(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    // Ensure infraState is not null before making the API call
    if (infraState) {
      infraState.map((infraItem: string[]) => {
        // Update the type annotation of infraItem
        const urlBasedOnInfraState = `http://127.0.0.1:5000/dependencies/${infraItem[0]}`;
        fetch(urlBasedOnInfraState)
          .then((response) => response.json())
          // .then(data => console.log(data))
          .then((data) => {
            setDependentData(data);
          })
          .catch((error) =>
            console.error("Error fetching dependent data:", error)
          );
      });
    }
  }, [infraState]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title({ color: "violet" })}>Seattle&nbsp;</h1>
        <h1 className={title()}>Status</h1>
        <br />
      </div>
      <div className="flex">
        {infraState && <InfraStatus infra={infraState as [string, string][]} />}
      </div>
    </section>
  );
}
