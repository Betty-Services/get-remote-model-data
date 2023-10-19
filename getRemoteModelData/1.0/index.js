const getRemoteModelData = async ({
  apiUrl,
  modelName,
  authProfile,
  email,
  password,
  params,
  retrieveType,
  parentMapping,
}) => {
  const take = params && params.take ? params.take : 200;
  const skip = params && params.skip ? params.skip : 0;

  const allModel = retrieveType === "all";

  const generateWhere = () => {
    const whereCol = [];
    let whereObj = "";
    let logicalOperator = "_and";
    let parentFilterSome;

    if (params && params.conditions) {
      if (
        params.conditions.length > 0 &&
        params.conditions[0].filters &&
        params.conditions[0].filters.length > 0 &&
        params.conditions[0].filters[0].filters
      ) {
        console.error("ERROR: Grouping of filters is currently NOT supported.");
        throw new Error("Grouping of filters is currently NOT supported.");
      } else {
        try {
          if (
            params.conditions[0].filters.length >= 1 ||
            params.conditions[0]
          ) {
            logicalOperator = "_" + params.conditions[0].operator;
            params.conditions.forEach((condition, i) => {
              condition.filters.forEach((filter, j) => {
                parentFilterSome = parentMapping.some(
                  (x) => x.value == filter.field
                );
                const parentModelObj = parentMapping.find(
                  (x) => x.value == filter.field
                );
                if (parentFilterSome) {
                  const gqlWhere = `{${parentModelObj.key}: {id: {${filter.operator}: ${filter.value}}}}`;
                  whereCol.push(gqlWhere);
                } else {
                  const gqlWhere = `{${filter.field}: {${filter.operator}: ${filter.value}}}`;
                  whereCol.push(gqlWhere);
                }
              });
            });
            whereObj = `where: {${logicalOperator}: [${whereCol}]}`;
          } else {
            parentFilterSome = parentMapping.some(
              (x) => x.value == params.conditions[0].filters[0].field
            );
            if (parentFilterSome) {
            }
            whereObj = `where: {${params.conditions[0].filters[0].field}: { ${params.conditions[0].filters[0].operator} : ${params.conditions[0].filters[0].value} }}`;
          }
        } catch (error) {}
      }
    }
    return whereObj;
  };

  const where = generateWhere();
  const graphQLModel =
    retrieveType + modelName.charAt(0).toUpperCase() + modelName.slice(1);

  let startArray = params.select;
  parentMapping.forEach((obj) => {
    startArray = startArray.filter((x) => x !== obj.value);
    startArray.push(`${obj.key}{
      id
    }`);
  });
  const modelProperties = startArray.join("\r\n");

  const getQuery = allModel
    ? JSON.stringify({
        query: `{ \n ${graphQLModel}(${where} skip: ${skip}, take: ${take}) { results { ${modelProperties} } totalCount } }`,
      })
    : JSON.stringify({
        query: `{ \n ${graphQLModel}(${where}) { ${modelProperties} } }`,
      });

  const loginQuery = JSON.stringify({
    operationName: "login",
    variables: {},
    query: `mutation login {\n  login(authProfileUuid: "${authProfile}", username: "${email}", password: "${password}") {\n    jwtToken\n  }\n}\n`,
  });
  let fetchSettings = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "",
  };

  const bearerToken =
    "Bearer " + (await authenticate(fetchSettings, loginQuery, apiUrl));
  fetchSettings.headers = {
    ...fetchSettings.headers,
    Authorization: bearerToken,
  };
  fetchSettings.body = getQuery;

  const jsonData = await getData(apiUrl, fetchSettings).then((result) => {
    return result;
  });

  let results = allModel
    ? jsonData.data[graphQLModel].results
    : jsonData.data[graphQLModel];

  parentMapping.forEach((obj) => {
    results = results.map((result) => {
      let id = result[obj.key] ? result[obj.key].id : "";
      return { ...result, [obj.value]: id };
    });
  });

  if (allModel) {
    return {
      response: {
        results: results,
        params: params,
        totalCount: jsonData.data[graphQLModel].totalCount,
      },
    };
  }

  return {
    response: results,
  };
};

async function getData(apiUrl, fetchSettings) {
  const data = fetch(apiUrl, fetchSettings)
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      if (result) {
        return result;
      } else throw "Error data";
    });
  return data;
}

function authenticate(fetchSettings, loginQuery, apiUrl) {
  fetchSettings.body = loginQuery;
  const data = fetch(apiUrl, fetchSettings)
    .then((res) => res.json())
    .then((result) => {
      if (result.data.login.jwtToken) {
        return result.data.login.jwtToken;
      } else throw "Authentication failed.";
    })
    .catch((e) => {
      return "Error: " + e;
    });
  return data;
}

export default getRemoteModelData;
