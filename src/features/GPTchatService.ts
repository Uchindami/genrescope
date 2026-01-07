// ============================================
// Types
// ============================================

interface DescriptionResponse {
  description: string;
}

// ============================================
// API Helper
// ============================================

async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// OpenAI Service
// ============================================

/**
 * Generate personality description based on songs
 */
async function getDescription(songs: string): Promise<string> {
  const encoded = encodeURIComponent(songs);
  const data = await apiFetch<DescriptionResponse>(
    `/api/generate-description?songs=${encoded}`
  );
  return data.description;
}

const gptServices = {
  getDescription,
};

export default gptServices;
