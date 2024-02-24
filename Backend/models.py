from surrealdb import Surreal

# A little script to create the database schema for surreal db


async def main():
    async with Surreal("ws://localhost:8000/rpc") as db:
        # we're just gonna have one table for the infrastructure (the nodes of the graph)
        # all the dependencies will be the edges connecting the infrastructure
        await db.use("infrastructure", "infrastructure")
        await db.create(
            "infrastructure:powerplant",
            {
                "throughput": 300,  # kwh
                "status": "Operational",  # Operational (Green), Disrupted (Yellow), Down (Red)
            },
        )
        await db.create(
            "infrastructure:hospital",
            {
                "capacity": 1500,  # patients
                "status": "Operational",  # Operational (Green), Disrupted (Yellow), Down (Red)
            },
        )

        print(await db.select("infrastructure"))

        print(
            await db.query(
                "RELATE infrastructure:hospital->depends->infrastructure:powerplant SET powerNeed=100"
            )
        )


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
