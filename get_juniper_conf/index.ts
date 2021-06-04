import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, {AxiosResponse} from "axios";

const createCloudConnection: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('create_juniper_cloud_connection function processed a request.');
    try {
        const res = await getInformation(context);
        context.res = {status: 200, body: res};
    } catch (error) {
        context.res = {
            status: 500,
            body: error,
        };
    }
};

const getInformation = (context: Context): Promise<string> => {
    context.log("will fetch switch information from juniper switch");
    context.log("WEBSITE_PRIVATE_IP: " + process.env["WEBSITE_PRIVATE_IP"]);

    return axios({
        method: 'post',
        url: 'http://10.0.3.10:3030/rpc',
        data: '<get-configuration/>',
        headers: {
            'Content-Type': 'application/xml',
            'Accept': 'application/json'
        },
        auth: {
            username: 'tomo',
            password: 'applepen1'
        },
    }).then((response: AxiosResponse)  => {
        context.log("fetched switch information from juniper switch");
        context.log(response.data);
        return response.data;
    });
};

export default createCloudConnection;
