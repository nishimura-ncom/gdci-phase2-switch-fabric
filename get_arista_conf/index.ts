import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, {AxiosResponse} from "axios";

const createCloudConnection: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('create_arista_cloud_connection function processed a request.');
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
    context.log("will fetch switch information from arista switch");

    return axios({
        method: 'post',
        url: 'http://10.0.0.4/command-api',
        data: '{"jsonrpc": "2.0","method": "runCmds","params": {"version": 1,"cmds":["enable", "show running-config"]},"id":1}',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        auth: {
            username: 'tomo',
            password: 'applepen1'
        },
    }).then((response: AxiosResponse)  => {
        context.log("fetched switch information from arista switch");
        context.log(response.data);
        return response.data;
    });
};

export default createCloudConnection;
