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
          subtitle="Press to see dependencies"
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              {status === "Operational" && <Pulse color="Green" />}
              {status === "Disrupted" && <Pulse color="Yellow" />}
              {status === "Down" && <Pulse color="Red" />}
              {infraName}
            </div>
          }
        >
          {infraName == "hospital" ? (
            <ul>
              <li>airport</li>
              <li>powerplant</li>
            </ul>
          ) : (
            "None"
          )}
        </AccordionItem>
      </Accordion>
    );
  });
}
