import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import Node, { NodeId, NodeOptions } from '../../main/node';
import electron from '../electronGlobal';

type CustomerErrorType = {
  message: string;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProviderResponse = any;

// Define a service using a base URL and expected endpoints
// lots of issues in RTKQ github complaining about typescript breaking changes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RtkqNodeService: any = createApi({
  reducerPath: 'RtkqNodeService',
  baseQuery: fakeBaseQuery<CustomerErrorType>(),
  endpoints: (builder) => ({
    getNodes: builder.query<ProviderResponse, Node[]>({
      queryFn: async () => {
        let data;
        try {
          data = await electron.getNodes();
        } catch (e) {
          const error = { message: 'Unable to getNodes' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    addNode: builder.query<ProviderResponse, NodeOptions>({
      queryFn: async (nodeOptions: NodeOptions) => {
        let data;
        try {
          data = await electron.addNode(nodeOptions);
        } catch (e) {
          const error = { message: 'Unable to addNode' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    // getNode: builder.query<ProviderResponse, Node>({
    //   queryFn: async (nodeId: NodeId) => {
    //     let data;
    //     try {
    //       data = await electron.getNode(nodeId);
    //     } catch (e) {
    //       const error = { message: 'Unable to getNode' };
    //       console.log(e);
    //       return { error };
    //     }
    //     return { data };
    //   },
    // }),
  }),
});

export const { useGetNodesQuery, useAddNodeQuery } = RtkqNodeService;