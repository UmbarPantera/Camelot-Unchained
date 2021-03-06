/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import {
  query,
  QueryOptions,
  GraphQLQuery,
  parseQuery,
  defaultQuery,
} from './query';
import {
  subscribe,
  Subscription,
  defaultSubscription,
  SubscriptionResult,
  SubscriptionManager,
  Options as SubscriptionOptions,
  defaultSubscriptionOpts,
  Options,
} from './subscription';
import { ErrorBoundary } from '../components/ErrorBoundary';

export interface GraphQLOptions extends QueryOptions {
  // if set to a number greater than 0, in ms, the component will poll the server on an interval
  // skipping the cache (default: 0)
  pollInterval: number;

  // No cache support yet
  // Should we use the GraphQL cache? (default: true)
  // useCache: boolean;
}

const defaultGraphQLOptions: GraphQLOptions = {
  ...game.graphQL.defaultOptions() as QueryOptions,
  pollInterval: 0,
  // useCache: true,
};

export class GraphQLClient {
  private conf: QueryOptions;
  public lastQuery: {
    query: string;
    variables: Dictionary<any>;
    headers?: Dictionary<string> | null;
    apiHost?: string;
    namedQuery?: string;
    useNamedQueryCache?: boolean;
    operationName?: string;
  };

  constructor(options: QueryOptions) {
    this.conf = options;
  }

  public query = async (query: GraphQLQuery) => {
    this.lastQuery = query as any;
    this.lastQuery.query = parseQuery(query.query);
    return await this.refetch();
  }

  public refetch = async () => {
    if (!this.lastQuery) {
      return {
        data: null,
        ok: false,
        statusText: 'No query to refetch.',
      };
    }

    return await query({
      query: this.lastQuery.query,
      operationName: this.lastQuery.operationName,
      namedQuery: this.lastQuery.namedQuery,
      useNamedQueryCache: this.lastQuery.useNamedQueryCache,
      variables: this.lastQuery.variables,
    }, this.conf);
  }

  public setConf = (options: QueryOptions) => {
    this.conf = options;
  }
}

export interface GraphQLConfig extends QueryOptions {
}

let queryConf = withDefaults(null, game.graphQL.defaultOptions());
let getQueryConf = () => null;
function getQueryOptions() {
  return {
    ...defaultGraphQLOptions,
    ...withDefaults(getQueryConf(), withDefaults(null, queryConf)),
  };
}

function setQueryOptions(queryOptions: QueryOptions) {
  queryConf = queryOptions;
}

export interface GraphQLData<T> {
  data: T;
  loading: boolean;
  ok: boolean;
  lastError: string;
}

export interface GraphQLResult<T> extends GraphQLData<T> {
  client: GraphQLClient;
  refetch: (disableLoading?: boolean) => Promise<GraphQLResult<T>>;
}

export interface GraphQLInjectedProps<T> {
  graphql: GraphQLResult<T>;
}

export function useConfig(getQueryConfig: () => Partial<GraphQLConfig>, getSubscriptionConfig: () => Partial<Options<any>>) {
  getQueryConf = getQueryConfig;
  queryConf = withDefaults(getQueryConfig(), queryConf);
}

export type GraphQLQueryResult<QueryDataType> = {
  data: Partial<QueryDataType>,
  ok: boolean,
  statusText: string,
};

export type MockQueryHandler<QueryDataType> = {
  handle: (
    query: GraphQLQuery | undefined,
    options: GraphQLOptions,
  ) => Promise<GraphQLQueryResult<QueryDataType>>;
};

export type MockQueryHandlerFactory<QueryDataType> = () => MockQueryHandler<QueryDataType>;

export type MockSubscriptionHandler<SubscriptionDataType> = {
  start: (
    subscription: Subscription | undefined,
    options: Options<any>,
    sendResult: (result: SubscriptionResult<SubscriptionDataType>) => void,
  ) => void;
  update?: (
    subscription: Subscription | undefined,
    options: Options<any>,
    sendResult: (result: SubscriptionResult<SubscriptionDataType>) => void,
  ) => void;
  stop: (
  ) => void;
};

export type MockSubscriptionHandlerFactory<SubscriptionDataType> = () => MockSubscriptionHandler<SubscriptionDataType>;

export type GraphQLQueryOptions = Partial<GraphQLQuery> &  Partial<GraphQLOptions>;
export type GraphQLSubscriptionOptions<DataType> = Partial<Subscription> & Partial<SubscriptionOptions<DataType>>;

export interface GraphQLProps<QueryDataType, SubscriptionDataType> {
  query?: string | GraphQLQueryOptions;
  subscription?: string | GraphQLSubscriptionOptions<SubscriptionDataType>;
  initialData?: QueryDataType;
  onQueryResult?: (result: GraphQLResult<QueryDataType>) => void;
  subscriptionHandler?: (result: SubscriptionResult<SubscriptionDataType>, data: QueryDataType) => QueryDataType;
  useConfig?: () => { queryConf: QueryOptions, subsConf: SubscriptionOptions<any> };
  mockQuery?: boolean;
  mockQueryHandlerFactory?: MockQueryHandlerFactory<QueryDataType>;
  mockSubscription?: boolean;
  mockSubscriptionHandlerFactory?: MockSubscriptionHandlerFactory<SubscriptionDataType>;
}

