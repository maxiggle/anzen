const API_URL = 'http://localhost:5173/api';

interface AttestationResponse {
  message: string;
  attestationId: number;
}

const attestationService = {
  createAttestation: async (attestationData: string): Promise<AttestationResponse> => {
    const response = await fetch(`${API_URL}/attestations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(attestationData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create attestation');
    }

    return response.json();
  }
}
export default attestationService;