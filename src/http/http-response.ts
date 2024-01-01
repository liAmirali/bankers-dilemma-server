export class HttpResponse {
  constructor(private message: string, private data: unknown = null, private statusCode: number = 200) {}

  getMessage() {
    return this.message;
  }

  getData() {
    return this.data;
  }

  getStatusCode() {
    return this.statusCode;
  }
}
