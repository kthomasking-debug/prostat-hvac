/**
 * RAG Query Utility
 * Provides semantic search and retrieval of HVAC knowledge for Ask Joule
 */

import {
  searchKnowledgeBase,
  formatKnowledgeForLLM,
} from "./hvacKnowledgeBase.js";

/**
 * Query the HVAC knowledge base and return formatted results
 * @param {string} query - User's question or search query
 * @returns {Promise<{success: boolean, content?: string, message?: string}>}
 */
export async function queryHVACKnowledge(query) {
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return {
      success: false,
      message: "Query is required",
    };
  }

  try {
    // Search the knowledge base
    const results = searchKnowledgeBase(query);

    if (results.length === 0) {
      return {
        success: false,
        message: "No relevant HVAC knowledge found for your query.",
      };
    }

    // Format for LLM context
    const formatted = formatKnowledgeForLLM(results);

    return {
      success: true,
      content: formatted,
      results: results, // Include raw results for debugging
    };
  } catch (error) {
    console.error("[RAG] Error querying knowledge base:", error);
    return {
      success: false,
      message: `Error searching knowledge base: ${error.message}`,
    };
  }
}

/**
 * Enhanced search that also checks for specific engineering standards
 * @param {string} query - User's question
 * @returns {Promise<{success: boolean, content?: string, standards?: Array}>}
 */
export async function queryWithStandards(query) {
  const lowerQuery = query.toLowerCase();

  // Detect which standards are relevant
  const relevantStandards = [];

  if (
    lowerQuery.includes("manual j") ||
    lowerQuery.includes("load calculation") ||
    lowerQuery.includes("heat loss") ||
    lowerQuery.includes("sizing")
  ) {
    relevantStandards.push("ACCA Manual J");
  }

  if (
    lowerQuery.includes("manual s") ||
    lowerQuery.includes("equipment selection") ||
    lowerQuery.includes("oversized") ||
    lowerQuery.includes("undersized")
  ) {
    relevantStandards.push("ACCA Manual S");
  }

  if (
    lowerQuery.includes("manual d") ||
    lowerQuery.includes("duct") ||
    lowerQuery.includes("airflow") ||
    lowerQuery.includes("cfm")
  ) {
    relevantStandards.push("ACCA Manual D");
  }

  if (
    lowerQuery.includes("ashrae 55") ||
    lowerQuery.includes("thermal comfort") ||
    lowerQuery.includes("comfort zone") ||
    lowerQuery.includes("setpoint")
  ) {
    relevantStandards.push("ASHRAE Standard 55");
  }

  if (
    lowerQuery.includes("ashrae 62") ||
    lowerQuery.includes("ventilation") ||
    lowerQuery.includes("fresh air") ||
    lowerQuery.includes("indoor air quality")
  ) {
    relevantStandards.push("ASHRAE Standard 62.2");
  }

  // Query the knowledge base
  const knowledgeResult = await queryHVACKnowledge(query);

  return {
    ...knowledgeResult,
    relevantStandards: relevantStandards,
  };
}
