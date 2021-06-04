import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { getInformation as getJuniperInformation, setSOConfiguration as setJuniperSOConfiguration } from "./juniper"

const createCloudConnection: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('create_juniper_cloud_connection function processed a request.');
    try {
        await getJuniperInformation(context);
        await setJuniperSOConfiguration(context);
        context.res = {status: 200};
    } catch (error) {
        context.res = {
            status: 500,
            body: error,
        };
    }
};

export default createCloudConnection;
