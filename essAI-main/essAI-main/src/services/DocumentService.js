// src/services/DocumentService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/document/v1';

export class DocumentError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'DocumentError';
  }
}

export const DocumentService = {
  async getDocumentsByFirebaseUid(firebaseUid) {
    console.log(`GET ${API_BASE_URL}/firebase/${firebaseUid}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/firebase/${firebaseUid}`);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      console.log('Get documents response:', response.status, data);
      
      if (!response.ok) {
        throw new DocumentError(`Failed to fetch documents: ${data}`, response.status);
      }
      
      return data;
    } catch (error) {
      console.error('Get documents error:', error);
      throw error instanceof DocumentError ? error : new DocumentError(error.message);
    }
  },

  async getDocumentById(documentId) {
    console.log(`GET ${API_BASE_URL}/${documentId}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/${documentId}`);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      console.log('Get document response:', response.status, data);
      
      if (!response.ok) {
        throw new DocumentError(`Failed to fetch document: ${data}`, response.status);
      }
      
      return data;
    } catch (error) {
      console.error('Get document error:', error);
      throw error instanceof DocumentError ? error : new DocumentError(error.message);
    }
  },

  async createDocument(documentData) {
    console.log(`POST ${API_BASE_URL}/`);
    console.log('Request payload:', documentData);

    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(documentData)
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      console.log('Response:', { status: response.status, data });

      if (!response.ok) {
        throw new DocumentError(
          `Failed to create document: ${data}`,
          response.status
        );
      }

      return data;
    } catch (error) {
      console.error('Create document error:', error);
      throw error instanceof DocumentError ? error : new DocumentError(error.message);
    }
  },

  async updateDocumentContent(documentId, content) {
    console.log(`PUT ${API_BASE_URL}/${documentId}/content`);
    console.log('Request payload:', content);

    try {
      const response = await fetch(`${API_BASE_URL}/${documentId}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/html',
          'Accept': 'application/json'
        },
        body: content
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      console.log('Response:', { status: response.status, data });

      if (!response.ok) {
        throw new DocumentError(
          `Failed to update document content: ${data}`,
          response.status
        );
      }

      return data;
    } catch (error) {
      console.error('Update document content error:', error);
      throw error instanceof DocumentError ? error : new DocumentError(error.message);
    }
  },

  async updateDocumentTitle(documentId, title) {
    console.log(`PUT ${API_BASE_URL}/${documentId}/title`);
    console.log('Request payload:', { title });

    try {
      const response = await fetch(`${API_BASE_URL}/${documentId}/title`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ title })
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      console.log('Response:', { status: response.status, data });

      if (!response.ok) {
        throw new DocumentError(`Failed to update title: ${data}`, response.status);
      }

      return data;
    } catch (error) {
      console.error('Update title error:', error);
      throw error instanceof DocumentError ? error : new DocumentError(error.message);
    }
  }
};