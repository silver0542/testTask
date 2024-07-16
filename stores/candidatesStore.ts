import { defineStore } from "pinia";
import { useFetch, useRuntimeConfig } from "nuxt/app";
import type {
  ICandidate,
  ICandidateState,
  TCandidateListAPI,
} from "~/types/types";

export const useCandidateStore = defineStore("candidates", {
  state: (): ICandidateState => ({
    candidates: [],
    page: 1,
    per_page: 10,
    total: 0,
    search_value: "",
  }),
  actions: {
    async getCandidates(
      page: number,
      per_page: number
    ): Promise<ICandidateState | null> {
      this.page = page;
      this.per_page = per_page;

      const url = `/api/candidates/?page=${page}&per_page=${per_page}&search_value=${this.search_value}`;

      const resp = await $fetch<TCandidateListAPI | null>(url)
        .then((res) => {
          if (res) {
            const candidates = ref<ICandidate[]>(res.rows || []);
            this.candidates = candidates.value;
            const total = res.total || 0;
            this.total = total;
            return res;
          }
          return null;
        })
        .catch((err) => {
          console.log(err);
          return null;
        });

      if (resp) {
        let result: ICandidateState = {
          candidates: this.candidates,
          page: this.page,
          per_page: this.per_page,
          total: this.total,
          search_value: this.search_value,
        };
        return result;
      }
      return resp;
    },
    async removeCandidate(candidateId: number): Promise<Response> {
      let result = await fetch(`/api/candidates/${candidateId}`, {
        method: "DELETE",
      });
      if (result.ok) {
        // console.log(result);
        // const index = this.candidates.findIndex(
        //   (c: any) => c.id === candidateId
        // );
        // if (index !== -1) {
        //   this.candidates.splice(index, 1);
        // }
        await this.getCandidates(this.page, this.per_page);
      }
      return result;
    },
    async setPagination(value: number, page: number): Promise<void> {
      this.per_page = value;
      this.page = page;
      await this.getCandidates(this.page, this.per_page);
    },
    async setSearchValue(value: string): Promise<void> {
      this.search_value = value;
      await this.getCandidates(this.page, this.per_page);
    },
    async getCandidate(id: number): Promise<ICandidate | null> {
      const url = `/api/candidates/${id}`;
      const resp = await $fetch<ICandidate>(url)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);
          return null;
        });

      return resp;
      // if (this.candidates.length > 0) {
      //   return this.candidates.find((c) => {
      //     return c.id == id;
      //   });
      // } else {
      //   await this.getCandidates();
      //   return this.candidates.find((c) => {
      //     return c.id == id;
      //   });
      // }
    },
  },
});
