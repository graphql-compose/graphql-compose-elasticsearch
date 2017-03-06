/* eslint-disable */

/**
 * Perform a [search](https://www.elastic.co/guide/en/elasticsearch/reference/5.x/search-search.html) request
 *
 * @param {Object} params - An object with parameters used to carry out this action
 * @param {<<api-param-type-string,`String`>>} params.analyzer - The analyzer to use for the query string
 * @param {<<api-param-type-boolean,`Boolean`>>} params.analyzeWildcard - Specify whether wildcard and prefix queries should be analyzed (default: false)
 * @param {<<api-param-type-string,`String`>>} [params.defaultOperator=OR] - The default operator for query string query (AND or OR)
 * @param {<<api-param-type-string,`String`>>} params.df - The field to use as default where no field prefix is given in the query string
 * @param {<<api-param-type-boolean,`Boolean`>>} params.explain - Specify whether to return detailed information about score computation as part of a hit
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.storedFields - A comma-separated list of stored fields to return as part of a hit
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.docvalueFields - A comma-separated list of fields to return as the docvalue representation of a field for each hit
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.fielddataFields - A comma-separated list of fields to return as the docvalue representation of a field for each hit
 * @param {<<api-param-type-number,`Number`>>} params.from - Starting offset (default: 0)
 * @param {<<api-param-type-boolean,`Boolean`>>} params.ignoreUnavailable - Whether specified concrete indices should be ignored when unavailable (missing or closed)
 * @param {<<api-param-type-boolean,`Boolean`>>} params.allowNoIndices - Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
 * @param {<<api-param-type-string,`String`>>} [params.expandWildcards=open] - Whether to expand wildcard expression to concrete indices that are open, closed or both.
 * @param {<<api-param-type-boolean,`Boolean`>>} params.lenient - Specify whether format-based query failures (such as providing text to a numeric field) should be ignored
 * @param {<<api-param-type-string,`String`>>} params.preference - Specify the node or shard the operation should be performed on (default: random)
 * @param {<<api-param-type-string,`String`>>} params.q - Query in the Lucene query string syntax
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.routing - A comma-separated list of specific routing values
 * @param {<<api-param-type-duration-string,`DurationString`>>} params.scroll - Specify how long a consistent view of the index should be maintained for scrolled search
 * @param {<<api-param-type-string,`String`>>} params.searchType - Search operation type
 * @param {<<api-param-type-number,`Number`>>} params.size - Number of hits to return (default: 10)
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.sort - A comma-separated list of <field>:<direction> pairs
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params._source - True or false to return the _source field or not, or a list of fields to return
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params._sourceExclude - A list of fields to exclude from the returned _source field
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params._sourceInclude - A list of fields to extract and return from the _source field
 * @param {<<api-param-type-number,`Number`>>} params.terminateAfter - The maximum number of documents to collect for each shard, upon reaching which the query execution will terminate early.
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.stats - Specific 'tag' of the request for logging and statistical purposes
 * @param {<<api-param-type-string,`String`>>} params.suggestField - Specify which field to use for suggestions
 * @param {<<api-param-type-string,`String`>>} [params.suggestMode=missing] - Specify suggest mode
 * @param {<<api-param-type-number,`Number`>>} params.suggestSize - How many suggestions to return in response
 * @param {<<api-param-type-string,`String`>>} params.suggestText - The source text for which the suggestions should be returned
 * @param {<<api-param-type-duration-string,`DurationString`>>} params.timeout - Explicit operation timeout
 * @param {<<api-param-type-boolean,`Boolean`>>} params.trackScores - Whether to calculate and return scores even if they are not used for sorting
 * @param {<<api-param-type-boolean,`Boolean`>>} params.version - Specify whether to return document version as part of a hit
 * @param {<<api-param-type-boolean,`Boolean`>>} params.requestCache - Specify if request cache should be used for this request or not, defaults to index level setting
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.index - A comma-separated list of index names to search; use `_all` or empty string to perform the operation on all indices
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.type - A comma-separated list of document types to search; leave empty to perform the operation on all types
 */
