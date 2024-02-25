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
          title={infraName}
        >
          {"dependent infrastructure status"}
        </AccordionItem>
      </Accordion>
    );
  });
}


// return (
//   <Accordion>
//     <AccordionItem key="1" aria-label="Power Plant" subtitle="Press to expand" title="Power Plant">
//       {defaultContent}
//     </AccordionItem>
//     <AccordionItem
//       key="2"
//       aria-label="Hospital"
//       subtitle={
//         <span>
//           Press to expand <strong>key 2</strong>
//         </span>
//       }
//       title="Hospital"
//     >
//       {defaultContent}
//     </AccordionItem>
//     <AccordionItem key="3" aria-label="Airport" subtitle="Press to expand" title="Airport">
//       {defaultContent}
//     </AccordionItem>
//   </Accordion>
// );
