import axios, { AxiosResponse } from "axios"
import {Context} from "@azure/functions";

export const getInformation = (context: Context): Promise<string> => {
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

export const setSOConfiguration = (context: Context): Promise<string> => {
    context.log("will set Service Order Config into juniper switch");

    return axios({
        method: 'post',
        url: 'http://10.0.3.10:3030/rpc',
        data: `
<edit-config>
  <target>
    <candidate />
  </target>
  <config>
    <configuration>
      <interfaces>
        <interface>
          <name>ae0</name>
          <flexible-vlan-tagging />
          <encapsulation>flexible-ethernet-services</encapsulation>
          <unit>
            <name>0</name>
            <encapsulation>vlan-bridge</encapsulation>
            <vlan-id>20</vlan-id>
            <family>
              <bridge>
                <filter>
                  <input>
                    <filter-name>In-Rate-Filter-3G</filter-name>
                  </input>
                  <output>
                    <filter-name>Out-Rate-Filter-3G</filter-name>
                  </output>
                </filter>
              </bridge>
            </family>
          </unit>
        </interface>
        <interface>
          <name>ae1</name>
          <flexible-vlan-tagging />
          <encapsulation>flexible-ethernet-services</encapsulation>
          <unit>
            <name>0</name>
            <encapsulation>vlan-bridge</encapsulation>
            <vlan-id>20</vlan-id>
            <family>
              <bridge>
                <filter>
                  <input>
                    <filter-name>In-Rate-Filter-3G</filter-name>
                  </input>
                  <output>
                    <filter-name>Out-Rate-Filter-3G</filter-name>
                  </output>
                </filter>
              </bridge>
            </family>
          </unit>
        </interface>
      </interfaces>
      <routing-instances>
        <instance>
          <name>20</name>
          <instance-type>virtual-switch</instance-type>
          <bridge-domains>
            <domain>
              <name>order1</name>
              <vlan-id>20</vlan-id>
              <interface>
                <name>ae0.0</name>
              </interface>
              <interface>
                <name>ae1.0</name>
              </interface>
              <forwarding-options>
                <flood>
                  <input>bum-control</input>
                </flood>
              </forwarding-options>
              <bridge-options>
                <interface-mac-limit>
                  <limit>64</limit>
                  <packet-action>drop</packet-action>
                </interface-mac-limit>
              </bridge-options>
            </domain>
          </bridge-domains>
        </instance>
      </routing-instances>
    </configuration>
  </config>
</edit-config>
`,
        headers: {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml'
        },
        auth: {
            username: 'tomo',
            password: 'applepen1'
        },
    }).then((response: AxiosResponse)  => {
        context.log("setting Service Order Config into juniper switch is success: " + response.status);
        context.log(response.data);

        context.log("will send commit command");
        return axios({
            method: 'post',
            url: 'http://10.0.3.10:3030/rpc',
            data: '<commit/>',
            headers: {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            },
            auth: {
                username: 'tomo',
                password: 'applepen1'
            },
        });
    }).then((response: AxiosResponse)  => {
        context.log("committing is success: " + response.status);
        context.log(response.data);
        return response.data
    });
};