api.search = ca({
  params: {
    analyzer: {
      type: 'string'
    },
    analyzeWildcard: {
      type: 'boolean',
      name: 'analyze_wildcard'
    },
    defaultOperator: {
      type: 'enum',
      'default': 'OR',
      options: [
        'AND',
        'OR'
      ],
      name: 'default_operator'
    },
    df: {
      type: 'string'
    },
    explain: {
      type: 'boolean'
    },
    storedFields: {
      type: 'list',
      name: 'stored_fields'
    },
    docvalueFields: {
      type: 'list',
      name: 'docvalue_fields'
    },
    fielddataFields: {
      type: 'list',
      name: 'fielddata_fields'
    },
    from: {
      type: 'number'
    },
    ignoreUnavailable: {
      type: 'boolean',
      name: 'ignore_unavailable'
    },
    allowNoIndices: {
      type: 'boolean',
      name: 'allow_no_indices'
    },
    expandWildcards: {
      type: 'enum',
      'default': 'open',
      options: [
        'open',
        'closed',
        'none',
        'all'
      ],
      name: 'expand_wildcards'
    },
    lenient: {
      type: 'boolean'
    },
    preference: {
      type: 'string'
    },
    q: {
      type: 'string'
    },
    routing: {
      type: 'list'
    },
    scroll: {
      type: 'time'
    },
    searchType: {
      type: 'enum',
      options: [
        'query_then_fetch',
        'dfs_query_then_fetch'
      ],
      name: 'search_type'
    },
    size: {
      type: 'number'
    },
    sort: {
      type: 'list'
    },
    _source: {
      type: 'list'
    },
    _sourceExclude: {
      type: 'list',
      name: '_source_exclude'
    },
    _sourceInclude: {
      type: 'list',
      name: '_source_include'
    },
    terminateAfter: {
      type: 'number',
      name: 'terminate_after'
    },
    stats: {
      type: 'list'
    },
    suggestField: {
      type: 'string',
      name: 'suggest_field'
    },
    suggestMode: {
      type: 'enum',
      'default': 'missing',
      options: [
        'missing',
        'popular',
        'always'
      ],
      name: 'suggest_mode'
    },
    suggestSize: {
      type: 'number',
      name: 'suggest_size'
    },
    suggestText: {
      type: 'string',
      name: 'suggest_text'
    },
    timeout: {
      type: 'time'
    },
    trackScores: {
      type: 'boolean',
      name: 'track_scores'
    },
    version: {
      type: 'boolean'
    },
    requestCache: {
      type: 'boolean',
      name: 'request_cache'
    }
  },
  urls: [
    {
      fmt: '/<%=index%>/<%=type%>/_search',
      req: {
        index: {
          type: 'list'
        },
        type: {
          type: 'list'
        }
      }
    },
    {
      fmt: '/<%=index%>/_search',
      req: {
        index: {
          type: 'list'
        }
      }
    },
    {
      fmt: '/_search'
    }
  ],
  method: 'POST'
});

