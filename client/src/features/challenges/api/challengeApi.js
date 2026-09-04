import axiosInstance from "../../../api/axiosInstance";

/**
 * Fetch published challenges with optional filters & pagination.
 *
 * @param {Object} params
 * @param {string} [params.difficulty] - 'easy' | 'medium' | 'hard'
 * @param {string} [params.category] - 'dsa' | 'bug-fix' | 'api-design' | 'schema-modeling' | 'system-design' | 'debugging'
 * @param {string} [params.tag] - e.g. 'arrays'
 * @param {string} [params.search] - search string
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @returns {Promise<{ challenges: Array, pagination: Object }>}
 */
export async function getChallenges(params = {}) {
  // Clean up empty/undefined params so we don't send "?difficulty=&category="
  const cleanParams = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "" && val !== "all") {
      cleanParams[key] = val;
    }
  });

  const { data } = await axiosInstance.get("/challenges", { params: cleanParams });
  return data;
}

/**
 * Get a single challenge by ID.
 *
 * @param {string} id
 * @returns {Promise<{ challenge: Object }>}
 */
export async function getChallengeById(id) {
  const { data } = await axiosInstance.get(`/challenges/${id}`);
  return data;
}

/**
 * Create a new challenge (mentor/admin only).
 *
 * @param {Object} challengeData
 * @returns {Promise<{ message: string, challenge: Object }>}
 */
export async function createChallenge(challengeData) {
  const { data } = await axiosInstance.post("/challenges", challengeData);
  return data;
}

/**
 * Update an existing challenge (creator or admin only).
 *
 * @param {string} id
 * @param {Object} challengeData
 * @returns {Promise<{ message: string, challenge: Object }>}
 */
export async function updateChallenge(id, challengeData) {
  const { data } = await axiosInstance.put(`/challenges/${id}`, challengeData);
  return data;
}

/**
 * Delete a challenge (creator or admin only).
 *
 * @param {string} id
 * @returns {Promise<{ message: string }>}
 */
export async function deleteChallenge(id) {
  const { data } = await axiosInstance.delete(`/challenges/${id}`);
  return data;
}
