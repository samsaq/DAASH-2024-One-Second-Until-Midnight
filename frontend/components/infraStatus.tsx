'use client'
import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";


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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {infraName}
              {status === "operational" &&
                <span style={{
                  height: '10px',
                  width: '10px',
                  backgroundColor: 'green',
                  borderRadius: '50%',
                  marginLeft: '10px'
                }}
                />
              }
              {status === "Disrupted" &&
                <span style={{
                  height: '10px',
                  width: '10px',
                  backgroundColor: 'yellow',
                  borderRadius: '50%',
                  marginLeft: '10px'
                }}
                />
              }
            </div>
          }
        >
          {"dependency: infrastructure status"}
        </AccordionItem>
      </Accordion>
    );
  });
}