/**
 * Perform a [updateByQuery](https://www.elastic.co/guide/en/elasticsearch/reference/5.x/docs-update-by-query.html) request
 *
 * @param {Object} params - An object with parameters used to carry out this action
 * @param {<<api-param-type-string,`String`>>} params.analyzer - The analyzer to use for the query string
 * @param {<<api-param-type-boolean,`Boolean`>>} params.analyzeWildcard - Specify whether wildcard and prefix queries should be analyzed (default: false)
 * @param {<<api-param-type-string,`String`>>} [params.defaultOperator=OR] - The default operator for query string query (AND or OR)
 * @param {<<api-param-type-string,`String`>>} params.df - The field to use as default where no field prefix is given in the query string
 * @param {<<api-param-type-number,`Number`>>} params.from - Starting offset (default: 0)
 * @param {<<api-param-type-boolean,`Boolean`>>} params.ignoreUnavailable - Whether specified concrete indices should be ignored when unavailable (missing or closed)
 * @param {<<api-param-type-boolean,`Boolean`>>} params.allowNoIndices - Whether to ignore if a wildcard indices expression resolves into no concrete indices. (This includes `_all` string or when no indices have been specified)
 * @param {<<api-param-type-string,`String`>>} [params.conflicts=abort] - What to do when the update by query hits version conflicts?
 * @param {<<api-param-type-string,`String`>>} [params.expandWildcards=open] - Whether to expand wildcard expression to concrete indices that are open, closed or both.
 * @param {<<api-param-type-boolean,`Boolean`>>} params.lenient - Specify whether format-based query failures (such as providing text to a numeric field) should be ignored
 * @param {<<api-param-type-string,`String`>>} params.pipeline - Ingest pipeline to set on index requests made by this action. (default: none)
 * @param {<<api-param-type-string,`String`>>} params.preference - Specify the node or shard the operation should be performed on (default: random)
 * @param {<<api-param-type-string,`String`>>} params.q - Query in the Lucene query string syntax
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.routing - A comma-separated list of specific routing values
 * @param {<<api-param-type-duration-string,`DurationString`>>} params.scroll - Specify how long a consistent view of the index should be maintained for scrolled search
 * @param {<<api-param-type-string,`String`>>} params.searchType - Search operation type
 * @param {<<api-param-type-duration-string,`DurationString`>>} params.searchTimeout - Explicit timeout for each search request. Defaults to no timeout.
 * @param {<<api-param-type-number,`Number`>>} params.size - Number of hits to return (default: 10)
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.sort - A comma-separated list of <field>:<direction> pairs
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params._source - True or false to return the _source field or not, or a list of fields to return
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params._sourceExclude - A list of fields to exclude from the returned _source field
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params._sourceInclude - A list of fields to extract and return from the _source field
 * @param {<<api-param-type-number,`Number`>>} params.terminateAfter - The maximum number of documents to collect for each shard, upon reaching which the query execution will terminate early.
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.stats - Specific 'tag' of the request for logging and statistical purposes
 * @param {<<api-param-type-boolean,`Boolean`>>} params.version - Specify whether to return document version as part of a hit
 * @param {<<api-param-type-boolean,`Boolean`>>} params.versionType - Should the document increment the version number (internal) on hit or not (reindex)
 * @param {<<api-param-type-boolean,`Boolean`>>} params.requestCache - Specify if request cache should be used for this request or not, defaults to index level setting
 * @param {<<api-param-type-boolean,`Boolean`>>} params.refresh - Should the effected indexes be refreshed?
 * @param {<<api-param-type-duration-string,`DurationString`>>} [params.timeout=1m] - Time each individual bulk request should wait for shards that are unavailable.
 * @param {<<api-param-type-string,`String`>>} params.waitForActiveShards - Sets the number of shard copies that must be active before proceeding with the update by query operation. Defaults to 1, meaning the primary shard only. Set to `all` for all shard copies, otherwise set to any non-negative value less than or equal to the total number of copies for the shard (number of replicas + 1)
 * @param {<<api-param-type-number,`Number`>>} params.scrollSize - Size on the scroll request powering the update_by_query
 * @param {<<api-param-type-boolean,`Boolean`>>} params.waitForCompletion - Should the request should block until the update by query operation is complete.
 * @param {<<api-param-type-number,`Number`>>} params.requestsPerSecond - The throttle to set on this request in sub-requests per second. -1 means no throttle.
 * @param {<<api-param-type-number,`Number`>>} [params.slices=1] - The number of slices this task should be divided into. Defaults to 1 meaning the task isn't sliced into subtasks.
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.index - A comma-separated list of index names to search; use `_all` or empty string to perform the operation on all indices
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.type - A comma-separated list of document types to search; leave empty to perform the operation on all types
 */
