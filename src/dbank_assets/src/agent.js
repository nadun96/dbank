import { HttpAgent } from "@dfinity/agent";

/**
 * Create an HttpAgent configured for the current environment
 */
export const createAgent = () => {
    const isLocal = process.env.NODE_ENV !== "production";
    const host = isLocal ? "http://localhost:8000" : undefined;

    const agent = new HttpAgent({
        host,
        verifyQuerySignatures: !isLocal, // Skip signature verification for local replica
    });

    // Fetch root key for certificate validation during development
    if (isLocal) {
        agent.fetchRootKey().catch(err => {
            console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
            console.error(err);
        });
    }

    return agent;
};