export interface GraphQLState<T> extends GraphQLData<T> {

}

export class GraphQL<QueryDataType, SubscriptionDataType>
  extends React.Component<GraphQLProps<QueryDataType, SubscriptionDataType>, GraphQLState<QueryDataType>> {
  private client: GraphQLClient;
  private query: GraphQLQuery | undefined;
  private queryOptions: GraphQLOptions;
  private subscription: Subscription | undefined;
  private subscriptionOptions: Options<any>;
  private pollingTimeout: number | null = null;
  private subscriptionID: string;
  private subscriptionManager: SubscriptionManager;
  private mockQueryHandler: MockQueryHandler<QueryDataType>;
  private mockSubscriptionHandler: MockSubscriptionHandler<SubscriptionDataType>;

  constructor(props: GraphQLProps<QueryDataType, SubscriptionDataType>) {
    super(props);
    this.state = {
      data: props.initialData || null,
      loading: false,
      ok: false,
      lastError: null,
    };

    if (props.query) {
      let q;
      if (
        typeof props.query === 'string' ||
        props.query.hasOwnProperty('loc') ||
        props.query.hasOwnProperty('definitions')
      ) {
        q = { query: props.query };
      } else {
        q = props.query;
      }
      this.query = withDefaults(q, defaultQuery);
      const qp = typeof props.query === 'string' ? {} : props.query;

      if (typeof props.useConfig === 'function') {
        const config = props.useConfig();
        setQueryOptions(config.queryConf);
      }

      this.queryOptions = withDefaults<GraphQLOptions>(qp, getQueryOptions());

      this.client = new GraphQLClient({
        url: this.queryOptions.url,
        requestOptions: this.queryOptions.requestOptions,
        stringifyVariables: this.queryOptions.stringifyVariables,
      });
    }

    if (props.mockQuery && props.mockQueryHandlerFactory) {
      this.mockQueryHandler = props.mockQueryHandlerFactory();
    }

    if (props.subscription) {
      let s;
      if (typeof props.subscription === 'string' || props.subscription.hasOwnProperty('loc')) {
        s = { query: props.subscription };
      } else {
        s = props.subscription;
      }
      this.subscription = withDefaults(s, defaultSubscription);
      this.subscriptionOptions = withDefaults<Options<any>>(s, defaultSubscriptionOpts());
    }
  }

  public render() {
    return (
      <ErrorBoundary renderError={error => <span>GraphQL Component Error: {error}</span>}>
        {
          this.props.children ? (this.props.children as any)({
            ...this.state,
            client: this.client,
            refetch: this.refetch,
          }) : null
        }
      </ErrorBoundary>
    );
  }

  // public shouldComponentUpdate(nextProps: GraphQLProps<QueryDataType, SubscriptionDataType>,
  //     nextState: GraphQLState<QueryDataType>) {
  //   // if (!_.isEqual(this.state, nextState)) return true;
  //   // if (!_.isEqual(this.props, nextProps)) return true;
  //   // return false;
  // }

  public componentDidMount() {
    if (this.queryOptions && this.queryOptions.pollInterval && this.queryOptions.pollInterval > 0) {
      this.pollingRefetch();
    } else if (this.state.data === null) {
      this.refetch();
    }

    if (this.props.mockSubscription && this.props.mockSubscriptionHandlerFactory) {
      this.mockSubscriptionHandler = this.props.mockSubscriptionHandlerFactory();
      this.mockSubscriptionHandler.start(this.subscription, this.subscriptionOptions, this.subscriptionHandler);
    } else if (this.props.subscription) {
      const result = subscribe(this.subscription, this.subscriptionHandler,
        this.subscriptionOptions, this.subscriptionError);
      this.subscriptionID = result.id;
      this.subscriptionManager = result.subscriptions;
    }
  }

  public componentWillReceiveProps(nextProps: GraphQLProps<QueryDataType, SubscriptionDataType>) {
    if (!_.isEqual(this.props.query, nextProps.query)) {
      let q;
      if (typeof nextProps.query === 'string' || nextProps.query.hasOwnProperty('loc')) {
        q = { query: nextProps.query };
      } else {
        q = nextProps.query;
      }
      this.query = withDefaults(q, defaultQuery);
      this.refetch();
    }
  }

  public componentWillUnmount() {
    if (this.pollingTimeout) {
      window.clearTimeout(this.pollingTimeout);
      this.pollingTimeout = null;
    }

    if (this.subscriptionManager) {
      this.subscriptionManager.stop(this.subscriptionID);
    }
    if (this.mockSubscriptionHandler) {
      this.mockSubscriptionHandler.stop();
    }
  }

  private subscriptionHandler = (result: SubscriptionResult<SubscriptionDataType>) => {
    if (!this.props.subscriptionHandler) return;
    const data = this.props.subscriptionHandler(result, this.state.data);
    this.setState({ data });
    this.props.onQueryResult && this.props.onQueryResult({
      ...this.state,
      data: data as QueryDataType,
      client: this.client,
      refetch: this.refetch,
    });
  }

  private subscriptionError = (e: ErrorEvent) => {
    console.error(e);
  }

  private refetch = async (disableLoading?: boolean) => {
    if (!this.query) return;
    const query = this.updateConfig();
    return await this.refetchQuery(query, disableLoading);
  }

  private refetchQuery = async (query?: GraphQLQuery | undefined, disableLoading?: boolean) => {
    if (!disableLoading && this.state.loading === false) {
      this.setState({ loading: true });
    }
    let result: GraphQLQueryResult<QueryDataType>;
    if (this.props.mockQuery && this.mockQueryHandler) {
      result = await this.mockQueryHandler.handle(query || this.query, this.queryOptions);
    } else {
      result = await this.client.query(query || this.query);
    }
    const state = {
      data: result.data as QueryDataType,
      loading: false,
      ok: result.ok,
      lastError: result.statusText,
    };
    this.setState(state);
    if (this.props.onQueryResult) {
      const queryResult = {
        ...state,
        client: this.client,
        refetch: this.refetch,
      };
      this.props.onQueryResult(queryResult);

      return queryResult;
    }
  }

  private pollingRefetch = async () => {
    await this.refetch();
    this.pollingTimeout = window.setTimeout(this.pollingRefetch, this.queryOptions.pollInterval);
  }

  private updateConfig = (): GraphQLQuery | undefined => {
    if (typeof this.props.useConfig === 'function') {
      const config = this.props.useConfig();
      const queryConfChanged = !_.isEqual(config.queryConf, queryConf);
      if (queryConfChanged) {
        if (queryConfChanged) {
          // Only set query options if there is a difference
          setQueryOptions(config.queryConf);
          this.queryOptions = getQueryOptions();
        }

        // Update graphql client
        this.client = new GraphQLClient({
          url: this.queryOptions.url,
          requestOptions: this.queryOptions.requestOptions,
          stringifyVariables: this.queryOptions.stringifyVariables,
        });

        const q = typeof this.props.query === 'string' ? { query: this.props.query } : this.props.query;
        this.query = withDefaults(q, this.query);
      }
    } else {
      const defaultOpts = game.graphQL.defaultOptions();
      if (typeof this.props.query !== 'string') {
        // Update queryOptions but use props first
        this.queryOptions = {
          url: this.props.query.url || defaultOpts.url,
          pollInterval: this.props.query.pollInterval || 0,
          stringifyVariables: this.props.query.stringifyVariables || defaultOpts.stringifyVariables,
          requestOptions: this.props.query.requestOptions || defaultOpts.requestOptions,
        };
      } else {
        // User never passed in any special query options, just update the options with default ones.
        this.queryOptions = {
          url: defaultOpts.url,
          pollInterval: 0,
          stringifyVariables: defaultOpts.stringifyVariables,
          requestOptions: defaultOpts.requestOptions,
        };
      }

      // Update graphql client
      this.client.setConf({
        url: this.queryOptions.url,
        requestOptions: this.queryOptions.requestOptions,
        stringifyVariables: this.queryOptions.stringifyVariables,
      });
    }

    return this.query;
  }
}