api.updateByQuery = ca({
  params: {
    analyzer: {
      type: 'string'
    },
    analyzeWildcard: {
      type: 'boolean',
      name: 'analyze_wildcard'
    },
    defaultOperator: {
      type: 'enum',
      'default': 'OR',
      options: [
        'AND',
        'OR'
      ],
      name: 'default_operator'
    },
    df: {
      type: 'string'
    },
    from: {
      type: 'number'
    },
    ignoreUnavailable: {
      type: 'boolean',
      name: 'ignore_unavailable'
    },
    allowNoIndices: {
      type: 'boolean',
      name: 'allow_no_indices'
    },
    conflicts: {
      type: 'enum',
      'default': 'abort',
      options: [
        'abort',
        'proceed'
      ]
    },
    expandWildcards: {
      type: 'enum',
      'default': 'open',
      options: [
        'open',
        'closed',
        'none',
        'all'
      ],
      name: 'expand_wildcards'
    },
    lenient: {
      type: 'boolean'
    },
    pipeline: {
      type: 'string'
    },
    preference: {
      type: 'string'
    },
    q: {
      type: 'string'
    },
    routing: {
      type: 'list'
    },
    scroll: {
      type: 'time'
    },
    searchType: {
      type: 'enum',
      options: [
        'query_then_fetch',
        'dfs_query_then_fetch'
      ],
      name: 'search_type'
    },
    searchTimeout: {
      type: 'time',
      name: 'search_timeout'
    },
    size: {
      type: 'number'
    },
    sort: {
      type: 'list'
    },
    _source: {
      type: 'list'
    },
    _sourceExclude: {
      type: 'list',
      name: '_source_exclude'
    },
    _sourceInclude: {
      type: 'list',
      name: '_source_include'
    },
    terminateAfter: {
      type: 'number',
      name: 'terminate_after'
    },
    stats: {
      type: 'list'
    },
    version: {
      type: 'boolean'
    },
    versionType: {
      type: 'boolean',
      name: 'version_type'
    },
    requestCache: {
      type: 'boolean',
      name: 'request_cache'
    },
    refresh: {
      type: 'boolean'
    },
    timeout: {
      type: 'time',
      'default': '1m'
    },
    waitForActiveShards: {
      type: 'string',
      name: 'wait_for_active_shards'
    },
    scrollSize: {
      type: 'number',
      name: 'scroll_size'
    },
    waitForCompletion: {
      type: 'boolean',
      'default': false,
      name: 'wait_for_completion'
    },
    requestsPerSecond: {
      type: 'number',
      'default': 0,
      name: 'requests_per_second'
    },
    slices: {
      type: 'number',
      'default': 1
    }
  },
  urls: [
    {
      fmt: '/<%=index%>/<%=type%>/_update_by_query',
      req: {
        index: {
          type: 'list'
        },
        type: {
          type: 'list'
        }
      }
    },
    {
      fmt: '/<%=index%>/_update_by_query',
      req: {
        index: {
          type: 'list'
        }
      }
    }
  ],
  method: 'POST'
});

/**
 * Perform a [cat.allocation](https://www.elastic.co/guide/en/elasticsearch/reference/5.x/cat-allocation.html) request
 *
 * @param {Object} params - An object with parameters used to carry out this action
 * @param {<<api-param-type-string,`String`>>} params.format - a short version of the Accept header, e.g. json, yaml
 * @param {<<api-param-type-string,`String`>>} params.bytes - The unit in which to display byte values
 * @param {<<api-param-type-boolean,`Boolean`>>} params.local - Return local information, do not retrieve the state from master node (default: false)
 * @param {<<api-param-type-duration-string,`DurationString`>>} params.masterTimeout - Explicit operation timeout for connection to master node
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.h - Comma-separated list of column names to display
 * @param {<<api-param-type-boolean,`Boolean`>>} params.help - Return help information
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.s - Comma-separated list of column names or column aliases to sort by
 * @param {<<api-param-type-boolean,`Boolean`>>} params.v - Verbose mode. Display column headers
 * @param {<<api-param-type-string,`String`>>, <<api-param-type-string-array,`String[]`>>, <<api-param-type-boolean,`Boolean`>>} params.nodeId - A comma-separated list of node IDs or names to limit the returned information
 */
api.cat.prototype.allocation = ca({
  params: {
    format: {
      type: 'string'
    },
    bytes: {
      type: 'enum',
      options: [
        'b',
        'k',
        'kb',
        'm',
        'mb',
        'g',
        'gb',
        't',
        'tb',
        'p',
        'pb'
      ]
    },
    local: {
      type: 'boolean'
    },
    masterTimeout: {
      type: 'time',
      name: 'master_timeout'
    },
    h: {
      type: 'list'
    },
    help: {
      type: 'boolean',
      'default': false
    },
    s: {
      type: 'list'
    },
    v: {
      type: 'boolean',
      'default': false
    }
  },
  urls: [
    {
      fmt: '/_cat/allocation/<%=nodeId%>',
      req: {
        nodeId: {
          type: 'list'
        }
      }
    },
    {
      fmt: '/_cat/allocation'
    }
  ]
});
