import flask, flask_cors
from surrealdb import Surreal

app = flask.Flask(__name__)
flask_cors.CORS(app)

debug = True


# testing the connection to the local db
async def main():
    """Example of how to use the SurrealDB client."""
    async with Surreal("ws://localhost:8000/rpc") as db:
        # await db.signin({"user": "root", "pass": "root"})
        # await db.use("test", "test")
        await db.create(
            "intersection:1",
            {
                "throughput": 300,  # per minute
                "active": True,
            },
            "intersection:2",
            {
                "throughput": 300,  # per minute
                "active": True,
            },
        )
        print(await db.select("intersection"))
        await db.query(
            "RELATE intersection:1->road->intersection:2 SET carsOnRoad=[1,2,3,4,5], reservations=[(6, 13:30),(7, 13:35),(8, 13:35),(9, 13:40),(10,13:40)] active=True"
        )
        print(
            await db.update(
                "person",
                {
                    "user": "you",
                    "pass": "very_safe",
                    "marketing": False,
                    "tags": ["Awesome"],
                },
            )
        )
        print(await db.delete("person"))

        # You can also use the query method
        # doing all of the above and more in SurrealQl

        # In SurrealQL you can do a direct insert
        # and the table will be created if it doesn't exist
        await db.query(
            """
        insert into person {
            user: 'me',
            pass: 'very_safe',
            tags: ['python', 'documentation']
        };
        
        """
        )
        print(await db.query("select * from person"))

        print(
            await db.query(
                """
        update person content {
            user: 'you',
            pass: 'more_safe',
            tags: ['awesome']
        };
        
        """
            )
        )
        print(await db.query("delete person"))


if __name__ == "__main__":
    # asyncio.run(main())
    app.run(debug=debug)
