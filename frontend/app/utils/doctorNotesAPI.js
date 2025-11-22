/**
 * Doctor Notes API Service
 * Handles communication with the backend API for clinical note generation
 * The backend will call the MCP server which uses Ollama for AI processing
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const doctorNotesAPI = {
  /**
   * Generate a new structured clinical note
   * Sends doctor input to backend which calls MCP/Ollama for processing
   */
  async generateClinicalNote(payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctor-notes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for auth
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate clinical note");
      }

      return await response.json();
    } catch (error) {
      console.error("Error generating clinical note:", error);
      throw error;
    }
  },

  /**
   * Get all notes for a patient
   */
  async getPatientNotes(patientId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctor-notes/${patientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patient notes");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching patient notes:", error);
      throw error;
    }
  },

  /**
   * Get approved notes only
   */
  async getApprovedNotes(patientId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctor-notes/approved/${patientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch approved notes");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching approved notes:", error);
      throw error;
    }
  },

  /**
   * Get a specific note by ID
   */
  async getNoteById(noteId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctor-notes/note/${noteId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch note");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching note:", error);
      throw error;
    }
  },

  /**
   * Approve a note
   */
  async approveNote(noteId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctor-notes/approve/${noteId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve note");
      }

      return await response.json();
    } catch (error) {
      console.error("Error approving note:", error);
      throw error;
    }
  },

  /**
   * Reject a note
   */
  async rejectNote(noteId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctor-notes/reject/${noteId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject note");
      }

      return await response.json();
    } catch (error) {
      console.error("Error rejecting note:", error);
      throw error;
    }
  },

  /**
   * Update note content
   */
  async updateNote(noteId, updates) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctor-notes/update/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  },

  /**
   * Delete/Archive a note
   */
  async deleteNote(noteId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctor-notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  },
};

export default doctorNotesAPI;
