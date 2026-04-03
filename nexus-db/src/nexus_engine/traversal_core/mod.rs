pub mod config;
pub mod ops;
pub mod traversal_iter;
pub mod traversal_value;

use crate::nexus_engine::storage_core::{NexusGraphStorage, version_info::VersionInfo};
use crate::nexus_engine::traversal_core::config::Config;
use crate::nexus_engine::types::GraphError;
use crate::nexus_gateway::mcp::mcp::{McpBackend, McpConnections};
use std::sync::{Arc, Mutex};

pub const LMDB_STRING_HEADER_LENGTH: usize = 8;

#[derive(Debug)]
pub enum QueryInput {
    StringValue { value: String },
    IntegerValue { value: i32 },
    FloatValue { value: f64 },
    BooleanValue { value: bool },
}

pub struct NexusGraphEngine {
    pub storage: Arc<NexusGraphStorage>,
    pub mcp_backend: Option<Arc<McpBackend>>,
    pub mcp_connections: Option<Arc<Mutex<McpConnections>>>,
}

#[derive(Default, Clone)]
pub struct NexusGraphEngineOpts {
    pub path: String,
    pub config: Config,
    pub version_info: VersionInfo,
}

impl NexusGraphEngine {
    pub fn new(opts: NexusGraphEngineOpts) -> Result<NexusGraphEngine, GraphError> {
        let should_use_mcp = opts.config.mcp;
        let storage =
            match NexusGraphStorage::new(opts.path.as_str(), opts.config, opts.version_info) {
                Ok(db) => Arc::new(db),
                Err(err) => return Err(err),
            };

        let (mcp_backend, mcp_connections) = if should_use_mcp.unwrap_or(false) {
            let mcp_backend = Arc::new(McpBackend::new(storage.clone()));
            let mcp_connections = Arc::new(Mutex::new(McpConnections::new()));
            (Some(mcp_backend), Some(mcp_connections))
        } else {
            (None, None)
        };

        Ok(Self {
            storage,
            mcp_backend,
            mcp_connections,
        })
    }
}
