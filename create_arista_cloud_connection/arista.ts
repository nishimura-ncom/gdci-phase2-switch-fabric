import axios, { AxiosResponse } from "axios"
import {Context} from "@azure/functions";

export const getInformation = (context: Context): Promise<string> => {
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

export const setSOConfiguration = (context: Context): Promise<string> => {
    context.log("will set Service Order Config into juniper switch");

    const cmds: string[] = [
        "enable",
        "configure",
        "interface Ethernet 1",
        "description test1",
        "no shutdown",
        "no switchport",
        "interface Ethernet 1.501",
        "description vlan501",
        "encapsulation dot1q vlan 113",
        //"vlan id 113", 'not supported on this hardware platform' error occur
    ];

    return axios({
        method: 'post',
        url: 'http://10.0.0.4/command-api',
        data: `{"jsonrpc": "2.0","method": "runCmds","params": {"version": 1,"cmds":${JSON.stringify(cmds)}},"id":1}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        auth: {
            username: 'tomo',
            password: 'applepen1'
        },
    }).then((response: AxiosResponse)  => {
        context.log("set Service Order Config into juniper switch");
        context.log(response.data);
        return response.data;
    });
};
