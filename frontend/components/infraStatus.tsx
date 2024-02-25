"use client";
import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import Pulse from "./pulse";

interface City {
  infra: [string, string][];
}

export default function InfraStatus({ infra }: City) {
  return infra.map((infraItem: [string, string], i: number) => {
    const [infraName, status] = infraItem;
    return (
      <Accordion key={i}>
        <AccordionItem
          aria-label={infraName}
          subtitle="Press to expand"
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              {status === "Operational" && <Pulse color="Green" />}
              {status === "Disrupted" && <Pulse color="Yellow" />}
              {status === "Down" && <Pulse color="Red" />}
              {infraName}
            </div>
          }
        >
          {"dependency: infrastructure status"}
        </AccordionItem>
      </Accordion>
    );
  });
}