export function withGraphQL<
  PropsType extends GraphQLInjectedProps<QueryDataType | null>,
  QueryDataType = any
>(
  query?: string | Partial<GraphQLQuery> | ((props: PropsType) => Partial<GraphQLQuery>),
  options?: Partial<GraphQLOptions> | ((props: PropsType) => Partial<GraphQLOptions>),
) {

  return (WrappedComponent: React.ComponentClass<PropsType> | React.StatelessComponent<PropsType>) => {
    return class extends React.Component<Omit<PropsType, keyof GraphQLInjectedProps<QueryDataType>>,
      GraphQLData<QueryDataType | null>> {

      public queryProp: Partial<GraphQLQuery> & Partial<GraphQLOptions>;
      constructor(props: any) {
        super(props);
        const q = typeof query === 'function' ? query(props) : query;
        const opts = typeof options === 'function' ? options(props) : options;

        if (typeof q === 'string' || q.hasOwnProperty('loc')) {
          this.queryProp = {
            query: q as any,
            ...opts,
          };
        } else {
          this.queryProp = {
            ...q,
            ...opts,
          };
        }
      }
      public render() {
        // to stop intellisense bitching for now
        const WC = WrappedComponent as any;
        return (
          <GraphQL query={this.queryProp}>
            {
              (graphql: GraphQLResult<QueryDataType>) => <WC graphql={graphql} {...this.props} />
            }
          </GraphQL>
        );
      }
    };
  };
}
