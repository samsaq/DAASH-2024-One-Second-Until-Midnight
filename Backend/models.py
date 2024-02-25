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
                "location": "Seattle",  # city for the node
                "status": "Operational",  # Operational (Green), Disrupted (Yellow), Down (Red)
            },
        )
        await db.create(
            "infrastructure:hospital",
            {
                "capacity": 1500,  # patients
                "location": "Seattle",  # city for the node
                "status": "Disrupted",  # Operational (Green), Disrupted (Yellow), Down (Red)
            },
        )
        await db.create(
            "infrastructure:airport",
            {
                "throughput": 300,  # passengers per hour
                "location": "Seattle",  # city for the node
                "status": "Operational",  # Operational (Green), Disrupted (Yellow), Down (Red)
            },
        )

        print(await db.select("infrastructure"))

        print(
            await db.query(
                "RELATE infrastructure:hospital->depends->infrastructure:powerplant SET required=true, powerNeed=100"
            )
        )
        await db.query(
            "RELATE infrastructure:hospital->depends->infrastructure:airport SET required=true"
        )


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
