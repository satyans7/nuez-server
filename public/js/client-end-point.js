const apiToFetchAllDataFromServer = "/api/data/all";

export function getApiToFetchAllDataFromServer() {
    return apiToFetchAllDataFromServer;
}

export async function getDataFromServer(apiEndPoint) {
    return await fetch(apiEndPoint)
      .then((response) => {
        return response.ok
          ? response.json()
          : response.text().then((text) => {
              throw new Error(`[${response.status}] ${text}`);
            });
      })
      .catch((error) => {
        console.error("Error getting data:", error.message);
        return null;
      });
  }