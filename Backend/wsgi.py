import flask, flask_cors
from surrealdb import Surreal

app = flask.Flask(__name__)
flask_cors.CORS(app)

debug = True


# API call to get the status of a specific node
@app.route("/status/<node>", methods=["GET"])
async def getNodeStatus(node):
    async with Surreal("ws://localhost:8000/rpc") as db:
        await db.use("infrastructure", "infrastructure")
        result = await db.select(f"infrastructure:{node}")
        if result is None:
            return {"error": "Node not found"}, 404
        else:
            result = private_updateStatus(node)
            return flask.jsonify(result), 200


# API call to get the status of a specific city, queries the db for all the nodes that are located in that city, and the status of each node
@app.route("/status/city/<city>", methods=["GET"])
async def getCityStatus(city="Seattle"):
    async with Surreal("ws://localhost:8000/rpc") as db:
        await db.use("infrastructure", "infrastructure")
        result = await db.query(f"SELECT * FROM infrastructure WHERE location='{city}'")
        if result is None:
            return {"error": "City not found or has no infrastructure"}, 404
        else:
            # for each result, we need to get the id, and status, and then return the list of tuples
            result = [(node["id"], node["status"]) for node in result[0]["result"]]
            # strip the insfrastrucutre: from the ids of the nodes
            result = [(node[0].split(":")[1], node[1]) for node in result]
            # for each node id in the result, we need to update the status of the node
            for node in result:
                status = await private_updateStatus(node[0])
                node = (node[0], status)
            return flask.jsonify(result), 200


# API call to get the depencies of a specific node
@app.route("/dependencies/<node>", methods=["GET"])
async def getDependencies(node):
    node = f"infrastructure:{node}"
    async with Surreal("ws://localhost:8000/rpc") as db:
        await db.use("infrastructure", "infrastructure")
        result = await db.query(
            f"SELECT ->depends->infrastructure FROM infrastructure WHERE id='{node}'"
        )
        if result is None:
            return {"error": "Node not found"}, 404
        else:
            try:
                dependencies = result[0]["result"][0]["->depends"]["->infrastructure"]
                # if the array is empty, we have no dependencies
                if len(dependencies) == 0:
                    return {"error": "Node has no dependencies"}, 404
                # strip the insfrastrucutre: from all the elements of the dependencies list
                cleanedDependencies = [
                    dependency.split(":")[1] for dependency in dependencies
                ]
                return flask.jsonify(cleanedDependencies), 200
            except Exception as e:
                return {"error": "Node has no dependencies"}, 404


# an internal helper function to check and update the status of a node
# this means the function will check the dependencies of the node, and if any of them are down, the node will be marked as disrupted
# if the dependencies are labeled as required are disrupted or down, the node will be marked as down
# if any dependencies are down, the node will be marked as down
# else it'll be operational
async def private_updateStatus(node):
    async with Surreal("ws://localhost:8000/rpc") as db:
        await db.use("infrastructure", "infrastructure")
        dependencies = await private_getDependencies(node, db)
        if "error: Node has no dependencies" in dependencies:
            # find the node and update its status to operational
            # fetch the node, and update it the same with the status set to operational
            originalNode = await db.select(f"infrastructure:{node}")
            originalNode["status"] = "Operational"
            await db.update(f"infrastructure:{node}", originalNode)
            return "Operational"

        # check if private_getDependencies returned an error
        if "error" in dependencies:
            return dependencies

        # if the node has dependencies, we need to check their status using the recursiveCheck function
        for dependency in dependencies:
            dependencyStatus = await recursiveCheck(dependency, db)
            if dependencyStatus == "Down":
                # update the status of the node to down
                originalNode = await db.select(f"infrastructure:{node}")
                originalNode["status"] = "Down"
                await db.update(f"infrastructure:{node}", originalNode)
                return "Down"
            elif dependencyStatus == "Disrupted":
                # update the status of the node to disrupted
                originalNode = await db.select(f"infrastructure:{node}")
                originalNode["status"] = "Disrupted"
                await db.update(f"infrastructure:{node}", originalNode)
                return "Disrupted"
        # in the case that all the dependencies are operational, we can update the status of the node to operational
        originalNode = await db.select(f"infrastructure:{node}")
        originalNode["status"] = "Operational"
        await db.update(f"infrastructure:{node}", originalNode)
        return "Operational"


# if we have dependencies, we need to recursively check their status until we reach the bottom of the dependency tree
# or until we find a node that is down, at which point we can return down
# if we just find disrupted nodes, we can return disrupted unless the edges are required, in which case we can return down
# if we find no down or disrupted nodes, we can return operational
# lets get recursive
async def recursiveCheck(node, db):
    # get the status of the node
    status = await db.select(f"infrastructure:{node}")
    if status is None:
        return "error: Node not found"
    else:
        status = status["status"]
    if status == "Operational":
        # if the node is operational, we need to check its dependencies
        dependencies = await private_getDependencies(node, db)
        if "error: Node has no dependencies" in dependencies:
            # update the status of the node to operational
            originalNode = await db.select(f"infrastructure:{node}")
            originalNode["status"] = "Operational"
            await db.update(f"infrastructure:{node}", originalNode)
            return "Operational"

        # check if private_getDependencies returned an error
        if "error" in dependencies:
            return dependencies
        else:
            # if the node has dependencies, we need to check their status
            for dependency in dependencies:
                dependencyStatus = await recursiveCheck(dependency, db)
                if dependencyStatus == "Down":
                    # update the status of the node to down
                    originalNode = await db.select(f"infrastructure:{node}")
                    originalNode["status"] = "Down"
                    await db.update(f"infrastructure:{node}", originalNode)
                    return "Down"
                elif dependencyStatus == "Disrupted":
                    # update the status of the node to disrupted
                    originalNode = await db.select(f"infrastructure:{node}")
                    originalNode["status"] = "Disrupted"
                    await db.update(f"infrastructure:{node}", originalNode)
                    return "Disrupted"
            # in the case that all the dependencies are operational, we can update the status of the node to operational
            originalNode = await db.select(f"infrastructure:{node}")
            originalNode["status"] = "Operational"
            await db.update(f"infrastructure:{node}", originalNode)
            return "Operational"
    else:
        return status


async def private_getDependencies(node, db):
    node = f"infrastructure:{node}"
    await db.use("infrastructure", "infrastructure")
    dependencies = await db.query(
        f"SELECT ->depends->infrastructure FROM infrastructure WHERE id='{node}'"
    )
    if dependencies is None:
        return "error: Node not found"
    else:
        try:
            dependencies = dependencies[0]["result"][0]["->depends"]["->infrastructure"]
            # if the array is empty, we have no dependencies
            if len(dependencies) == 0:
                return "error: Node has no dependencies"
            # strip the insfrastrucutre: from all the elements of the dependencies list
            cleanedDependencies = [
                dependency.split(":")[1] for dependency in dependencies
            ]
            return cleanedDependencies
        except Exception as e:
            return "error: Node has no dependencies"


# testing the connection to the local db
async def debug():
    # result = await getNodeStatus("powerplant")
    # print(result)
    # result = await getCityStatus("Seattle")
    # print(result)
    # result = await getDependencies("hospital")
    # print(result)
    # result = await private_updateStatus("hospital")
    # print(result)
    pass


if __name__ == "__main__":
    # asyncio.run(main())
    # app.run(debug=debug)
    if debug:
        import asyncio

        asyncio.run(debug())
