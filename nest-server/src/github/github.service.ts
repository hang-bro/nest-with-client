import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubService {
  constructor() {}
  private readonly accessToken = '';
  private readonly owner = 'hang-bro';
  private readonly repo = 'nest-with-client';
  private readonly baseUrl = `https://api.github.com/repos/${this.owner}/${this.repo}`;

  async log(perPage: number = 20, page: number = 1) {
    const url = `${this.baseUrl}/commits?per_page=${perPage}&page=${page}`;
    const response = await this.makeRequest(url);
    return response.data.map((i) => i.commit);
  }

  private async makeRequest(url: string) {
    const headers = {
      Authorization: `token ${this.accessToken}`,
    };
    return axios.get(url, { headers });
  }
}
