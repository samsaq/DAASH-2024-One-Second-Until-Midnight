"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Textarea,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useState } from "react";

//footer should have a link to the github repo, my name (samsaq), and the year
export default function Home() {
  const [selectedKey, setSelectedKey] = useState("Get Infra Status");
  const [resultsValue, setResultsValue] = useState("");

  const baseURL = "http://127.0.0.1:5000/";
  function handleServiceSubmit(input: string) {
    if (selectedKey === "Get Infra Status") {
      const requestURL = baseURL + "status/" + input;
      fetch(requestURL)
        .then((response) => response.json())
        .then((data) => {
          setResultsValue(JSON.stringify(data));
        });
    } else if (selectedKey === "Get City Infra Status") {
      const requestURL = baseURL + "status/city/" + input;
      fetch(requestURL)
        .then((response) => response.json())
        .then((data) => {
          setResultsValue(JSON.stringify(data));
        });
    } else if (selectedKey === "Get Infra Dependencies") {
      const requestURL = baseURL + "dependencies/" + input;
      fetch(requestURL)
        .then((response) => response.json())
        .then((data) => {
          setResultsValue(JSON.stringify(data));
        });
    } else {
      console.log("Error: No endpoint selected. This should never happen.");
    }
  }
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center pt-24 px-24 dark text-foreground bg-background">
        <div className="py-2">
          <p className="text-5xl font-semibold">API Explorer</p>
          <Input
            type="text"
            variant="underlined"
            label="Input"
            isClearable
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleServiceSubmit(event.currentTarget.value);
              }
            }}
          />
          <div className="pt-4 flex items-center justify-center flex-row">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">Endpoint</Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedKey}
              >
                <DropdownItem
                  key="Get Infra Status"
                  onClick={() => setSelectedKey("Get Infra Status")}
                >
                  Get Infra Status
                </DropdownItem>
                <DropdownItem
                  key="Get City Infra Status"
                  onClick={() => setSelectedKey("Get City Infra Status")}
                >
                  Get City Infra Status
                </DropdownItem>
                <DropdownItem
                  key="Get Infra Dependencies"
                  onClick={() => setSelectedKey("Get Infra Dependencies")}
                >
                  Get Infra Dependencies
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <Textarea
          isReadOnly
          label="Results"
          variant="bordered"
          labelPlacement="outside"
          placeholder="The results of your API calls will go here."
          className="max-w-lg"
          value={resultsValue}
        />
        <Table
          removeWrapper
          aria-label="Example static collection table"
          className="p-8 max-w-7xl"
        >
          <TableHeader>
            <TableColumn>ENDPOINT</TableColumn>
            <TableColumn>INPUT</TableColumn>
            <TableColumn>OUTPUT</TableColumn>
            <TableColumn>URL</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>Get Infra Status</TableCell>
              <TableCell>
                A unique name for a piece of infrastructure (eg: hospital for
                our example)
              </TableCell>
              <TableCell>
                A status in the form &quot;Operational&quot;,
                &quot;Disrupted&quot;, and &quot;Down&quot;
              </TableCell>
              <TableCell>https://localhost:5000/status/INFRANAME</TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>Get City Infra Status</TableCell>
              <TableCell>A unique city name (eg: Seattle)</TableCell>
              <TableCell>
                A JSON of tuples of infrastructure names and their statuses
              </TableCell>
              <TableCell>https://localhost:5000/status/city/CITYNAME</TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell>Get Infra Dependencies</TableCell>
              <TableCell>
                A unique name for a piece of infrastructure (eg: hospital)
              </TableCell>
              <TableCell>
                A JSON list of infrastructure names that the input
                infrastructure relies on
              </TableCell>
              <TableCell>
                https://localhost:5000/dependencies/INFRANAME
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </main>

      <div className="flex flex-row items-center justify-center h-12 dark text-foreground absolute bottom-0 w-full  bg-stone-950">
        <a
          href="https://github.com/samsaq/DAASH-2024-One-Second-Until-Midnight"
          className=" decoration-solid decoration-white underline mx-4"
        >
          Github
        </a>
      </div>
    </>
  );
}
