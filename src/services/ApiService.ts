class ApiService {
  private getHeaders(isFormData = false) {
    const { token } = JSON.parse(localStorage.getItem("user") ?? "{}");
    const headers: Record<string, string> = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };
  
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
    return headers
  }

  async get(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, any>
  ) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return fetch(url + query, {
      method: "GET",
      headers: { ...this.getHeaders(), ...(headers || {}) },
    });
  }

  async post(
    url: string,
    body?: Record<string, any> | FormData,
    headers?: Record<string, any>
  ) {
    const isFormData = body instanceof FormData;
    return fetch(url, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      headers: { ...this.getHeaders(isFormData), ...(headers || {}) },
    });
  }
}

export const httpClient = new ApiService();
