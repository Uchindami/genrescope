// ============================================
// Types
// ============================================

interface DescriptionResponse {
  description: string;
}

// ============================================
// GPT Service
// ============================================
// Note: Actual fetching is handled by SWR hooks (useGPTDescription)
// This file kept for type exports only

const gptServices = {
  // No methods needed - SWR hooks handle everything
};

export default gptServices;
export type { DescriptionResponse };
