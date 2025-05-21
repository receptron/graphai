# @graphai/http_client_agent_filter for GraphAI

Http Client Agent filter for GraphAI.

## Install

```
yarn add @graphai/http_client_agent_filter
```

### USAGE

In graph flow, bypass the agent execution and run it on the server via http.

Refer to the web sample.

https://github.com/isamu/graphai-stream-web/blob/main/src/views/Home.vue


```mermaid

flowchart TD
    subgraph "Http Agent Filter"
        Node1((Node 1)) --> Node2((Node 2))
        Node1 --> Node3((Node 3))
        Node2 --> Node4((Node 4))
        Node3 --> Node4
        
        %% Node execution flow
        Node1 -..-> |execution| Filter1[Agent Filter]
        Node2 -..-> |execution| Filter2[Agent Filter]
        Node3 -..-> |execution| Filter3[Agent Filter]
        Node4 -..-> |execution| Filter4[Agent Filter]
        
        Filter1 -..-> |browser execution| BrowserExec1[Browser Execution]
        Filter2 -..-> |browser execution| BrowserExec2[Browser Execution]
        Filter3 -..-> |server execution| ServerExec1[Server HTTP Request]
        Filter4 -..-> |server execution| ServerExec2[Server HTTP Request]
        
        ServerExec1 -..-> Server1[Server Process]
        ServerExec2 -..-> Server2[Server Process]
        
        %% Execution results
        BrowserExec1 -..-> |result| Node1
        BrowserExec2 -..-> |result| Node2
        Server1 -..-> |result| Node3
        Server2 -..-> |result| Node4
    end
    
    classDef graphNode fill:#98fb98,stroke:#333,stroke-width:2px
    classDef filterNode fill:#a7c7e7,stroke:#333,stroke-width:1px
    classDef browserNode fill:#ffb6c1,stroke:#333,stroke-width:1px
    classDef serverNode fill:#ffcc99,stroke:#333,stroke-width:1px
    
    class Node1,Node2,Node3,Node4 graphNode
    class Filter1,Filter2,Filter3,Filter4 filterNode
    class BrowserExec1,BrowserExec2 browserNode
    class ServerExec1,ServerExec2,Server1,Server2 serverNode

```

