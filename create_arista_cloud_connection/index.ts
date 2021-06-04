import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { getInformation as getAristaInformation, setSOConfiguration as setAristaSOConfiguration } from "./arista"

const createCloudConnection: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('create_arista_cloud_connection function processed a request.');
    try {
        await getAristaInformation(context);
        const res = await setAristaSOConfiguration(context);
        context.res = {status: 200, body: res};
    } catch (error) {
        context.res = {
            status: 500,
            body: error,
        };
    }
};

export default createCloudConnection;
