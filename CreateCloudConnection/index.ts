import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { getInformation as getJuniperInformation, setSOConfiguration as setJuniperSOConfiguration } from "./juniper"
import { getInformation as getAristaInformation, setSOConfiguration as setAristaSOConfiguration } from "./arista"

const createCloudConnection: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    console.log('CreateCloudConnection function processed a request.');
    try {
        await getJuniperInformation();
        await setJuniperSOConfiguration();
        await getAristaInformation();
        await setAristaSOConfiguration();
        context.res = {status: 200};
    } catch (error) {
        context.res = {
            status: 500,
            body: error,
        };
    }
};

export default createCloudConnection;
