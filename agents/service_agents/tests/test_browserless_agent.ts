import { graphDataTestRunner } from "@receptron/test_utils";
import browserlessAgentInfo from "../src/browserless_agent";
import { copyAgent } from "@graphai/vanilla";

import { graphDataContent, graphDataScreenshot, graphDataNoToken, graphDataErrorResponse } from "./graphData_browserless";

import test from "node:test";
import assert from "node:assert";
import { MockAgent, setGlobalDispatcher, getGlobalDispatcher } from "undici";

// Mock response data
const mockContentResponse = {
  title: "Test Page",
  content: "This is test content",
};

const mockContentHtml = "<html><body>This is test content</body></html>";

// Save the original global dispatcher
const originalDispatcher = getGlobalDispatcher();

// Create a MockAgent for testing
const mockAgent = new MockAgent();
// Disable network requests by default
mockAgent.disableNetConnect();

const setupEnvironment = () => {
  process.env.BROWSERLESS_API_TOKEN = "test_token";

  // Set the global dispatcher
  setGlobalDispatcher(mockAgent);

  // Set up the mock pool
  const mockPool = mockAgent.get("https://chrome.browserless.io");

  // Mock the content endpoint
  mockPool.intercept({
    path: "/content?token=test_token",
    method: "POST",
  }).reply(200, mockContentResponse, {
    headers: { "content-type": "application/json" }
  });

  // Mock the endpoint for text responses
  mockPool.intercept({
    path: "/content?token=test_token",
    method: "POST",
    body: (body) => {
      try {
        const parsedBody = JSON.parse(body.toString());
        return parsedBody.url === "https://example.com/text";
      } catch (__e) {
        return false;
      }
    }
  }).reply(200, mockContentHtml, {
    headers: { "content-type": "text/html" }
  });

  // Mock the screenshot endpoint
  mockPool.intercept({
    path: "/screenshot?token=test_token",
    method: "POST",
  }).reply(200, Buffer.from([0, 1, 2, 3, 4]), {
    headers: { "content-type": "image/png" }
  });

  // Mock error responses
  mockPool.intercept({
    path: "/content?token=test_token",
    method: "POST",
    body: (body) => {
      try {
        const parsedBody = JSON.parse(body.toString());
        return parsedBody.url && parsedBody.url.includes("error");
      } catch (__e) {
        return false;
      }
    }
  }).reply(429, "Too many requests");
};

const cleanupEnvironment = () => {
  // Reset environment variables
  delete process.env.BROWSERLESS_API_TOKEN;

  // Restore the original dispatcher
  setGlobalDispatcher(originalDispatcher);
};

test("test browserless content", async () => {
  setupEnvironment();

  try {
    const result = await graphDataTestRunner(__dirname, __filename, graphDataContent, { browserlessAgent: browserlessAgentInfo, copyAgent }, () => {}, false);

    // Basic success check
    console.log("Screenshot test result:", JSON.stringify(result, null, 2));
    assert.ok(result.success, "Expected success result");
  } finally {
    cleanupEnvironment();
  }
});

test("test browserless screenshot", async () => {
  setupEnvironment();

  try {
    const result = await graphDataTestRunner(
      __dirname,
      __filename,
      graphDataScreenshot,
      { browserlessAgent: browserlessAgentInfo, copyAgent },
      () => {},
      false,
    );

    // Basic success check
    assert.ok(result.success, "Expected success result");
  } finally {
    cleanupEnvironment();
  }
});

test("test browserless without token", async () => {
  // Initialize environment variables
  delete process.env.BROWSERLESS_API_TOKEN;

  try {
    // Test without a token
    const result = await graphDataTestRunner(__dirname, __filename, graphDataNoToken, { browserlessAgent: browserlessAgentInfo, copyAgent }, () => {}, false);

    // Verify error result
    assert.ok(result.error, "Expected error result");
    // Verify error message content
    if (result.error && typeof result.error === 'object' && 'message' in result.error) {
      assert.ok(
        (result.error.message as string).includes("API token is required"),
        "Error message should mention missing API token"
      );
    }
  } catch (error) {
    // If an error occurs (exception is thrown), check if it's the expected error
    if (error instanceof Error) {
      assert.ok(
        error.message.includes("API token is required"),
        "Expected error message about missing API token"
      );
    } else {
      // Fail the test for unexpected errors
      assert.fail(`Unexpected error: ${error}`);
    }
  } finally {
    // Restore the original dispatcher
    setGlobalDispatcher(originalDispatcher);
  }
});

test("test browserless error response", async () => {
  setupEnvironment();

  try {
    const result = await graphDataTestRunner(
      __dirname,
      __filename,
      graphDataErrorResponse,
      { browserlessAgent: browserlessAgentInfo, copyAgent },
      () => {},
      false,
    );

    // Error check
    assert.ok(result.error, "Expected error result");
  } finally {
    cleanupEnvironment();
  }
});
